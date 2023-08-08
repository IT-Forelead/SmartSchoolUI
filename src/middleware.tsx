import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // const hasUser = request.cookies.has("user-info");
  const hasUser = true;

  if (request.nextUrl.pathname.includes("/") && !hasUser) {
    return NextResponse.rewrite(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/login") && hasUser) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// // See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
