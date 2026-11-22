import { building } from '$app/environment';
import { auth } from '$lib/server/auth';

export async function handle({ event, resolve }) {
  if (!building) {
    const session = await auth.api.getSession({ headers: event.request.headers });
    event.locals.user = session?.user ?? null;
  }

  return resolve(event);
}
