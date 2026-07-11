import { connectToDatabase } from '../app/lib/db';
import { Product } from '../app/lib/models';
import fs from 'fs';
import path from 'path';

const PRODUCTS_JSON_PATH = path.join(process.cwd(), 'public', 'products.json');

async function migrateProducts() {
  try {
    console.log('📦 Starting product migration to MongoDB...');

    // Read products from JSON file
    if (!fs.existsSync(PRODUCTS_JSON_PATH)) {
      console.error('❌ products.json not found');
      return;
    }

    const jsonData = fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8');
    const products = JSON.parse(jsonData);

    console.log(`📄 Found ${products.length} products in JSON file`);

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');

    // Check for existing products
    const existingCount = await productsCollection.countDocuments();
    console.log(`📊 MongoDB has ${existingCount} existing products`);

    // Clear existing products (optional)
    if (existingCount > 0) {
      console.log('⚠️  Clearing existing products...');
      await productsCollection.deleteMany({});
    }

    // Insert products with timestamps
    const productsWithTimestamps = products.map((p: any) => ({
      ...p,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await productsCollection.insertMany(productsWithTimestamps);

    console.log(`✅ Successfully migrated ${result.insertedIds.length} products to MongoDB`);
    console.log('✨ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateProducts();
