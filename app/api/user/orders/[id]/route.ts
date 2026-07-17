import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

async function verifyUser(req: NextRequest) {
  try {
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

// GET specific order
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyUser(req);
    if (!auth.valid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Verify the order belongs to the authenticated user
    if (order.userId.toString() !== auth.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error fetching order' },
      { status: 500 }
    );
  }
}

// PATCH update order (shipping address)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyUser(req);
    if (!auth.valid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Verify the order belongs to the authenticated user
    if (order.userId.toString() !== auth.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Only allow updating shipping address if order hasn't shipped yet
    if (order.status === 'shipped' || order.status === 'delivered') {
      return NextResponse.json(
        { message: 'Cannot modify shipped or delivered orders' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { shippingAddress } = body;

    if (shippingAddress) {
      order.shippingAddress = shippingAddress;
    }

    await order.save();

    return NextResponse.json(
      { message: 'Order updated successfully', order },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error updating order' },
      { status: 500 }
    );
  }
}
