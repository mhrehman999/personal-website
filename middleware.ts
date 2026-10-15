import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const developmentScriptSource = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
  const csp = [
    "default-src 'self'", "base-uri 'self'", "object-src 'none'", "frame-ancestors 'none'",
    "form-action 'self' https://challenges.cloudflare.com",
    `script-src 'self' 'nonce-${nonce}'${developmentScriptSource} https://challenges.cloudflare.com https://cal.com https://*.cal.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com", "img-src 'self' data: blob: https://cal.com https://*.cal.com https://challenges.cloudflare.com",
    "connect-src 'self' https://challenges.cloudflare.com https://*.cal.com https://vitals.vercel-insights.com https://*.vercel-insights.com",
    "frame-src https://challenges.cloudflare.com https://cal.com https://*.cal.com", "upgrade-insecure-requests",
  ].join("; ");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
