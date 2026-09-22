import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  primaryKey,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
export const seasons = pgTable("seasons", {
  id: integer().primaryKey(),
  closesAt: timestamp("closes_at", { withTimezone: true }).notNull(),
  finalizedAt: timestamp("finalized_at", { withTimezone: true }),
});
export const nominees = pgTable(
  "nominees",
  {
    id: uuid().primaryKey(),
    seasonId: integer("season_id")
      .notNull()
      .references(() => seasons.id),
    company: text().notNull(),
    headline: text().notNull(),
    description: text().notNull(),
    category: text().notNull(),
    sources: jsonb().$type<string[]>().notNull(),
    images: jsonb().$type<{ kind: "upload" | "external"; url: string; alt: string }[]>().notNull().default(sql`'[]'::jsonb`),
    status: text().notNull().default("visible"),
    duplicateOf: uuid("duplicate_of"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("nominees_season_idx").on(t.seasonId)],
);
export const voters = pgTable("voters", {
  id: uuid().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export const votes = pgTable(
  "votes",
  {
    nomineeId: uuid("nominee_id")
      .notNull()
      .references(() => nominees.id),
    voterId: uuid("voter_id")
      .notNull()
      .references(() => voters.id),
  },
  (t) => [primaryKey({ columns: [t.nomineeId, t.voterId] })],
);
export const reports = pgTable("reports", {
  id: uuid().primaryKey(),
  nomineeId: uuid("nominee_id")
    .notNull()
    .references(() => nominees.id),
  reason: text().notNull(),
  resolved: integer().notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export const limits = pgTable("rate_limits", {
  key: text().primaryKey(),
  count: integer().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
export const results = pgTable("results", {
  seasonId: integer("season_id")
    .primaryKey()
    .references(() => seasons.id),
  snapshot: jsonb().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
