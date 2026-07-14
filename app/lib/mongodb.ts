import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Debug: Log connection status
console.log('[MongoDB] Connection URI loaded:', MONGODB_URI ? 'YES' : 'NO');

if (!MONGODB_URI) {
  console.error('[MongoDB] ERROR: MONGODB_URI not found in environment variables');
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // Return existing connection if available
  if (cached.conn) {
    console.log('[MongoDB] Using cached connection');
    return cached.conn;
  }

  // Create new connection if not already in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    console.log('[MongoDB] Initiating new connection...');

    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongoose) => {
        console.log('[MongoDB] ✅ Successfully connected to MongoDB Atlas');
        return mongoose;
      })
      .catch((error) => {
        console.error('[MongoDB] ❌ Connection failed:', error.message);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    console.log('[MongoDB] Connection established');
    return cached.conn;
  } catch (error: any) {
    cached.promise = null;
    console.error('[MongoDB] Connection error details:', {
      message: error.message,
      code: error.code,
      name: error.name,
    });
    throw new Error(`MongoDB Connection Failed: ${error.message}`);
  }
}
