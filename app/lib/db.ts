import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const client = new MongoClient(mongoUri);
    await client.connect();

    const db = client.db(process.env.DB_NAME || 'kathir_wholesale');

    cachedClient = client;
    cachedDb = db;

    console.log('✅ MongoDB connected successfully');
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

export { connectToDatabase };
export type { Db };
