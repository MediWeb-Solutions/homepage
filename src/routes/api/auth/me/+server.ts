import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ locals }) => {
  if (!locals.user) {
    return json({ detail: 'Ikke innlogget' }, { status: 401 });
  }

  return json({
    user: {
      id: locals.user.id,
      email: locals.user.email,
      name: locals.user.name
    }
  });
};
