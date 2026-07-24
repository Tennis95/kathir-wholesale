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

    // Format invoice data to match invoice page expectations
    const invoiceData = {
      orderId: order.orderNumber,
      invoiceNo: order._id.toString().substring(0, 8).toUpperCase(),
      fullName: order.userId?.name || 'N/A',
      companyName: order.userId?.companyName || '',
      email: order.userId?.email || 'N/A',
      mobile: order.userId?.phone || 'N/A',

      deliveryAddress: {
        addressLine1: order.shippingAddress?.street || '',
        addressLine2: '',
        city: order.shippingAddress?.city || '',
        county: order.shippingAddress?.state || '',
        postcode: order.shippingAddress?.zipCode || '',
        country: order.shippingAddress?.country || 'UK',
      },

      items: order.items.map((item: any) => ({
        product: {
          id: item.productId?.toString() || item.name,
          name: item.name,
          category: 'General',
          size: item.size || '',
          price: 14.99,
          stock: 999,
          inStock: true,
        },
        quantity: item.quantity,
        price: 14.99,
      })),

      totalItems: order.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      subtotal: order.subtotal || 0,
      vat: order.tax || 0,
      totalAmount: order.total || 0,

      status: order.status?.charAt(0).toUpperCase() + order.status?.slice(1).toLowerCase(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,

      termsConfirmed: true,
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
