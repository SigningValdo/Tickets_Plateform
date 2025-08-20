import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Check if the user is an admin
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "ADMIN"
    ) {
      // If not an admin, redirect to the home page
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // A user is authorized if they have a token (are logged in)
    },
    pages: {
      signIn: "/auth/login", // Redirect to this page if not authorized
    },
  }
);

// Applies next-auth only to matching routes
export const config = {
  matcher: ["/admin/:path*"],
};
