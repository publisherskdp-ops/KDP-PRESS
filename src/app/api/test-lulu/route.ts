
import { NextResponse } from 'next/server';
import { lulu } from '@/lib/lulu';

export async function GET() {
  try {
    const token = await lulu.getAccessToken();
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to Lulu API',
      token_preview: `${token.substring(0, 10)}...`
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
