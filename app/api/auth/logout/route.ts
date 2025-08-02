import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // In a more advanced setup, you might want to invalidate server-side sessions
    // For now, we'll just return a success response
    // The client will handle clearing localStorage
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 