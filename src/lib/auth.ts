import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "wanderstay-secret-key-change-in-production"
);
const COOKIE_NAME = "wanderstay_token";

export async function signToken(userId: number, role: string = "user", status: string = "active"): Promise<string> {
  return new SignJWT({ userId, role, status })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ userId: number; role: string; status: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { 
      userId: payload.userId as number, 
      role: (payload.role as string) || "user",
      status: (payload.status as string) || "active"
    };
  } catch {
    return null;
  }
}

export async function getSession(request?: NextRequest): Promise<{ userId: number; role: string; status: string } | null> {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get(COOKIE_NAME)?.value;
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(COOKIE_NAME)?.value;
  }

  if (!token) return null;
  return verifyToken(token);
}

export function createAuthCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}

export function clearAuthCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
