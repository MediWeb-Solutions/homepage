import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { db } from '$lib/server/db';
import { paymentTransactions, enrollments } from '$lib/server/schema';
import { getStripe } from '$lib/server/stripe';
import type { RequestHandler } from './$types';

async function grantAccess(sessionId: string, userId: string, courseSlug: string) {
  await db
    .insert(enrollments)
    .values({
      id: randomUUID(),
      userId,
      courseSlug,
      sessionId,
      status: 'active'
    })
    .onConflictDoUpdate({
      target: [enrollments.userId, enrollments.courseSlug],
      set: {
        sessionId,
        status: 'active',
        enrolledAt: new Date()
      }
    });
}

export const GET: RequestHandler = async ({ params }) => {
  const sessionId = params.session_id;
  const [record] = await db
    .select()
    .from(paymentTransactions)
    .where(eq(paymentTransactions.sessionId, sessionId))
    .limit(1);
  if (!record) error(404, 'Transaksjon ikke funnet');

  if (record.paymentStatus !== 'paid') {
    const checkout = await getStripe().checkout.sessions.retrieve(sessionId);
    if (checkout.payment_status === 'paid') {
      await db
        .update(paymentTransactions)
        .set({
          status: 'completed',
          paymentStatus: 'paid',
          stripePaymentIntentId:
            typeof checkout.payment_intent === 'string' ? checkout.payment_intent : null,
          updatedAt: new Date()
        })
        .where(eq(paymentTransactions.sessionId, sessionId));
      await grantAccess(sessionId, record.userId, record.courseSlug);

      return json({
        session_id: sessionId,
        status: 'completed',
        payment_status: 'paid',
        course_slug: record.courseSlug
      });
    }
  }

  return json({
    session_id: record.sessionId,
    status: record.status,
    payment_status: record.paymentStatus,
    course_slug: record.courseSlug
  });
};
