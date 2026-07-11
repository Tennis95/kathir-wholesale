import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

async function verifyAdmin(req: NextRequest) {
  try {
    const token = req.cookies.get('authToken')?.value;
    if (!token) return { valid: false, user: null };

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

// GET single order
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const order = await Order.findById(params.id).populate('userId', 'name email phone');

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error fetching order' },
      { status: 500 }
    );
  }
}

// PUT update order status
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.valid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { status, paymentStatus, trackingNumber, estimatedDelivery } = body;

    const order = await Order.findByIdAndUpdate(
      params.id,
      {
        status,
        paymentStatus,
        trackingNumber,
        estimatedDelivery,
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

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
