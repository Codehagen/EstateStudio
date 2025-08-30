import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

export async function middleware(request: NextRequest) {
  // Protected routes that require authentication
  const protectedPaths = ["/dashboard"];
  
  // Check if the current path needs protection
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    try {
      // Check session using Better Auth's endpoint
      const { data: session } = await betterFetch<{ session: any; user: any }>(
        "/api/auth/get-session",
        {
          baseURL: request.nextUrl.origin,
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );
      
      if (!session) {
        // No valid session, redirect to sign-in
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("from", request.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
      }
    } catch (error) {
      // Error checking session, redirect to sign-in
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match all routes except static files and api routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};