import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    );

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (order.userId.toString() !== decoded.userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Only allow editing if order status is pending
    if (order.status !== 'pending') {
      return NextResponse.json(
        { message: 'Can only edit pending orders' },
        { status: 400 }
      );
    }

    const { items, shippingAddress } = await req.json();

    // Validate items
    if (items && Array.isArray(items)) {
      let newSubtotal = 0;

      for (const item of items) {
        if (item.quantity <= 0) {
          return NextResponse.json(
            { message: 'Item quantity must be greater than 0' },
            { status: 400 }
          );
        }

        // Get product price
        const product = await Product.findById(item.productId);
        if (!product) {
          return NextResponse.json(
            { message: `Product not found: ${item.name}` },
            { status: 404 }
          );
        }

        newSubtotal += (product.price || 0) * item.quantity;
      }

      order.items = items;
      order.subtotal = newSubtotal;

      // Recalculate tax and total
      order.tax = Math.round(newSubtotal * 0.1 * 100) / 100;
      order.shipping = newSubtotal > 100 ? 0 : 10;
      order.total = newSubtotal + order.tax + order.shipping;
    }

    // Update shipping address if provided
    if (shippingAddress) {
      order.shippingAddress = {
        street: shippingAddress.street || order.shippingAddress.street,
        city: shippingAddress.city || order.shippingAddress.city,
        state: shippingAddress.state || order.shippingAddress.state,
        zipCode: shippingAddress.zipCode || order.shippingAddress.zipCode,
        country: shippingAddress.country || order.shippingAddress.country,
      };
    }

    await order.save();

    return NextResponse.json(
      { message: 'Order updated successfully', order },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Orders] Update error:', error);

    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: error.message || 'Error updating order' },
      { status: 500 }
    );
  }
}
