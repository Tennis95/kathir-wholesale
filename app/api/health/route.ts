import { connectToDatabase } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Test MongoDB connection
    const adminDb = db.admin();
    await adminDb.ping();

    return NextResponse.json(
      {
        status: 'healthy',
        message: '✅ MongoDB connected successfully',
        timestamp: new Date().toISOString(),
        database: process.env.DB_NAME || 'kathir_wholesale',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        message: '❌ MongoDB connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
