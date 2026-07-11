import { connectToDatabase } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { Product } from '@/app/lib/models';

export async function GET(req: Request) {
  try {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');

    // Get all products
    const products = await productsCollection.find({}).toArray();

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
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');

    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.category || !body.price) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields: name, category, price' },
        { status: 400 }
      );
    }

    const product: Product = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await productsCollection.insertOne(product);

    return NextResponse.json(
      {
        status: 'success',
        message: 'Product created',
        data: { ...product, _id: result.insertedId },
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
