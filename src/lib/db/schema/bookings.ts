import { sql } from "drizzle-orm";
import { mysqlTable, varchar, int, float, timestamp } from "drizzle-orm/mysql-core";

export const bookingsTable = mysqlTable("bookings", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  hotelId: int("hotel_id").notNull(),
  hotelName: varchar("hotel_name", { length: 255 }).notNull(),
  hotelImage: varchar("hotel_image", { length: 255 }).notNull().default(""),
  destinationName: varchar("destination_name", { length: 255 }).notNull(),
  checkIn: varchar("check_in", { length: 255 }).notNull(),
  checkOut: varchar("check_out", { length: 255 }).notNull(),
  guests: int("guests").notNull().default(1),
  totalPrice: float("total_price").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("upcoming"),
  createdAt: timestamp("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export type Booking = typeof bookingsTable.$inferSelect;
export type InsertBooking = typeof bookingsTable.$inferInsert;
