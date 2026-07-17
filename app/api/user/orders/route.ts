import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

async function verifyUser(req: NextRequest) {
  try {
    // Check Authorization header first, then cookies
    let token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      token = req.cookies.get('authToken')?.value;
    }
    if (!token) return { valid: false, userId: null };

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return { valid: true, userId: decoded.userId };
  } catch {
    return { valid: false, userId: null };
  }
}

// GET user's orders
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyUser(req);
    if (!auth.valid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({ userId: auth.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error fetching orders' },
      { status: 500 }
    );
  }
}

// POST create order
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyUser(req);
    if (!auth.valid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { items, subtotal, tax, shipping, total, shippingAddress, billingAddress } = body;

    if (!items || !total) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const orderNumber = `ORD-${Date.now()}`;

    const order = await Order.create({
      orderNumber,
      userId: auth.userId,
      items,
      subtotal,
      tax: tax || 0,
      shipping: shipping || 0,
      total,
      shippingAddress,
      billingAddress,
      status: 'pending',
      paymentStatus: 'pending',
    });

    return NextResponse.json(
      { message: 'Order created successfully', order },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error creating order' },
      { status: 500 }
    );
  }
}
