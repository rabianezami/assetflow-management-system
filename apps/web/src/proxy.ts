import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { locales, type Locale } from "./i18n/config";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function pathnameLocale(pathname: string): Locale {
  const maybe = pathname.split("/")[1];
  if (locales.includes(maybe as Locale)) {
    return maybe as Locale;
  }
  return routing.defaultLocale;
}

function stripLocalePrefix(pathname: string): string {
  const locale = pathnameLocale(pathname);
  if (pathname === `/${locale}`) {
    return "/";
  }
  if (pathname.startsWith(`/${locale}/`)) {
    return pathname.slice(locale.length + 1) || "/";
  }
  return pathname;
}

function matchesPathPrefix(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}

function isAuthPath(path: string): boolean {
  return path === "/login" || path === "/signup";
}

const PROTECTED_PREFIXES = ["/dashboard", "/assets", "/admin"] as const;

function isProtectedPath(path: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => matchesPathPrefix(path, prefix));
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathnameLocale(pathname);
  const path = stripLocalePrefix(pathname);

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const isLoggedIn = Boolean(token);

  if (!isLoggedIn && isProtectedPath(path)) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (isLoggedIn && isAuthPath(path)) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
