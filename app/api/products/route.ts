import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    await connectDB();

    // Get all products from MongoDB
    const products = await Product.find({}).lean();

    return NextResponse.json(
      {
        status: 'success',
        count: products.length,
        data: products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.category || !body.price) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields: name, category, price' },
        { status: 400 }
      );
    }

    const product = new Product({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await product.save();

    return NextResponse.json(
      {
        status: 'success',
        message: 'Product created',
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to create product',
      },
      { status: 500 }
    );
  }
}
