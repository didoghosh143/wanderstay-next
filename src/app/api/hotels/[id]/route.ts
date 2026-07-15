import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hotelsTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hotelId = parseInt(id);

    if (isNaN(hotelId)) {
      return NextResponse.json({ error: "Invalid hotel ID" }, { status: 400 });
    }

    const hotelResult = await db
      .select()
      .from(hotelsTable)
      .where(eq(hotelsTable.id, hotelId))
      .limit(1);
    
    const hotel = hotelResult[0];

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel" },
      { status: 500 }
    );
  }
}
