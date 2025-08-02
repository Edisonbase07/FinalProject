import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🧪 Testing MongoDB connection...');
    
    // Test the connection
    const conn = await connectDB();
    
    // Get connection status
    const connectionState = conn.readyState;
    const dbName = conn.db?.databaseName || 'Unknown';
    
    // Test if we can perform a simple operation
    const collections = await conn.db?.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection test successful',
      data: {
        connectionState,
        dbName,
        collections: collections?.map(col => col.name) || [],
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'MongoDB connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 