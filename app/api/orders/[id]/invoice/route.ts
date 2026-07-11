import { NextRequest, NextResponse } from 'next/server';
import { generateInvoicePdf } from '@/lib/generateInvoicePdf';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const baseUrl = request.nextUrl.origin;
    const pdfBuffer = await generateInvoicePdf(baseUrl, id);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}
