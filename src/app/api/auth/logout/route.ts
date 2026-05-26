import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');
  } catch (error) {
    console.error('Error deleting session cookie:', error);
  }
  
  // Redirect to login page
  const loginUrl = new URL('/auth/login', req.nextUrl.origin);
  return NextResponse.redirect(loginUrl);
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');
  } catch (error) {
    console.error('Error deleting session cookie:', error);
  }
  
  return NextResponse.json({ success: true });
}
