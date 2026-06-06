import { pgTable, text, timestamp, numeric, boolean, varchar, jsonb, integer } from 'drizzle-orm/pg-core';

export const contests = pgTable('contests', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  source: varchar('source', { length: 255 }).notNull(),
  sourceUrl: text('source_url').notNull(),
  contestType: varchar('contest_type', { length: 50 }).default('sweepstakes'), // sweepstakes, instant-win, skill, etc.
  hasAMOE: boolean('has_amoe').notNull().default(false),
  amoeMethod: text('amoe_method'), // Description of AMOE method
  physicalRequirements: text('physical_requirements'), // Details if mail-in or other physical actions needed
  rules: text('rules'),
  prizeDescription: text('prize_description').notNull(),
  estimatedValue: numeric('estimated_value', { precision: 12, scale: 2 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date').notNull(),
  eligibility: text('eligibility'), // Geographic restrictions, age requirements, etc.
  relatedEvent: varchar('related_event', { length: 255 }), // e.g., 'worldcup', 'superbowl', etc.
  verified: boolean('verified').default(false),
  verificationScore: numeric('verification_score', { precision: 3, scale: 2 }), // 0-1 confidence score from AI analysis
  metadata: jsonb('metadata'), // Additional scraped data
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const scrapeLogs = pgTable('scrape_logs', {
  id: varchar('id', { length: 255 }).primaryKey(),
  source: varchar('source', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'success', 'partial', 'failed'
  contestsFound: integer('contests_found').default(0),
  contestsAdded: integer('contests_added').default(0),
  error: text('error'),
  executedAt: timestamp('executed_at').defaultNow(),
});

export const userApplications = pgTable('user_applications', {
  id: varchar('id', { length: 255 }).primaryKey(),
  contestId: varchar('contest_id', { length: 255 }).notNull().references(() => contests.id),
  status: varchar('status', { length: 50 }).default('pending'), // pending, submitted, confirmed, expired
  appliedAt: timestamp('applied_at').defaultNow(),
  confirmationDetails: jsonb('confirmation_details'),
});
