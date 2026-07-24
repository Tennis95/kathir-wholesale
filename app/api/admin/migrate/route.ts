import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    await connectDB();

    // Read products from JSON file
    const filePath = path.join(process.cwd(), 'public', 'products.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(jsonData);

    // Check which products already exist
    const existingIds = new Set();
    const existingProducts = await Product.find({}, { id: 1 });
    existingProducts.forEach((p: any) => existingIds.add(p.id));

    // Import products
    let imported = 0;
    let skipped = 0;

    for (const prod of products) {
      // Skip if already exists
      if (existingIds.has(prod.id.toString())) {
        skipped++;
        continue;
      }

      await Product.create({
        id: prod.id.toString(),
        name: prod.name,
        category: prod.category,
        size: prod.size || '1kg',
        price: prod.price,
        stock: prod.stock || 0,
        inStock: prod.inStock !== false,
        description: '',
        imageUrl: '',
        discount: 0,
        rating: 4.5,
        reviews: [],
      });

      imported++;
    }

    return NextResponse.json(
      {
        success: true,
        message: `Migration completed. Imported: ${imported}, Skipped: ${skipped}`,
        imported,
        skipped,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Migration Error]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Migration failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const count = await Product.countDocuments({});

    return NextResponse.json(
      { success: true, productCount: count },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
