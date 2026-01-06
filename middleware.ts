import { NextResponse, type NextRequest } from "next/server";

const hashKey = async (value: string) => {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login") || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/identity/admin");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const adminKey = process.env.ADMIN_PORTAL_KEY || "";
  if (!adminKey) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const expected = await hashKey(adminKey);
  const cookie = request.cookies.get("admin_access")?.value;

  if (!cookie || cookie !== expected) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/identity/admin/:path*"],
};
