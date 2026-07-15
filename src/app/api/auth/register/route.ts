import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { providerProfilesTable } from "@/lib/db/schema/providers";
import { eq } from "drizzle-orm";
import { hashSync } from "bcryptjs";
import { signToken, createAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role = "user" } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (!["user", "provider"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Check if user exists
    // We are using mysql2 now, so wait, does .get() work with drizzle-orm/mysql2?
    // Wait, let's look at the original code. It used .get() for better-sqlite3 but maybe wait...
    // The previous agent migrated it to mysql2. I need to make sure I don't break how they were doing it.
    // If it was .get() and it worked, I'll leave it, but typically mysql2 returns an array, so .limit(1) is safer.
    // Actually, I'll just keep the original structure for the user query but just add the provider insertion.
    
    // Oh wait, I see `const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));`
    // Let me check how it was. The file shows:
    const existingResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
      
    const existing = existingResult.length > 0 ? existingResult[0] : null;

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = hashSync(password, 10);
    await db
      .insert(usersTable)
      .values({ name, email, password: hashedPassword, role });

    let user;
    const userResult = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (userResult && userResult.length > 0) {
      user = userResult[0];
    } else {
      throw new Error("Failed to create user");
    }

    if (role === "provider") {
      await db.insert(providerProfilesTable).values({
        userId: user.id,
        businessName: name, // Default business name to user name
      });
    }

    const token = await signToken(user.id, user.role, user.status);
    const cookie = createAuthCookie(token);

    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
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
