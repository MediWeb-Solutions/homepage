import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { enrollments, progress } from './schema';
import { findCourse, progressSummary, publicCourse } from './courses';

export async function requireEnrollment(userId: string, slug: string) {
  const course = findCourse(slug);
  if (!course) {
    error(404, 'Kurs ikke funnet');
  }

  const [enrollment] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseSlug, slug),
        eq(enrollments.status, 'active')
      )
    )
    .limit(1);

  if (!enrollment) {
    error(403, 'Du har ikke tilgang til dette kurset');
  }

  return course;
}

export async function listEnrollments(userId: string) {
  const activeEnrollments = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.status, 'active')));
  const userProgress = await db.select().from(progress).where(eq(progress.userId, userId));
  const progressByCourse = new Map(userProgress.map((item) => [item.courseSlug, item]));

  return activeEnrollments.flatMap((enrollment) => {
    const course = findCourse(enrollment.courseSlug);
    if (!course) return [];

    const courseProgress = progressByCourse.get(course.slug);
    return [{
      id: enrollment.id,
      user_id: enrollment.userId,
      course_slug: enrollment.courseSlug,
      session_id: enrollment.sessionId,
      status: enrollment.status,
      enrolled_at: enrollment.enrolledAt,
      course: publicCourse(course),
      progress: progressSummary(course, courseProgress?.completed ?? []),
      last_lesson_id: courseProgress?.lastLessonId ?? null
    }];
  });
}
