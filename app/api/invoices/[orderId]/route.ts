import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    await connectDB();

    const { orderId } = await params;

    // Fetch order by ID or order number
    const order = await Order.findById(orderId).populate('userId', 'name email phone');

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Format invoice data
    const invoiceData = {
      invoiceNumber: order._id.toString().substring(0, 8).toUpperCase(),
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      status: order.status,
      paymentStatus: order.paymentStatus,

      customer: {
        name: order.userId?.name || 'N/A',
        email: order.userId?.email || 'N/A',
        phone: order.userId?.phone || 'N/A',
      },

      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress || order.shippingAddress,

      items: order.items.map((item: any) => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: 14.99, // Default price, ideally would fetch from product
      })),

      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,

      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      notes: order.notes,
    };

    return NextResponse.json(
      { success: true, data: invoiceData },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Invoice API Error]', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch invoice'
      },
      { status: 500 }
    );
  }
}
