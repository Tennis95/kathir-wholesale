import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    console.log('[Bulk Orders] Request received');

    await connectDB();
    console.log('[Bulk Orders] Database connected');

    const { orderIds, status, reason } = await req.json();

    // Validation
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Please provide at least one order ID' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Please provide a status' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Limit bulk operations to prevent abuse
    if (orderIds.length > 1000) {
      return NextResponse.json(
        { success: false, message: 'Cannot update more than 1000 orders at once' },
        { status: 400 }
      );
    }

    console.log(`[Bulk Orders] Updating ${orderIds.length} orders to status: ${status}`);

    // Update all orders atomically
    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      {
        status: status.toLowerCase(),
        updatedAt: new Date(),
        notes: reason ? `${reason} (bulk update)` : 'Bulk status update'
      }
    );

    console.log(`[Bulk Orders] ✅ Updated ${result.modifiedCount} orders, matched ${result.matchedCount}`);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully updated ${result.modifiedCount} orders`,
        updated: result.modifiedCount,
        matched: result.matchedCount,
        failed: orderIds.length - result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Bulk Orders] ❌ Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update orders',
      },
      { status: 500 }
    );
  }
}
