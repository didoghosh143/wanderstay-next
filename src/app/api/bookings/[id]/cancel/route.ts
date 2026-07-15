import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookingsTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const bookingId = parseInt(id);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 }
      );
    }

    // Find booking that belongs to this user
    const booking = await db
      .select()
      .from(bookingsTable)
      .where(
        and(
          eq(bookingsTable.id, bookingId),
          eq(bookingsTable.userId, session.userId)
        )
      )
      .get();

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.status !== "upcoming") {
      return NextResponse.json(
        { error: "Only upcoming bookings can be cancelled" },
        { status: 400 }
      );
    }

    await db
      .update(bookingsTable)
      .set({ status: "cancelled" })
      .where(eq(bookingsTable.id, bookingId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
