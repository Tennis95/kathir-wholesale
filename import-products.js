const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// MongoDB connection
const MONGO_URI = process.env.MONGODB_URI;

// Product schema
const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  size: String,
  price: Number,
  stock: Number,
  inStock: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

async function importProducts() {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Read products.json
    const productsPath = path.join(__dirname, 'public', 'products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    console.log(`📦 Found ${productsData.length} products in products.json`);

    // Clear existing products
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Clearing ${existingCount} existing products...`);
      await Product.deleteMany({});
    }

    // Insert products
    const products = productsData.map(p => ({
      ...p,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await Product.insertMany(products);
    console.log(`✅ Successfully imported ${result.length} products!`);

    // Verify import
    const count = await Product.countDocuments();
    console.log(`📊 MongoDB now has ${count} products`);

    // Show sample products
    const samples = await Product.find().limit(3);
    console.log('\n📋 Sample products:');
    samples.forEach(p => {
      console.log(`  • ${p.name} (£${p.price}) - ${p.category}`);
    });

    console.log('\n✨ Import complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

importProducts();
