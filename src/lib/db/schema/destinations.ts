import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const destinationsTable = sqliteTable("destinations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull().default("India"),
  description: text("description").notNull(),
  images: text("images", { mode: "json" }).notNull().$type<string[]>().default([]),
  tags: text("tags", { mode: "json" }).notNull().$type<string[]>().default([]),
  hotelCount: integer("hotel_count").notNull().default(0),
  rating: real("rating").notNull().default(4.5),
  bestTimeToVisit: text("best_time_to_visit").notNull().default("October to March"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export type Destination = typeof destinationsTable.$inferSelect;
export type InsertDestination = typeof destinationsTable.$inferInsert;
