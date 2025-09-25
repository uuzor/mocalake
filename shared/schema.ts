import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  mocaId: text("moca_id").unique(),
  username: text("username"),
  reputationScore: integer("reputation_score").default(0),
  verifiedFan: boolean("verified_fan").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  artistName: text("artist_name").notNull(),
  venue: text("venue").notNull(),
  eventDate: timestamp("event_date").notNull(),
  ticketPrice: integer("ticket_price").notNull(),
  maxTickets: integer("max_tickets").notNull(),
  soldTickets: integer("sold_tickets").default(0),
  imageUrl: text("image_url"),
  contractAddress: text("contract_address"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => events.id).notNull(),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  tokenId: text("token_id").unique(),
  purchasePrice: integer("purchase_price").notNull(),
  isUsed: boolean("is_used").default(false),
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

export const fanCredentials = pgTable("fan_credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  artistName: text("artist_name").notNull(),
  credentialType: text("credential_type").notNull(), // "attendance", "early_supporter", "vip"
  credentialData: text("credential_data"), // JSON string with credential details
  issuedAt: timestamp("issued_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  walletAddress: true,
  mocaId: true,
  username: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  artistName: true,
  venue: true,
  eventDate: true,
  ticketPrice: true,
  maxTickets: true,
  imageUrl: true,
});

export const insertTicketSchema = createInsertSchema(tickets).pick({
  eventId: true,
  ownerId: true,
  purchasePrice: true,
});

export const insertFanCredentialSchema = createInsertSchema(fanCredentials).pick({
  userId: true,
  artistName: true,
  credentialType: true,
  credentialData: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type InsertFanCredential = z.infer<typeof insertFanCredentialSchema>;
export type FanCredential = typeof fanCredentials.$inferSelect;
