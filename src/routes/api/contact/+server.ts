import { error, json } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { contactMessages } from '$lib/server/schema';
import { sendContactAlert } from '$lib/server/contact-email';
import { readJson, requiredString } from '$lib/server/http';
import type { RequestHandler } from './$types';

const hitsByIp = new Map<string, number[]>();
const services = new Set(['webutvikling', 'legetjenester', 'kursvirksomhet']);
const windowMs = 60 * 60 * 1000;
const limit = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hitsByIp.get(ip) ?? []).filter((timestamp) => now - timestamp < windowMs);
  recent.push(now);
  hitsByIp.set(ip, recent);
  return recent.length > limit;
}

export const POST: RequestHandler = async (event) => {
  const body = await readJson(event);
  const name = requiredString(body, 'name', 1, 200);
  const email = requiredString(body, 'email', 3, 254).toLowerCase();
  const message = requiredString(body, 'message', 1, 4000);
  const serviceValue = body.service;
  if (serviceValue !== undefined && serviceValue !== null && typeof serviceValue !== 'string') {
    error(400, 'Ugyldig forespørsel');
  }
  const service = typeof serviceValue === 'string' && serviceValue ? serviceValue : null;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error(400, 'Ugyldig e-postadresse');
  }
  if (service && !services.has(service)) {
    error(400, 'Ugyldig tjeneste');
  }
  if (isRateLimited(event.getClientAddress())) {
    error(429, 'For mange meldinger. Prøv igjen senere.');
  }

  const id = randomUUID();
  await db.insert(contactMessages).values({ id, name, email, service, message });

  try {
    const emailId = await sendContactAlert({ name, email, service, message });
    await db
      .update(contactMessages)
      .set({ alertStatus: 'sent', alertEmailId: emailId })
      .where(eq(contactMessages.id, id));
  } catch (cause) {
    const details = cause instanceof Error ? cause.message : 'Unknown contact email error';
    console.error('Contact alert failed', { id, error: details });
    await db
      .update(contactMessages)
      .set({ alertStatus: 'failed', alertError: details.slice(0, 1000) })
      .where(eq(contactMessages.id, id));
  }

  return json({ ok: true, id });
};
