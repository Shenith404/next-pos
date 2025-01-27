import allowableRoutes from "@/config/allowbleRoutes";
import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { CustomJwtPayload } from "./app/(frontend)/types/interfaces";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Normalize the pathname by removing empty segments and joining it back
  const customizedPathname = pathname
    .split("/")
    .filter((segment) => segment.trim() !== "");

  // allow access to the root route
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Redirect authenticated users trying to access unauthenticated routes
  if (
    token &&
    allowableRoutes.NO_AUTH_ROUTES.some((route) =>
      customizedPathname[0].startsWith(route)
    )
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to public routes
  if (
    allowableRoutes.PUBLIC_ROUTES.some(
      (route) => customizedPathname[0] === route
    )
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (customizedPathname[0] === "dashboard") {
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    const userRole = (decodedToken?.role ||
      "SHOP_OPERATOR") as keyof typeof allowableRoutes;
    const allowable = allowableRoutes[userRole].includes(customizedPathname[1]);
    // console.log("middleware.ts", decodedToken, userRole, allowable);

    if (allowable) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except for Next.js internals, static files, and assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
