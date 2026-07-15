import { sql } from "drizzle-orm";
import { mysqlTable, varchar, text, int, float, json, boolean, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";
import { providerProfilesTable } from "./providers";

export const hotelsTable = mysqlTable("hotels", {
  id: int("id").primaryKey().autoincrement(),
  ownerId: int("owner_id").references(() => providerProfilesTable.id, { onDelete: "cascade" }),
  status: mysqlEnum("status", ["active", "blocked", "pending"]).notNull().default("active"),
  destinationSlug: varchar("destination_slug", { length: 255 }).notNull(),
  destinationName: varchar("destination_name", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  images: json("images").notNull().$type<string[]>().default([]),
  starRating: int("star_rating").notNull().default(4),
  pricePerNight: int("price_per_night").notNull(),
  amenities: json("amenities").notNull().$type<string[]>().default([]),
  address: text("address").notNull(),
  state: varchar("state", { length: 255 }).notNull(),
  rating: float("rating").notNull().default(4.5),
  reviewCount: int("review_count").notNull().default(0),
  freeCancellation: boolean("free_cancellation").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export type Hotel = typeof hotelsTable.$inferSelect;
export type InsertHotel = typeof hotelsTable.$inferInsert;
