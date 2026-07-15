import { sql } from "drizzle-orm";
import { mysqlTable, varchar, int, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["user", "provider", "admin"]).notNull().default("user"),
  status: mysqlEnum("status", ["active", "blocked", "suspended"]).notNull().default("active"),
  createdAt: timestamp("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
