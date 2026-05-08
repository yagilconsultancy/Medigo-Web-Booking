import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
  '/login',
  '/sign-up',
  '/otp',
  '/auth',
  '/forgot-password',
  '/reset-password',
  '/activate',
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip middleware for public routes
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for the auth token cookie
  // const token = req.cookies.get('medi_auth')?.value;

  // Protect all non-public routes
  // if (!token) {
  //   return NextResponse.redirect(new URL('/login', req.nextUrl));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
