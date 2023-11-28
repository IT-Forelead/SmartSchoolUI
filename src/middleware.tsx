import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hasUser = request.cookies.has("user-info");

  if (request.nextUrl.pathname === "/dashboard/visits" && !hasUser) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (request.nextUrl.pathname === "/" && hasUser) {
    return NextResponse.redirect(new URL("/dashboard/visits", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
