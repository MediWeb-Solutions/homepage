import { json } from '@sveltejs/kit';
import { requireEnrollment } from '$lib/server/course-access';
import { progressSummary, learningCourse, instructor } from '$lib/server/courses';
import { db } from '$lib/server/db';
import { progress } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';
import { requireUser } from '$lib/server/http';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const user = requireUser(event);
  const course = await requireEnrollment(user.id, event.params.slug);
  const [courseProgress] = await db
    .select()
    .from(progress)
    .where(and(eq(progress.userId, user.id), eq(progress.courseSlug, course.slug)))
    .limit(1);
  const completed = courseProgress?.completed ?? [];

  return json({
    course: learningCourse(course),
    instructor,
    progress: progressSummary(course, completed),
    last_lesson_id: courseProgress?.lastLessonId ?? null
  });
};
