/**
 * Atals — Database Schema v0.1
 *
 * Conventions:
 * - All IDs are UUID (random, non-enumerable in URLs).
 * - All timestamps are `timestamp with time zone` stored as UTC.
 * - Enums are native Postgres ENUMs for type safety across DB+app.
 * - No ON DELETE CASCADE at DB level for user-owned data — we want soft deletes
 *   and audit trails. Cascades only for tightly-owned child rows (CVs → Profile).
 * - Vector embeddings are 384-dim (matches transformers.js all-MiniLM-L6-v2).
 *   Can swap to 1536 (OpenAI) later by migration.
 */

import {
    pgTable,
    uuid,
    text,
    varchar,
    integer,
    boolean,
    timestamp,
    pgEnum,
    jsonb,
    index,
    unique,
} from "drizzle-orm/pg-core";


export const userRoleEnum=pgEnum('user_role',['candidate','recruiter']);

export const remotePreferenceEnum = pgEnum("remote_preference", [
    "remote",
    "hybrid",
    "onsite",
    "any",
]);

export const jobStatusEnum = pgEnum("job_status", [
    "draft",
    "open",
    "closed",
    "archived",
]);

export const applicationStatusEnum = pgEnum("application_status", [
    "submitted",
    "viewed",
    "in_review",
    "moved_to_interview",
    "declined",
    "withdrawn",
]);



export const users=pgTable('users',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        email: varchar('email', {length: 320}).notNull().unique(),
        passwordHash: text('password_hash'),
        emailVerified: boolean('email_verified').notNull().default(false),
        role: userRoleEnum('role').notNull(),


        createdAt: timestamp('created_at', {withTimezone: true}).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', {withTimezone: true}).notNull().defaultNow(),
    },
    (t) => ({ emailIdx: index("users_email_idx").on(t.email) })
);