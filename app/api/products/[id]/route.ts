import { connectToDatabase } from '@/app/lib/db';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { Product } from '@/app/lib/models';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');
    const { id } = await params;

    const product = await productsCollection.findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json({ status: 'error', message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'success', data: product }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');
    const { id } = await params;
    const body = await req.json();

    const updatedProduct = {
      ...body,
      updatedAt: new Date(),
    };

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProduct }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ status: 'error', message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      { status: 'success', message: 'Product updated', data: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');
    const { id } = await params;

    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ status: 'error', message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      { status: 'success', message: 'Product deleted' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Failed to delete product' },
      { status: 500 }
    );
  }
}
