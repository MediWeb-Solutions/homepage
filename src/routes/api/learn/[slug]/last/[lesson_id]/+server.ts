import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { requireEnrollment } from '$lib/server/course-access';
import { db } from '$lib/server/db';
import { progress } from '$lib/server/schema';
import { requireUser } from '$lib/server/http';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
  const user = requireUser(event);
  const course = await requireEnrollment(user.id, event.params.slug);
  const lessonId = event.params.lesson_id;
  if (!course.lessons.some((lesson) => lesson.id === lessonId)) {
    error(404, 'Leksjon ikke funnet');
  }

  await db
    .insert(progress)
    .values({
      id: randomUUID(),
      userId: user.id,
      courseSlug: course.slug,
      lastLessonId: lessonId
    })
    .onConflictDoUpdate({
      target: [progress.userId, progress.courseSlug],
      set: { lastLessonId: lessonId, updatedAt: new Date() }
    });

  return json({ ok: true });
};
