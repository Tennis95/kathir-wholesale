import { connectToDatabase } from '@/app/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/app/lib/models';
import { generateInvoicePdf } from '@/lib/generateInvoicePdf';
import { sendOrderEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');
    const body = await request.json();

    const requiredFields = ['fullName', 'email', 'mobile', 'deliveryAddress', 'items', 'termsConfirmed'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const addr = body.deliveryAddress || {};
    const addressRequiredFields = ['postcode', 'addressLine1', 'city', 'county', 'country'];
    for (const field of addressRequiredFields) {
      if (!addr[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required delivery address field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!body.termsConfirmed) {
      return NextResponse.json(
        { success: false, message: 'Terms & Conditions must be confirmed' },
        { status: 400 }
      );
    }

    const items = body.items;
    const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum: number, item: any) => sum + item.quantity * item.price, 0);
    const vat = subtotal * 0.2;
    const totalAmount = subtotal + vat;

    const orderId = `KTH-${Date.now().toString().slice(-8)}`;
    const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;

    const order: Order = {
      ...body,
      orderId,
      invoiceNo,
      totalItems,
      subtotal,
      vat,
      totalAmount,
      status: 'Pending Review',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ordersCollection.insertOne(order);
    const savedOrder = { ...order, _id: result.insertedId };

    // Generate invoice PDF + send emails in the background (non-blocking for the customer)
    const baseUrl = request.nextUrl.origin;
    (async () => {
      try {
        const pdfBuffer = await generateInvoicePdf(baseUrl, orderId);
        await sendOrderEmail(savedOrder, pdfBuffer);
      } catch (err) {
        console.error('Invoice generation / email sending failed:', err);
      }
    })();

    return NextResponse.json(
      {
        success: true,
        message: 'Order submitted successfully',
        orderId,
        invoiceNo,
        data: savedOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Error processing order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');

    const orders = await ordersCollection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(
      { success: true, count: orders.length, orders },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Error fetching orders' },
      { status: 500 }
    );
  }
}
