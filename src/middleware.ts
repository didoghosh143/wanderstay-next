import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "wanderstay-secret-key-change-in-production"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only protect /provider and /admin paths
  const isProviderRoute = pathname.startsWith("/provider");
  const isAdminRoute = pathname.startsWith("/admin");
  
  if (!isProviderRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("wanderstay_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;
    const status = payload.status as string;

    if (status === "blocked" || status === "suspended") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isProviderRoute && role !== "provider" && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/provider/:path*", "/admin/:path*"],
};
