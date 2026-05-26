import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // 1. Force /auth/signup to redirect to /auth/login (Enforce "no registration")
  if (pathname === '/auth/signup') {
    const loginUrl = new URL('/auth/login', req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
  
  // Get session cookie
  const sessionCookie = req.cookies.get('session')?.value;
  
  // Verify session (Web Crypto, Edge compatible)
  const session = sessionCookie ? await verifySession(sessionCookie) : null;
  
  // 2. Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      const loginUrl = new URL('/auth/login', req.nextUrl.origin);
      // Optional: keep track of where the user was going
      loginUrl.searchParams.set('callbackUrl', pathname);
      
      const response = NextResponse.redirect(loginUrl);
      // Clear invalid cookie if any
      if (sessionCookie) {
        response.cookies.delete('session');
      }
      return response;
    }
  }
  
  // 3. Prevent logged-in users from accessing the login page
  if (pathname === '/auth/login') {
    if (session) {
      const dashboardUrl = new URL('/dashboard', req.nextUrl.origin);
      return NextResponse.redirect(dashboardUrl);
    }
  }
  
  return NextResponse.next();
}

// Config to specify matching routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/signup',
    '/auth/login'
  ]
};
