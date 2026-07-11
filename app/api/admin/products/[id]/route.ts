import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

async function verifyAdmin(req: NextRequest) {
  try {
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return { valid: false, user: null };
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return { valid: false, user: null };
    }

    return { valid: true, user };
  } catch {
    return { valid: false, user: null };
  }
}

// GET single product
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error fetching product' },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { name, category, description, price, size, stock, discount } = body;

    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        name,
        category,
        description,
        price,
        size,
        stock,
        discount: discount || 0,
        inStock: stock > 0,
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Product updated successfully', product },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error updating product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error deleting product' },
      { status: 500 }
    );
  }
}
