import { NextRequest, NextResponse } from "next/server";

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function getExpectedToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD || "admin";
  return sha256(`session:${password}`);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes (but not /api/admin/login)
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const session = req.cookies.get("admin_session");
  const expected = await getExpectedToken();

  if (!session || session.value !== expected) {
    // If this is an /admin page (not the login page itself), redirect
    if (pathname !== "/admin") {
      const loginUrl = new URL("/admin", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
