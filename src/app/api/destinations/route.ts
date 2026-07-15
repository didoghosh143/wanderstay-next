import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { destinationsTable } from "@/lib/db/schema";
import { like, eq, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const state = searchParams.get("state") || "";

    let query = db.select().from(destinationsTable).$dynamic();

    const conditions: any[] = [];
    if (search) {
      conditions.push(
        sql`(${destinationsTable.name} LIKE ${'%' + search + '%'} OR ${destinationsTable.state} LIKE ${'%' + search + '%'} OR ${destinationsTable.description} LIKE ${'%' + search + '%'})`
      );
    }
    if (state) {
      conditions.push(eq(destinationsTable.state, state));
    }

    if (conditions.length > 0) {
      for (const condition of conditions) {
        query = query.where(condition);
      }
    }

    // Get total count
    const allResults = await query;
    const total = allResults.length;

    // Paginate
    const offset = (page - 1) * limit;
    const destinations = allResults.slice(offset, offset + limit);

    return NextResponse.json({ destinations, total, page, limit });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}
