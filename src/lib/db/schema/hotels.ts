import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const hotelsTable = sqliteTable("hotels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  destinationSlug: text("destination_slug").notNull(),
  destinationName: text("destination_name").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  images: text("images", { mode: "json" }).notNull().$type<string[]>().default([]),
  starRating: integer("star_rating").notNull().default(4),
  pricePerNight: integer("price_per_night").notNull(),
  amenities: text("amenities", { mode: "json" }).notNull().$type<string[]>().default([]),
  address: text("address").notNull(),
  state: text("state").notNull(),
  rating: real("rating").notNull().default(4.5),
  reviewCount: integer("review_count").notNull().default(0),
  freeCancellation: integer("free_cancellation", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export type Hotel = typeof hotelsTable.$inferSelect;
export type InsertHotel = typeof hotelsTable.$inferInsert;
