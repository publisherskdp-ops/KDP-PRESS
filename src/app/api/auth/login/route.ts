import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt'; // Swapped crypto for bcrypt
import crypto from 'crypto'; // Kept ONLY for fallback support (optional)
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { email: emailOrUsername, password } = body;
    
    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/Username and Password are required' },
        { status: 400 }
      );
    }
    
    // Support logging in by either email (case-insensitive) or username
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { name: emailOrUsername }
      ]
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid username/email or password' },
        { status: 401 }
      );
    }
    
    // 1. Check password using bcrypt
    let isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    // 2. FALLBACK: Check if user is still using the old SHA-256 crypto hash
    if (!isPasswordCorrect) {
      const oldCryptoHash = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');
        
      if (user.password === oldCryptoHash) {
        isPasswordCorrect = true;
        
        // Dynamic upgrade: Convert this old user to bcrypt on the fly
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }
      
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, error: 'Invalid username/email or password' },
        { status: 401 }
      );
    }
    
    // Generate session payload
    const sessionPayload = {
      id: user.id || user._id.toHexString(),
      name: user.name,
      email: user.email
    };
    
    const sessionToken = await signSession(sessionPayload);
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    return NextResponse.json({
      success: true,
      user: {
        id: sessionPayload.id,
        name: sessionPayload.name,
        email: sessionPayload.email
      }
    });
    
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}