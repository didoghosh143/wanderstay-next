import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { compareSync } from "bcryptjs";
import { signToken, createAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .get();

    if (!user || !compareSync(password, user.password)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
