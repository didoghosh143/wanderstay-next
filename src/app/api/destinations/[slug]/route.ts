import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { destinationsTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const destResult = await db
      .select()
      .from(destinationsTable)
      .where(eq(destinationsTable.slug, slug))
      .limit(1);
    const destination = destResult[0];

    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(destination);
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json(
      { error: "Failed to fetch destination" },
      { status: 500 }
    );
  }
}
