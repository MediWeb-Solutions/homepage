import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { and, eq, ne } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { db } from '$lib/server/db';
import { enrollments, paymentTransactions } from '$lib/server/schema';
import { getStripe } from '$lib/server/stripe';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is required to verify Stripe webhooks.');
  }
  const signature = request.headers.get('stripe-signature');
  if (!signature) error(400, 'Ugyldig signatur');

  let event: ReturnType<ReturnType<typeof getStripe>['webhooks']['constructEvent']>;
  try {
    event = getStripe().webhooks.constructEvent(
      Buffer.from(await request.arrayBuffer()),
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (cause) {
    if (cause instanceof Error && cause.name === 'StripeSignatureVerificationError') {
      error(400, 'Ugyldig signatur');
    }
    throw cause;
  }

  if (event.type === 'checkout.session.completed') {
    const checkout = event.data.object;
    const paymentStatus = checkout.payment_status;
    await db
      .update(paymentTransactions)
      .set({
        status: 'completed',
        paymentStatus,
        stripePaymentIntentId:
          typeof checkout.payment_intent === 'string' ? checkout.payment_intent : null,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(paymentTransactions.sessionId, checkout.id),
          ne(paymentTransactions.paymentStatus, 'paid')
        )
      );

    const metadata = checkout.metadata;
    if (paymentStatus === 'paid' && metadata?.user_id && metadata.course_slug) {
      await db
        .insert(enrollments)
        .values({
          id: randomUUID(),
          userId: metadata.user_id,
          courseSlug: metadata.course_slug,
          sessionId: checkout.id,
          status: 'active'
        })
        .onConflictDoUpdate({
          target: [enrollments.userId, enrollments.courseSlug],
          set: {
            sessionId: checkout.id,
            status: 'active',
            enrolledAt: new Date()
          }
        });
    }
  }

  return json({ status: 'ok' });
};
