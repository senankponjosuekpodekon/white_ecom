import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  // The minimog demo theme is disabled in production unless explicitly enabled
  // at build time (NEXT_PUBLIC_MINIMOG_ENABLED=true).
  if (
    process.env.NEXT_PUBLIC_MINIMOG_ENABLED !== "true" &&
    /^\/[a-z]{2}(-[a-zA-Z]+)?\/minimog(\/|$)/.test(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*|app|admin|store|auth|cloud).*)"],
};
