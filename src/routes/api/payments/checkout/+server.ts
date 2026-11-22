import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { findCourse } from '$lib/server/courses';
import { paymentTransactions, enrollments } from '$lib/server/schema';
import { getStripe } from '$lib/server/stripe';
import { readJson, requireUser, requiredString } from '$lib/server/http';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
  const user = requireUser(event);
  const body = await readJson(event);
  const courseSlug = requiredString(body, 'course_slug', 1, 120);
  const course = findCourse(courseSlug);
  if (!course) error(404, 'Kurs ikke funnet');

  const [existingEnrollment] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, user.id),
        eq(enrollments.courseSlug, course.slug),
        eq(enrollments.status, 'active')
      )
    )
    .limit(1);
  if (existingEnrollment) error(409, 'Du er allerede påmeldt dette kurset');

  const stripe = getStripe();
  const products = await stripe.products.list({ active: true, limit: 100 });
  let product = products.data.find(
    (item) => item.metadata.emergent_product_id === course.slug
  );
  if (!product) {
    product = await stripe.products.create({
      name: course.title,
      tax_code: 'txcd_10302000',
      metadata: { managed_by: 'emergent', emergent_product_id: course.slug }
    });
  }

  let prices = await stripe.prices.list({
    lookup_keys: [course.lookup_key],
    active: true,
    limit: 1
  });
  const amount = course.price_nok * 100;
  if (prices.data.length && (prices.data[0].unit_amount !== amount || prices.data[0].currency !== 'nok')) {
    await stripe.prices.update(prices.data[0].id, { active: false });
    prices = { ...prices, data: [] };
  }
  if (!prices.data.length) {
    const newPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: amount,
      currency: 'nok',
      lookup_key: course.lookup_key,
      transfer_lookup_key: true
    });
    prices = { ...prices, data: [newPrice] };
  }

  const appUrl = (env.BETTER_AUTH_URL ?? event.url.origin).replace(/\/$/, '');
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: prices.data[0].id, quantity: 1 }],
    mode: 'payment',
    success_url: `${appUrl}/kurs/${course.slug}/betaling/vellykket?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/kurs/${course.slug}`,
    customer_email: user.email,
    metadata: {
      user_id: user.id,
      course_slug: course.slug,
      lookup_key: course.lookup_key
    }
  });

  await db.insert(paymentTransactions).values({
    sessionId: session.id,
    userId: user.id,
    courseSlug: course.slug,
    lookupKey: course.lookup_key,
    amount,
    currency: 'nok',
    status: 'initiated',
    paymentStatus: 'pending'
  });

  return json({ checkout_url: session.url, session_id: session.id });
};
