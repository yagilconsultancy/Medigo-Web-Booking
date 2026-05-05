import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/activate',
];
const exactProtectedRoutes = ['/'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip middleware for public routes
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for the token cookie (matching how you set it: ff_sid)
  const token = req.cookies.get('medi_auth')?.value;

  // Protect routes that require authentication
  if (exactProtectedRoutes.some((route) => path.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
