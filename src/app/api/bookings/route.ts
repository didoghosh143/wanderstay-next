import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookingsTable, hotelsTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const bookings = await db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.userId, session.userId));

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { hotelId, checkIn, checkOut, guests } = body;

    if (!hotelId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: "hotelId, checkIn, checkOut, and guests are required" },
        { status: 400 }
      );
    }

    // Get hotel details
    const hotelResult = await db
      .select()
      .from(hotelsTable)
      .where(eq(hotelsTable.id, hotelId))
      .limit(1);
      
    const hotel = hotelResult[0];

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in date" },
        { status: 400 }
      );
    }

    const nightCount = Math.max(
      1,
      Math.round(
        (checkOutDate.getTime() - checkInDate.getTime()) / 86400000
      )
    );

    const totalPrice = Math.round(hotel.pricePerNight * nightCount * 1.12);

    await db
      .insert(bookingsTable)
      .values({
        userId: session.userId,
        hotelId,
        hotelName: hotel.name,
        hotelImage: (hotel.images as string[])[0] || "",
        destinationName: hotel.destinationName,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        status: "upcoming",
      });
      
    // Assuming we don't have returning(), fetch the last booking (or just return success)
    return NextResponse.json({ success: true, message: "Booking created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
