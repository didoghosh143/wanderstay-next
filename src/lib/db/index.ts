import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

export const poolConnection = mysql.createPool(process.env.DATABASE_URL || "mysql://root:@localhost:3306/wanderstay");
export const db = drizzle(poolConnection, { schema, mode: "default" });

export * from "./schema";
