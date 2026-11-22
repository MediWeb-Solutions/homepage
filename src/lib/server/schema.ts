import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core';

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
const updatedAt = () => timestamp('updated_at', { withTimezone: true }).notNull().defaultNow();

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: createdAt(),
  updatedAt: updatedAt()
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' })
  },
  (table) => [index('session_user_id_idx').on(table.userId)]
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
    scope: text('scope'),
    password: text('password'),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (table) => [index('account_user_id_idx').on(table.userId)]
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)]
);

export const enrollments = pgTable(
  'enrollments',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    courseSlug: text('course_slug').notNull(),
    sessionId: text('session_id'),
    status: text('status').notNull().default('active'),
    enrolledAt: timestamp('enrolled_at', { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex('enrollments_user_course_idx').on(table.userId, table.courseSlug),
    index('enrollments_user_id_idx').on(table.userId)
  ]
);

export const progress = pgTable(
  'progress',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    courseSlug: text('course_slug').notNull(),
    completed: text('completed').array().notNull().default([]),
    lastLessonId: text('last_lesson_id'),
    updatedAt: updatedAt()
  },
  (table) => [uniqueIndex('progress_user_course_idx').on(table.userId, table.courseSlug)]
);

export const paymentTransactions = pgTable(
  'payment_transactions',
  {
    sessionId: text('session_id').primaryKey(),
    userId: text('user_id').notNull(),
    courseSlug: text('course_slug').notNull(),
    lookupKey: text('lookup_key').notNull(),
    amount: integer('amount').notNull(),
    currency: text('currency').notNull(),
    status: text('status').notNull(),
    paymentStatus: text('payment_status').notNull(),
    stripePaymentIntentId: text('stripe_payment_intent_id'),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (table) => [index('payment_transactions_user_id_idx').on(table.userId)]
);

export const contactMessages = pgTable('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  service: text('service'),
  message: text('message').notNull(),
  alertStatus: text('alert_status').notNull().default('pending'),
  alertEmailId: text('alert_email_id'),
  alertError: text('alert_error'),
  createdAt: createdAt()
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  enrollments: many(enrollments),
  progress: many(progress)
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] })
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] })
}));

export const enrollmentRelations = relations(enrollments, ({ one }) => ({
  user: one(user, { fields: [enrollments.userId], references: [user.id] })
}));

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(user, { fields: [progress.userId], references: [user.id] })
}));
