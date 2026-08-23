import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, getAdminAuthConfig, verifySessionToken } from '@/lib/adminSession';

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

export async function middleware(request: NextRequest) {
  const authConfig = getAdminAuthConfig();
  const isLoginRoute = request.nextUrl.pathname === '/admin/login';

  const hasSession = authConfig
    ? await verifySessionToken(authConfig.secret, request.cookies.get(ADMIN_SESSION_COOKIE)?.value)
    : false;

  if (!hasSession && !isLoginRoute) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  if (hasSession && isLoginRoute) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  return NextResponse.next();
}
