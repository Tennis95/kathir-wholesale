import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'kishantholive@gmail.com',
    pass: process.env.EMAIL_PASSWORD || '',
  },
});

export async function POST(req: NextRequest) {
  try {
    const { orderId, price, reason } = await req.json();

    if (!orderId || price === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing orderId or price' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get the order
    const order = await Order.findById(orderId).populate('userId', 'name email');
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order with final price
    order.total = price;
    order.status = 'invoice_sent';
    order.notes = reason || 'Price reviewed and approved by admin';
    await order.save();

    // Generate invoice HTML
    const invoiceHtml = generateInvoiceHTML(order, price);

    // Send invoice email
    if (order.userId?.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'kishantholive@gmail.com',
        to: order.userId.email,
        subject: `Invoice - Order ${order.orderNumber}`,
        html: invoiceHtml,
      });

      console.log(`Invoice sent to ${order.userId.email} for order ${orderId}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Invoice generated and sent successfully',
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Invoice generation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate invoice',
      },
      { status: 500 }
    );
  }
}

function generateInvoiceHTML(order: any, finalPrice: number): string {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB');
  const itemsList = order.items?.map((item: any, idx: number) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${idx + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity || 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">-</td>
    </tr>
  `).join('') || '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; background: white; }
        .header { border-bottom: 3px solid #2D7BA8; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { color: #2D7BA8; margin: 0 0 5px 0; font-size: 24px; }
        .header p { margin: 3px 0; color: #666; font-size: 13px; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .details-box { flex: 1; }
        .details-box p { margin: 5px 0; font-size: 13px; }
        .details-box strong { color: #2D7BA8; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #2D7BA8; color: white; padding: 10px; text-align: left; font-weight: bold; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .total-row { background: #F0F9FE; font-weight: bold; }
        .footer { border-top: 2px solid #2D7BA8; padding-top: 15px; text-align: center; color: #666; font-size: 11px; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>KATHIR LTD</h1>
          <p>Premium Wholesale Groceries</p>
          <p>31, Ferry Road, Scunthorpe, DN15 8QF | Phone: 07459 203724 | Email: kishantholive@gmail.com</p>
        </div>

        <!-- Invoice Details -->
        <div class="invoice-details">
          <div class="details-box">
            <p><strong>BILL TO:</strong></p>
            <p><strong>${order.userId?.name || 'Customer'}</strong></p>
            <p>${order.shippingAddress?.street || ''}</p>
            <p>${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''}</p>
            <p>${order.shippingAddress?.zipCode || ''}</p>
          </div>
          <div class="details-box" style="text-align: right;">
            <p><strong>Invoice No.:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${orderDate}</p>
            <p><strong>Status:</strong> Invoice Sent</p>
          </div>
        </div>

        <!-- Items Table -->
        <table>
          <thead>
            <tr>
              <th style="width: 5%">#</th>
              <th>Item Name</th>
              <th style="width: 15%; text-align: center;">Quantity</th>
              <th style="width: 20%; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
            <tr class="total-row">
              <td colspan="3" style="text-align: right;">TOTAL AMOUNT:</td>
              <td style="text-align: right;">£${finalPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <!-- Footer -->
        <div class="footer">
          <p>© 2026 KATHIR LTD. All rights reserved.</p>
          <p>Thank you for your business! | Sowing • Reaping • Giving the Best</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
