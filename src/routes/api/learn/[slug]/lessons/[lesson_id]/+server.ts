import { error, json } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { requireEnrollment } from '$lib/server/course-access';
import { progressSummary } from '$lib/server/courses';
import { db } from '$lib/server/db';
import { progress } from '$lib/server/schema';
import { readJson, requireUser } from '$lib/server/http';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
  const user = requireUser(event);
  const course = await requireEnrollment(user.id, event.params.slug);
  const lessonId = event.params.lesson_id;
  if (!course.lessons.some((lesson) => lesson.id === lessonId)) {
    error(404, 'Leksjon ikke funnet');
  }

  const body = await readJson(event);
  if (body.completed !== undefined && typeof body.completed !== 'boolean') {
    error(400, 'Ugyldig forespørsel');
  }
  const completed = body.completed !== false;
  const [current] = await db
    .select()
    .from(progress)
    .where(and(eq(progress.userId, user.id), eq(progress.courseSlug, course.slug)))
    .limit(1);
  const done = new Set(current?.completed ?? []);
  if (completed) done.add(lessonId);
  else done.delete(lessonId);

  await db
    .insert(progress)
    .values({
      id: randomUUID(),
      userId: user.id,
      courseSlug: course.slug,
      completed: [...done],
      lastLessonId: lessonId
    })
    .onConflictDoUpdate({
      target: [progress.userId, progress.courseSlug],
      set: {
        completed: completed
          ? sql`CASE WHEN array_position(${progress.completed}, ${lessonId}) IS NULL THEN array_append(${progress.completed}, ${lessonId}) ELSE ${progress.completed} END`
          : sql`array_remove(${progress.completed}, ${lessonId})`,
        lastLessonId: lessonId,
        updatedAt: new Date()
      }
    });

  const [updated] = await db
    .select({ completed: progress.completed })
    .from(progress)
    .where(and(eq(progress.userId, user.id), eq(progress.courseSlug, course.slug)))
    .limit(1);

  return json({ progress: progressSummary(course, updated?.completed ?? []) });
};
