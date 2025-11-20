import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const loggedIn = req.cookies.get('fg_logged_in')?.value === '1';
  const { pathname, searchParams } = req.nextUrl;
  const isPublic = pathname.startsWith('/login') || pathname.startsWith('/Signup');

  if (!loggedIn && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (loggedIn && isPublic) {
    const next = searchParams.get('next') || '/Home';
    const url = req.nextUrl.clone();
    url.pathname = next;
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};