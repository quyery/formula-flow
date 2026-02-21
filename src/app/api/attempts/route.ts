
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // In a real app, save to SQLite/Firestore here.
  console.log('[BACKEND] Received attempt:', body);
  
  return NextResponse.json({ 
    success: true, 
    message: 'Attempt saved successfully',
    xpAwarded: body.passed ? 10 : 2
  });
}
