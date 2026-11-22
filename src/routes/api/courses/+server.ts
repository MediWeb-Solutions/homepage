import { json } from '@sveltejs/kit';
import { courses, publicCourse } from '$lib/server/courses';

export function GET() {
  return json({ courses: courses.map(publicCourse) });
}
