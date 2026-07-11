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

// GET all orders
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.valid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ orders, count: orders.length }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error fetching orders' },
      { status: 500 }
    );
  }
}
