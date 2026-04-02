import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = ['/dashboard', '/machines', '/admin'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('maskindeling_session')?.value;
  const isProtected = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isProtected && !token) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/machines/:path*', '/admin/:path*']
};
