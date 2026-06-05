import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

// Next.js expects the interception function to be a DEFAULT export
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // 1. Force /auth/signup to redirect to /auth/login (Enforce "no registration")
  if (pathname === '/auth/signup') {
    const loginUrl = new URL('/auth/login', req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
  
  // Get session cookie
  const sessionCookie = req.cookies.get('session')?.value;
  
  // Verify session (Web Crypto, Edge/Node compatible via your lib)
  const session = sessionCookie ? await decrypt(sessionCookie) : null;
  
  // 2. Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      const loginUrl = new URL('/auth/login', req.nextUrl.origin);
      loginUrl.searchParams.set('callbackUrl', pathname);
      
      const response = NextResponse.redirect(loginUrl);
      
      // FIX: Standardize cookie clearing for cross-browser reliability
      if (sessionCookie) {
        response.cookies.set('session', '', { 
          path: '/', 
          maxAge: 0,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
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