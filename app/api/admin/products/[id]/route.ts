import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

function verifyAdminToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return { valid: false, user: null };
    }

    const token = authHeader.substring(7);
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    if (!decoded.isAdmin) {
      return { valid: false, user: null };
    }

    return { valid: true, user: decoded };
  } catch {
    return { valid: false, user: null };
  }
}

// GET single product
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const product = await Product.findById(id);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = verifyAdminToken(req);
    if (!auth.valid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { name, category, description, price, size, stock, imageUrl, discount } = body;

    const product = await Product.findOneAndUpdate(
      { id },
      {
        name,
        category,
        description,
        price: parseFloat(price),
        size,
        stock: parseInt(stock) || 0,
        imageUrl,
        discount: discount ? parseFloat(discount) : 0,
        inStock: parseInt(stock) > 0,
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Product updated successfully', data: product },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Admin Products PUT]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error updating product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = verifyAdminToken(req);
    if (!auth.valid) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const product = await Product.findOneAndDelete({ id });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Product deleted successfully', data: product },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Admin Products DELETE]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error deleting product' },
      { status: 500 }
    );
  }
}
