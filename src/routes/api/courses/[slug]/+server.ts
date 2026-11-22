import { error, json } from '@sveltejs/kit';
import { findCourse, publicCourse } from '$lib/server/courses';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params }) => {
  const course = findCourse(params.slug);
  if (!course) error(404, 'Kurs ikke funnet');
  return json(publicCourse(course));
};
