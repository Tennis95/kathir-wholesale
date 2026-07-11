import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Verify admin token
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

// GET all products
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const products = await Product.find().limit(100);

    return NextResponse.json(
      { products, count: products.length },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error fetching products' },
      { status: 500 }
    );
  }
}

// POST create product
export async function POST(req: NextRequest) {
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
    const { id, name, category, description, price, size, stock, discount } = body;

    if (!id || !name || !category || !price || !size) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return NextResponse.json(
        { message: 'Product ID already exists' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      id,
      name,
      category,
      description,
      price,
      size,
      stock,
      discount: discount || 0,
      inStock: stock > 0,
      createdBy: auth.user?._id,
    });

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error creating product' },
      { status: 500 }
    );
  }
}
