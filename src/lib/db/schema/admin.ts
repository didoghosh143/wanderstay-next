import { sql } from "drizzle-orm";
import { mysqlTable, varchar, int, timestamp } from "drizzle-orm/mysql-core";
import { usersTable } from "./users";

export const adminAuditLogsTable = mysqlTable("admin_audit_logs", {
  id: int("id").primaryKey().autoincrement(),
  adminId: int("admin_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 255 }).notNull(),
  targetType: varchar("target_type", { length: 255 }).notNull(), // 'user', 'provider', 'hotel'
  targetId: int("target_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export type AdminAuditLog = typeof adminAuditLogsTable.$inferSelect;
export type InsertAdminAuditLog = typeof adminAuditLogsTable.$inferInsert;
