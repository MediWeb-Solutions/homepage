import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export function requireUser(event: RequestEvent) {
  if (!event.locals.user) {
    error(401, 'Ikke innlogget');
  }

  return event.locals.user;
}

export async function readJson(event: RequestEvent): Promise<Record<string, unknown>> {
  let value: unknown;

  try {
    value = await event.request.json();
  } catch {
    error(400, 'Ugyldig forespørsel');
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    error(400, 'Ugyldig forespørsel');
  }

  return value as Record<string, unknown>;
}

export function requiredString(
  body: Record<string, unknown>,
  key: string,
  minLength = 1,
  maxLength = 4000
) {
  const value = body[key];
  if (typeof value !== 'string' || value.trim().length < minLength || value.length > maxLength) {
    error(400, 'Ugyldig forespørsel');
  }
  return value.trim();
}
