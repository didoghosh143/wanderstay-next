import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashSync } from "bcryptjs";
import { signToken, createAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .get();

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = hashSync(password, 10);
    const result = await db
      .insert(usersTable)
      .values({ name, email, password: hashedPassword })
      .returning();

    const user = result[0];
    const token = await signToken(user.id);
    const cookie = createAuthCookie(token);

    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });

    response.cookies.set(cookie);
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
