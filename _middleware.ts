import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./pages/api/auth/auth";

export async function middleware(req: NextRequest) {
  const session = await getSession({ req });

  // Define routes that do not require authentication
  const unprotectedRoutes = [
    "/login",
    "/",
    // "/dashboard",
    "/file/[id]",
    "/api/auth/callback",
    "/api/auth/session",
  ];

  // Check if the request is for an unprotected route
  if (unprotectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If there is no session and the route is protected, redirect to login
  if (!session || session.error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
