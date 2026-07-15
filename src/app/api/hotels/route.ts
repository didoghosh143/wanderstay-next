import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hotelsTable } from "@/lib/db/schema";
import { eq, gte, lte, sql, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const state = searchParams.get("state") || "";
    const destinationSlug = searchParams.get("destinationSlug") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("minRating");

    let query = db.select().from(hotelsTable).$dynamic();

    const conditions: any[] = [];
    if (search) {
      conditions.push(
        sql`(${hotelsTable.name} LIKE ${'%' + search + '%'} OR ${hotelsTable.destinationName} LIKE ${'%' + search + '%'} OR ${hotelsTable.state} LIKE ${'%' + search + '%'} OR ${hotelsTable.address} LIKE ${'%' + search + '%'} OR ${hotelsTable.description} LIKE ${'%' + search + '%'})`
      );
    }
    if (state) {
      conditions.push(eq(hotelsTable.state, state));
    }
    if (destinationSlug) {
      conditions.push(eq(hotelsTable.destinationSlug, destinationSlug));
    }
    if (minPrice) {
      conditions.push(gte(hotelsTable.pricePerNight, parseInt(minPrice)));
    }
    if (maxPrice) {
      conditions.push(lte(hotelsTable.pricePerNight, parseInt(maxPrice)));
    }
    if (minRating) {
      conditions.push(gte(hotelsTable.starRating, parseInt(minRating)));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Get total count
    const allResults = await query;
    const total = allResults.length;

    // Paginate
    const offset = (page - 1) * limit;
    const hotels = allResults.slice(offset, offset + limit);

    return NextResponse.json({ hotels, total, page, limit });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotels" },
      { status: 500 }
    );
  }
}
