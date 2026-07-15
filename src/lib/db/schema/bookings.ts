import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const bookingsTable = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  hotelId: integer("hotel_id").notNull(),
  hotelName: text("hotel_name").notNull(),
  hotelImage: text("hotel_image").notNull().default(""),
  destinationName: text("destination_name").notNull(),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  guests: integer("guests").notNull().default(1),
  totalPrice: real("total_price").notNull(),
  status: text("status").notNull().default("upcoming"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export type Booking = typeof bookingsTable.$inferSelect;
export type InsertBooking = typeof bookingsTable.$inferInsert;
