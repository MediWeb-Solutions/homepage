import { json } from '@sveltejs/kit';
import { requireUser } from '$lib/server/http';
import { listEnrollments } from '$lib/server/course-access';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const user = requireUser(event);
  return json({ enrollments: await listEnrollments(user.id) });
};
