import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';

export async function GET(req: NextRequest) {
  try {
    console.log('[Export Orders PDF] Request received');

    await connectDB();
    console.log('[Export Orders PDF] Database connected');

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');
    const limitParam = searchParams.get('limit') || '1000';
    const limit = Math.min(parseInt(limitParam), 1000);

    console.log(`[Export Orders PDF] Filters: status=${status}, dateFrom=${dateFrom}, dateTo=${dateTo}`);

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = toDate;
      }
    }

    if (minAmount || maxAmount) {
      query.total = {};
      if (minAmount) {
        query.total.$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        query.total.$lte = parseFloat(maxAmount);
      }
    }

    // Fetch orders
    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    console.log(`[Export Orders PDF] ✅ Fetched ${orders.length} orders`);

    // Generate PDF
    const pdfBuffer = generateOrdersPDF(orders);
    const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

    // Return PDF
    return new NextResponse(pdfBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="orders_report_${new Date().toISOString().split('T')[0]}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[Export Orders PDF] ❌ Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to export orders as PDF',
      },
      { status: 500 }
    );
  }
}

function generateOrdersPDF(orders: any[]): Uint8Array {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 10;
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;

  // Header
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('KATHIR LTD - Orders Report', margin, yPosition);
  yPosition += 10;

  // Report Date
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Total Orders: ${orders.length}`, margin, yPosition);
  yPosition += 10;

  // Summary Statistics
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.text('Summary', margin, yPosition);
  yPosition += 6;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const statusCounts: any = {};
  orders.forEach(o => {
    statusCounts[o.status || 'unknown'] = (statusCounts[o.status || 'unknown'] || 0) + 1;
  });

  doc.text(`Total Revenue: £${totalRevenue.toFixed(2)}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Average Order Value: £${(totalRevenue / orders.length).toFixed(2)}`, margin, yPosition);
  yPosition += 5;

  // Status breakdown
  doc.text('Orders by Status:', margin, yPosition);
  yPosition += 4;
  Object.entries(statusCounts).forEach(([status, count]) => {
    doc.text(`  • ${status}: ${count}`, margin + 5, yPosition);
    yPosition += 4;
  });
  yPosition += 6;

  // Orders Table
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.text('Orders Detail', margin, yPosition);
  yPosition += 8;

  // Table Headers
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  const colWidths = [30, 35, 20, 25, 30];
  const headers = ['Order ID', 'Customer', 'Total', 'Status', 'Date'];
  let xPos = margin;
  headers.forEach((header, i) => {
    doc.text(header, xPos, yPosition);
    xPos += colWidths[i];
  });

  // Separator line
  yPosition += 2;
  doc.setDrawColor(200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 4;

  // Table Data
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);

  orders.forEach((order, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 15) {
      doc.addPage();
      yPosition = 10;
    }

    xPos = margin;
    const orderData = [
      order.orderNumber || order._id.toString().slice(-8),
      order.userId?.name || 'N/A',
      `£${(order.total || 0).toFixed(2)}`,
      order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'N/A',
      new Date(order.createdAt).toLocaleDateString('en-GB'),
    ];

    orderData.forEach((data, i) => {
      doc.text(data.toString(), xPos, yPosition);
      xPos += colWidths[i];
    });

    yPosition += 5;
  });

  // Footer
  yPosition = pageHeight - 10;
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(128);
  doc.text('KATHIR LTD - Wholesale Grocery Supplier', margin, yPosition);
  doc.text(`Page ${doc.internal.pages.length - 1}`, pageWidth - margin - 20, yPosition);

  // Return PDF as Uint8Array
  return new Uint8Array(doc.output('arraybuffer'));
}
