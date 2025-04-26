import { pgTable, text, serial, integer, boolean, timestamp, foreignKey, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// User table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  country: text("country").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  subscribedToNewsletter: boolean("subscribed_to_newsletter").notNull().default(false),
});

// Giveaway table schema
export const giveaways = pgTable("giveaways", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  prize: text("prize").notNull(),
  category: text("category").notNull(),
  region: text("region").notNull().default("Global"),
  eligibilityRequirements: text("eligibility_requirements").notNull(),
  value: text("value"),
  targetEntries: integer("target_entries"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  isPopular: boolean("is_popular").default(false),
  isPremium: boolean("is_premium").default(false),
  isFeatured: boolean("is_featured").default(false),
  createdByUserId: integer("created_by_user_id").references(() => users.id),
});

// Referral code table schema
export const referralCodes = pgTable("referral_codes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  code: text("code").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

// Entry table schema (for giveaway entries)
export const entries = pgTable("entries", {
  id: serial("id").primaryKey(),
  giveawayId: integer("giveaway_id").notNull().references(() => giveaways.id),
  userId: integer("user_id").notNull().references(() => users.id),
  entryDate: timestamp("entry_date").notNull().defaultNow(),
  isWinner: boolean("is_winner").notNull().default(false),
  referralCodeId: integer("referral_code_id").references(() => referralCodes.id),
  entrySource: text("entry_source").default("direct"), // direct, referral, purchase
});

// Winner table schema
export const winners = pgTable("winners", {
  id: serial("id").primaryKey(),
  giveawayId: integer("giveaway_id").notNull().references(() => giveaways.id),
  userId: integer("user_id").notNull().references(() => users.id),
  entryId: integer("entry_id").notNull().references(() => entries.id),
  announcementDate: timestamp("announcement_date").notNull().defaultNow(),
  testimonial: text("testimonial"),
  location: text("location"),
});

// Referral entries schema (tracks entries earned through referrals)
export const referralEntries = pgTable("referral_entries", {
  id: serial("id").primaryKey(),
  referralCodeId: integer("referral_code_id").notNull().references(() => referralCodes.id),
  referredUserId: integer("referred_user_id").notNull().references(() => users.id),
  entryId: integer("entry_id").references(() => entries.id),
  giveawayId: integer("giveaway_id").notNull().references(() => giveaways.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  bonusEntries: integer("bonus_entries").notNull().default(1),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  giveaways: many(giveaways),
  entries: many(entries),
  winners: many(winners),
  referralCodes: many(referralCodes),
}));

export const giveawaysRelations = relations(giveaways, ({ one, many }) => ({
  creator: one(users, {
    fields: [giveaways.createdByUserId],
    references: [users.id],
  }),
  entries: many(entries),
  winners: many(winners),
  referralEntries: many(referralEntries),
}));

export const entriesRelations = relations(entries, ({ one, many }) => ({
  giveaway: one(giveaways, {
    fields: [entries.giveawayId],
    references: [giveaways.id],
  }),
  user: one(users, {
    fields: [entries.userId],
    references: [users.id],
  }),
  referralCode: one(referralCodes, {
    fields: [entries.referralCodeId],
    references: [referralCodes.id],
  }),
  winner: one(winners),
  referralEntries: many(referralEntries),
}));

export const winnersRelations = relations(winners, ({ one }) => ({
  giveaway: one(giveaways, {
    fields: [winners.giveawayId],
    references: [giveaways.id],
  }),
  user: one(users, {
    fields: [winners.userId],
    references: [users.id],
  }),
  entry: one(entries, {
    fields: [winners.entryId],
    references: [entries.id],
  }),
}));

export const referralCodesRelations = relations(referralCodes, ({ one, many }) => ({
  user: one(users, {
    fields: [referralCodes.userId],
    references: [users.id],
  }),
  referralEntries: many(referralEntries),
}));

export const referralEntriesRelations = relations(referralEntries, ({ one }) => ({
  referralCode: one(referralCodes, {
    fields: [referralEntries.referralCodeId],
    references: [referralCodes.id],
  }),
  referredUser: one(users, {
    fields: [referralEntries.referredUserId],
    references: [users.id],
  }),
  entry: one(entries, {
    fields: [referralEntries.entryId],
    references: [entries.id],
  }),
  giveaway: one(giveaways, {
    fields: [referralEntries.giveawayId],
    references: [giveaways.id],
  }),
}));

// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isAdmin: true,
});

export const insertGiveawaySchema = createInsertSchema(giveaways).omit({
  id: true,
});

export const insertEntrySchema = createInsertSchema(entries).omit({
  id: true,
  entryDate: true,
  isWinner: true,
});

export const insertWinnerSchema = createInsertSchema(winners).omit({
  id: true,
  announcementDate: true,
});

export const insertReferralCodeSchema = createInsertSchema(referralCodes).omit({
  id: true,
  createdAt: true,
});

export const insertReferralEntrySchema = createInsertSchema(referralEntries).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Giveaway = typeof giveaways.$inferSelect;
export type InsertGiveaway = z.infer<typeof insertGiveawaySchema>;

export type Entry = typeof entries.$inferSelect;
export type InsertEntry = z.infer<typeof insertEntrySchema>;

export type Winner = typeof winners.$inferSelect;
export type InsertWinner = z.infer<typeof insertWinnerSchema>;

export type ReferralCode = typeof referralCodes.$inferSelect;
export type InsertReferralCode = z.infer<typeof insertReferralCodeSchema>;

export type ReferralEntry = typeof referralEntries.$inferSelect;
export type InsertReferralEntry = z.infer<typeof insertReferralEntrySchema>;

// Enums
export const CategoryEnum = z.enum([
  "Disney+",
  "Netflix",
  "Paramount+",
  "HBO Max",
  "Hulu",
  "Amazon Prime",
  "Apple TV+",
  "Peacock",
  "Spotify",
  "YouTube Premium",
  "Other"
]);

export const RegionEnum = z.enum([
  "Global",
  "USA Only",
  "Europe",
  "Asia",
  "Australia",
  "Africa",
  "South America",
  "Other"
]);

export type Category = z.infer<typeof CategoryEnum>;
export type Region = z.infer<typeof RegionEnum>;
