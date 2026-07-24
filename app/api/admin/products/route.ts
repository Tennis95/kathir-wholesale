import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Verify admin token from Authorization header
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

// GET all products
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, count: products.length, data: products },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Admin Products GET]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching products' },
      { status: 500 }
    );
  }
}

// POST create product
export async function POST(req: NextRequest) {
  try {
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

    if (!name || !category || !price || !size) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: name, category, price, size' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      id: `PROD-${Date.now()}`,
      name,
      category,
      description,
      price: parseFloat(price),
      size,
      stock: parseInt(stock) || 0,
      imageUrl,
      discount: discount ? parseFloat(discount) : 0,
      inStock: parseInt(stock) > 0,
      createdBy: auth.user?.userId,
    });

    return NextResponse.json(
      { success: true, message: 'Product created successfully', data: product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Admin Products POST]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error creating product' },
      { status: 500 }
    );
  }
}
