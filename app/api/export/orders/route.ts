import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Export orders as CSV
 * Query parameters:
 * - status: filter by status (optional)
 * - format: 'csv' or 'json' (default: csv)
 * - limit: max records to export (default: 10000)
 */
export async function GET(req: NextRequest) {
  try {
    console.log('[Export Orders] Request received');

    await connectDB();
    console.log('[Export Orders] Database connected');

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const format = searchParams.get('format') || 'csv';
    const limitParam = searchParams.get('limit') || '10000';
    const limit = Math.min(parseInt(limitParam), 10000);

    console.log(`[Export Orders] Format: ${format}, Limit: ${limit}, Status: ${status || 'all'}`);

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    // Fetch orders with limit
    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    console.log(`[Export Orders] ✅ Fetched ${orders.length} orders`);

    if (format === 'json') {
      // JSON format
      return NextResponse.json(
        {
          success: true,
          count: orders.length,
          timestamp: new Date().toISOString(),
          data: orders,
        },
        {
          headers: {
            'Content-Disposition': 'attachment; filename="orders.json"',
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // CSV format (default)
    const csv = convertOrdersToCSV(orders);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="orders_${new Date().toISOString().split('T')[0]}.csv"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[Export Orders] ❌ Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to export orders',
      },
      { status: 500 }
    );
  }
}

/**
 * Convert orders to CSV format
 */
function convertOrdersToCSV(orders: any[]): string {
  if (!orders || orders.length === 0) {
    return 'Order ID,Customer,Email,Total,Status,Date';
  }

  const headers = ['Order ID', 'Customer', 'Email', 'Total', 'Status', 'Date', 'Items Count', 'Address'];
  const headerRow = headers.map(h => `"${h}"`).join(',');

  const dataRows = orders.map(order =>
    [
      order.orderNumber || order._id,
      order.userId?.name || 'N/A',
      order.userId?.email || 'N/A',
      `£${(order.total || 0).toFixed(2)}`,
      order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'N/A',
      new Date(order.createdAt).toLocaleDateString('en-GB'),
      order.items?.length || 0,
      `${order.shippingAddress?.street || ''}, ${order.shippingAddress?.city || ''}`,
    ]
      .map(cell => {
        const value = String(cell || '');
        return `"${value.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}
