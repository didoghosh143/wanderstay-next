import { sql } from "drizzle-orm";
import { mysqlTable, varchar, text, int, float, json, timestamp } from "drizzle-orm/mysql-core";

export const destinationsTable = mysqlTable("destinations", {
  id: int("id").primaryKey().autoincrement(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  state: varchar("state", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull().default("India"),
  description: text("description").notNull(),
  images: json("images").notNull().$type<string[]>().default([]),
  tags: json("tags").notNull().$type<string[]>().default([]),
  hotelCount: int("hotel_count").notNull().default(0),
  rating: float("rating").notNull().default(4.5),
  bestTimeToVisit: varchar("best_time_to_visit", { length: 255 }).notNull().default("October to March"),
  createdAt: timestamp("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export type Destination = typeof destinationsTable.$inferSelect;
export type InsertDestination = typeof destinationsTable.$inferInsert;
