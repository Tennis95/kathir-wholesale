'use client';

export const dynamic = 'force-dynamic';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Order } from '@/types';

const SAMPLE_ORDER: Order = {
  orderId: 'KTH-SAMPLE-001',
  invoiceNo: '001234',
  fullName: 'Jeena Lincoln',
  companyName: 'Sample Business Ltd',
  email: 'jeena@example.co.uk',
  mobile: '+44 7700 900000',
  deliveryAddress: {
    postcode: 'LN5 7UP',
    addressLine1: '4 Lancaster Place',
    city: 'Lincoln',
    county: 'Lincolnshire',
    country: 'United Kingdom',
  },
  items: [
    {
      product: { id: '1', name: 'Basmati Rice 10kg', category: 'Rice & Grains', size: '10kg', price: 45.5, stock: 100, inStock: true },
      quantity: 5,
      price: 45.5,
    },
  ],
  totalItems: 5,
  subtotal: 227.5,
  vat: 45.5,
  totalAmount: 273.0,
  termsConfirmed: true,
  status: 'Pending Review',
  createdAt: new Date('2026-06-03'),
  updatedAt: new Date('2026-06-03'),
};

function numberToWords(amount: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function chunk(n: number): string {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + chunk(n % 100) : '');
  }

  const whole = Math.floor(amount);
  if (whole === 0) return 'Zero Pounds Only';

  let result = '';
  const thousands = Math.floor(whole / 1000);
  const remainder = whole % 1000;

  if (thousands > 0) result += chunk(thousands) + ' Thousand ';
  if (remainder > 0) result += chunk(remainder);

  return result.trim() + ' Pounds Only';
}

function InvoiceContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const autoPrint = searchParams.get('autoprint') === '1';

  const [order, setOrder] = useState<Order | null>(orderId ? null : SAMPLE_ORDER);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${encodeURIComponent(orderId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOrder(data.data);
        } else {
          setError('Order not found');
        }
      })
      .catch(() => setError('Failed to load order'));
  }, [orderId]);

  useEffect(() => {
    if (autoPrint && order) {
      const timer = setTimeout(() => window.print(), 400);
      return () => clearTimeout(timer);
    }
  }, [autoPrint, order]);

  const handlePrint = () => {
    window.print();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading invoice...</p>
      </div>
    );
  }

  const addr = order.deliveryAddress;
  const addressLines = [
    addr.addressLine1,
    addr.addressLine2,
    [addr.city, addr.county].filter(Boolean).join(', '),
    addr.postcode,
    addr.country,
  ].filter(Boolean);

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB');

  return (
    <div style={{ background: '#8FD3F4', minHeight: '100vh', padding: '20px' }} data-invoice-ready="true">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 md:p-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-8 border-b-2" style={{ borderColor: '#8FD3F4' }}>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/kathir logo.jpeg" alt="KATHIR LTD" className="h-16 w-16 object-contain" />
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#A0522D' }}>KATHIR LTD</h1>
                <p className="text-sm font-semibold" style={{ color: '#A0522D' }}>WHOLESALE DISTRIBUTION</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">31, Ferry Road, Scunthorpe DN15 8QF</p>
            <p className="text-xs text-gray-600">Phone: +44 (0) 1925 XXX XXX</p>
            <p className="text-xs text-gray-600">Email: orders@kathir.co.uk</p>
          </div>

          <div className="text-right">
            <h2 className="text-3xl font-bold" style={{ color: '#8FD3F4' }}>Tax Invoice</h2>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Invoice No.:</strong> {order.invoiceNo}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Order No.:</strong> {order.orderId}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Date:</strong> {orderDate}
            </p>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="grid grid-cols-2 gap-12 mb-8">
          <div>
            <h3 className="font-bold text-sm mb-3" style={{ color: '#A0522D' }}>BILL TO</h3>
            <p className="font-semibold text-gray-900">{order.fullName}</p>
            {order.companyName && <p className="text-sm text-gray-600">{order.companyName}</p>}
            {addressLines.map((line, i) => (
              <p key={i} className="text-sm text-gray-600">{line}</p>
            ))}
          </div>

          <div>
            <h3 className="font-bold text-sm mb-3" style={{ color: '#A0522D' }}>SHIP TO</h3>
            <p className="font-semibold text-gray-900">{order.fullName}</p>
            {order.companyName && <p className="text-sm text-gray-600">{order.companyName}</p>}
            {addressLines.map((line, i) => (
              <p key={i} className="text-sm text-gray-600">{line}</p>
            ))}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#8FD3F4' }}>
                <th className="px-4 py-3 text-left font-bold text-white">#</th>
                <th className="px-4 py-3 text-left font-bold text-white">Item Name</th>
                <th className="px-4 py-3 text-center font-bold text-white">Category</th>
                <th className="px-4 py-3 text-center font-bold text-white">Quantity</th>
                <th className="px-4 py-3 text-right font-bold text-white">Price/Unit</th>
                <th className="px-4 py-3 text-right font-bold text-white">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => {
                const lineTotal = item.quantity * item.price;

                return (
                  <tr key={i} className="border-b" style={{ borderColor: '#8FD3F4' }}>
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.product.name}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.product.category}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-600">£{(item.price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-bold" style={{ color: '#A0522D' }}>£{(lineTotal || 0).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-sm mb-2" style={{ color: '#A0522D' }}>INVOICE AMOUNT IN WORDS</h3>
            <p className="text-gray-700 text-sm">{numberToWords(order.totalAmount)}</p>
          </div>

          <div></div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Items</span>
              <span className="font-semibold">{order.totalItems}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sub Total</span>
              <span className="font-semibold">£{(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">VAT (20%)</span>
              <span className="font-semibold">£{(order.vat || 0).toFixed(2)}</span>
            </div>
            <div
              className="flex justify-between text-lg font-bold px-4 py-3 rounded"
              style={{ background: '#8FD3F4', color: 'white' }}
            >
              <span>Grand Total</span>
              <span>£{(order.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Terms & Payment */}
        <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b-2" style={{ borderColor: '#8FD3F4' }}>
          <div>
            <h3 className="font-bold text-sm mb-2" style={{ color: '#A0522D' }}>TERMS & CONDITIONS</h3>
            <p className="text-xs text-gray-600">Contact us for T&C</p>
            <p className="text-xs text-gray-600 mt-4">
              <strong>VAT Number:</strong> GB XXX XXX XXX
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-2" style={{ color: '#A0522D' }}>PAYMENT MODE</h3>
            <p className="text-sm text-gray-700 mb-4">Bank Transfer / Credit Account</p>

            <h3 className="font-bold text-sm mb-2" style={{ color: '#A0522D' }}>PAY TO</h3>
            <p className="text-xs text-gray-600">Bank Account No.: 98765432</p>
            <p className="text-xs text-gray-600">Sort Code: 51-81-34</p>
            <p className="text-xs text-gray-600 mt-2">Account Holder's Name: KATHIR LTD</p>
          </div>
        </div>

        {/* Status */}
        <div className="mb-8 flex justify-center">
          <span
            className="px-4 py-2 rounded-full text-sm font-bold"
            style={{ background: '#FEF3C7', color: '#92400E' }}
          >
            Status: {order.status}
          </span>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t-2" style={{ borderColor: '#8FD3F4' }}>
          <p className="text-xs text-gray-600 mb-2">
            © 2026 KATHIR LTD. All rights reserved. | Reg No. 16001575
          </p>
          <p className="text-xs text-gray-600">
            Thank you for your business! For any queries, please contact us at orders@kathir.co.uk
          </p>
        </div>

        {/* Print Button */}
        <div className="flex justify-center gap-4 mt-8 no-print">
          <button
            onClick={handlePrint}
            className="px-8 py-3 font-bold text-white rounded-lg transition hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #A0522D 0%, #8B5A3C 100%)', color: 'white' }}
          >
            🖨️ Print Invoice
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 font-bold text-white rounded-lg transition hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #8FD3F4 0%, #8FD3F4 100%)', color: '#1F2937' }}
          >
            ← Back
          </button>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white;
          }
          div[style*="background: #8FD3F4"] {
            background: white !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>}>
      <InvoiceContent />
    </Suspense>
  );
}
