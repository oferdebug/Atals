/**
 * Atals — Database Schema v0.1
 *
 * Conventions:
 * - All IDs are UUID (random, non-enumerable in URLs).
 * - All timestamps are `timestamp with time zone` stored as UTC.
 * - Enums are native Postgres ENUMs for type safety across DB+app.
 * - No ON DELETE CASCADE at DB level for user-owned data — we want soft deletes
 *   and audit trails. Cascades only for tightly owned child rows (CVs → Profile).
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
    vector, unique,
} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";


export const userRoleEnum=pgEnum('user_role',['candidate','recruiter']);

export const remotePreferenceEnum = pgEnum("remote_preference", [
    "remote",
    "hybrid",
    "onsite",
    "any",
]);

export const jobStatusEnum = pgEnum("job_status", [
    "draft",
    "published",
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


export const users = pgTable('users',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        email: varchar('email', {length: 320}).notNull().unique(),
        passwordHash: text('password_hash'),
        emailVerified: boolean('email_verified').notNull().default(false),
        role: userRoleEnum('role').notNull(),
        createdAt: timestamp('created_at', {withTimezone: true}).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', {withTimezone: true}).notNull().defaultNow(),
    },
    (t) => [index("users_email_idx").on(t.email)]
);

export const candidateProfiles = pgTable('candidate_profiles', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().unique().references(() => users.id, {onDelete: 'cascade'}),
    fullName: varchar('full_name', {length: 200}).notNull(),
    headline: varchar('headline', {length: 300}),
    location: varchar('location', {length: 200}),
    experience: integer('experience_years'),
    skills: jsonb('skills').$type<string[]>().default([]),
    industries: jsonb('industries').$type<string[]>().default([]),
    salaryExpectationMin: integer('salary_expectation_min'),
    salaryExpectationMax: integer('salary_expectation_max'),
    remotePreference: remotePreferenceEnum('remote_preference'),
    onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
    embedding: vector('embedding', {dimensions: 384}),
    createdAt: timestamp('created_at', {withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', {withTimezone: true}).notNull().defaultNow(),
}, (t) => [
    index("candidate_profiles_user_id_idx").on(t.userId),
    index("candidate_profiles_embedding_idx").using("hnsw", t.embedding.op("vector_cosine_ops")),
]);

export const cvs = pgTable('cvs',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        candidateProfileId: uuid('candidate_profile_id')
            .notNull()
            .references(() => candidateProfiles.id, { onDelete: 'cascade' }),
        fileUrl: text('file_url').notNull(),
        fileName: varchar('file_name', { length: 300 }).notNull(),
        fileSize: integer('file_size').notNull(),
        rawText: text('raw_text'),
        structuredData: jsonb('structured_data'),
        isActive: boolean('is_active').notNull().default(true),
        parsedAt: timestamp('parsed_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),    },
    (t) => [index("cvs_candidate_profile_id_idx").on(t.candidateProfileId)],
);
export const companies = pgTable(
    "companies",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        ownerId: uuid("owner_id")
            .notNull()
            .unique() 
            .references(() => users.id, { onDelete: "cascade" }),

        name: varchar("name", { length: 200 }).notNull(),
        slug: varchar("slug", { length: 200 }).notNull().unique(), 
        logoUrl: text("logo_url"),
        description: text("description"),
        website: varchar("website", { length: 500 }),
        industry: varchar("industry", { length: 100 }),
        headquarters: varchar("headquarters", { length: 200 }),
        size: varchar("size", { length: 50 }), 

        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        index("companies_owner_id_idx").on(t.ownerId),
        index("companies_slug_idx").on(t.slug),
    ],
);
export const jobs = pgTable(
    "jobs",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        companyId: uuid("company_id")
            .notNull()
            .references(() => companies.id, { onDelete: "cascade" }),

        title: varchar("title", { length: 300 }).notNull(),
        description: text("description").notNull(),
        location: varchar("location", { length: 200 }),
        remotePreference: remotePreferenceEnum("remote_preference").notNull(),
        remotePercent: integer("remote_percent"),
        salaryMin: integer("salary_min"),
        salaryMax: integer("salary_max"),
        salaryCurrency: varchar("salary_currency", { length: 3 }).default("USD"),

        requiredSkills: jsonb("required_skills").$type<string[]>().default([]),
        preferredSkills: jsonb("preferred_skills").$type<string[]>().default([]),
        minExperienceYears: integer("min_experience_years"),

        interviewStages: jsonb("interview_stages").$type<
            Array<{ stage: string; duration?: string; description?: string }>
        >().default([]),

        status: jobStatusEnum("status").notNull().default("draft"),
        embedding: vector("embedding", { dimensions: 384 }),

        postedAt: timestamp("posted_at", { withTimezone: true }),
        closedAt: timestamp("closed_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        index("jobs_company_id_idx").on(t.companyId),
        index("jobs_status_idx").on(t.status),
        index("jobs_embedding_idx")
            .using("hnsw", t.embedding.op("vector_cosine_ops")),
    ],
);



export const applications = pgTable("applications", {
    id: uuid("id").primaryKey().defaultRandom(),
    candidateProfileId: uuid("candidate_profile_id")
        .notNull()
        .references(() => candidateProfiles.id, { onDelete: "cascade" }),
    jobId: uuid("job_id")
        .notNull()
        .references(() => jobs.id, { onDelete: "cascade" }),
    cvId: uuid("cv_id")
        .notNull()
        .references(() => cvs.id, { onDelete: "restrict" }),

    coverLetter: text("cover_letter"),
    matchScore: integer("match_score"),
    matchBreakdown: jsonb("match_breakdown").$type<{
        skillAlignment: number;
        experienceDelta: number;
        culturalFit: number;
    }>(),

    status: applicationStatusEnum("status").notNull().default("submitted"),
    statusHistory: jsonb("status_history")
        .$type<
            Array<{
                from: string | null;
                to: string;
                at: string;
                by: string;
                note?: string;
            }>
        >()
        .default([]),

    submittedAt: timestamp("submitted_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    lastStatusChangeAt: timestamp("last_status_change_at", {
        withTimezone: true,
    })
        .notNull()
        .defaultNow(),
}, (t) => [
    unique("applications_candidate_job_unique").on(
        t.candidateProfileId,
        t.jobId,
    ),
    index("applications_candidate_idx").on(t.candidateProfileId),
    index("applications_job_idx").on(t.jobId),
    index("applications_status_idx").on(t.status),
],);


export const notifications = pgTable(
    "notifications",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),

        type: varchar("type", { length: 50 }).notNull(),
        payload: jsonb("payload").notNull(),
        channel: varchar("channel", { length: 20 }).notNull().default("email"),

        sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
        externalId: varchar("external_id", { length: 100 }),
    },
    (t) => [
        index("notifications_user_id_idx").on(t.userId),
        index("notifications_sent_at_idx").on(t.sentAt),
    ],
);


export const usersRelations = relations(users, ({ one, many }) => ({
    candidateProfile: one(candidateProfiles, {
        fields: [users.id],
        references: [candidateProfiles.userId],
    }),
    company: one(companies, {
        fields: [users.id],
        references: [companies.ownerId],
    }),
    notifications: many(notifications),
}));

export const candidateProfilesRelations = relations(
    candidateProfiles,
    ({ one, many }) => ({
        user: one(users, {
            fields: [candidateProfiles.userId],
            references: [users.id],
        }),
        cvs: many(cvs),
        applications: many(applications),
    }),
);

export const cvsRelations = relations(cvs, ({ one }) => ({
    candidateProfile: one(candidateProfiles, {
        fields: [cvs.candidateProfileId],
        references: [candidateProfiles.id],
    }),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
    owner: one(users, {
        fields: [companies.ownerId],
        references: [users.id],
    }),
    jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
    company: one(companies, {
        fields: [jobs.companyId],
        references: [companies.id],
    }),
    applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
    candidateProfile: one(candidateProfiles, {
        fields: [applications.candidateProfileId],
        references: [candidateProfiles.id],
    }),
    job: one(jobs, {
        fields: [applications.jobId],
        references: [jobs.id],
    }),
    cv: one(cvs, {
        fields: [applications.cvId],
        references: [cvs.id],
    }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(users, {
        fields: [notifications.userId],
        references: [users.id],
    }),
}));