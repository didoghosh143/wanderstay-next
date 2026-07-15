import { sql } from "drizzle-orm";
import { mysqlTable, varchar, int, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";
import { usersTable } from "./users";

export const providerProfilesTable = mysqlTable("provider_profiles", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  contactInfo: varchar("contact_info", { length: 255 }),
  verificationStatus: mysqlEnum("verification_status", ["pending", "approved", "rejected"]).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export type ProviderProfile = typeof providerProfilesTable.$inferSelect;
export type InsertProviderProfile = typeof providerProfilesTable.$inferInsert;
