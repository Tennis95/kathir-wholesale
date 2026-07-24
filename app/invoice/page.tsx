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
    <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh', padding: '20px' }} data-invoice-ready="true">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Background */}
        <div style={{ background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)' }} className="px-8 md:px-12 py-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/kathir logo.jpeg" alt="KATHIR LTD" className="h-16 w-16 object-contain bg-white p-2 rounded-lg" />
                <div>
                  <h1 className="text-3xl font-bold text-white">KATHIR LTD</h1>
                  <p className="text-sm font-semibold text-blue-100">PREMIUM WHOLESALE DISTRIBUTION</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-bold text-white mb-3">TAX INVOICE</h2>
              <div className="text-blue-100 text-sm space-y-1">
                <p><span className="font-semibold">Invoice:</span> {order.invoiceNo}</p>
                <p><span className="font-semibold">Order:</span> {order.orderId}</p>
                <p><span className="font-semibold">Date:</span> {orderDate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* Company Info */}
          <div className="mb-6 pb-6 border-b-2" style={{ borderColor: '#E8F4FB' }}>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>📍 Address:</strong> 31, Ferry Road, Scunthorpe DN15 8QF</p>
              <p><strong>📞 Phone:</strong> +44 (0) 1925 XXX XXX</p>
              <p><strong>📧 Email:</strong> orders@kathir.co.uk</p>
              <p><strong>🏢 VAT Number:</strong> GB XXX XXX XXX</p>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="p-4 rounded-lg" style={{ background: '#F0F9FE' }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: '#2D7BA8' }}>📋 BILL TO</h3>
              <p className="font-bold text-gray-900">{order.fullName}</p>
              {order.companyName && <p className="text-sm text-gray-600 font-semibold">{order.companyName}</p>}
              {addressLines.map((line, i) => (
                <p key={i} className="text-sm text-gray-700">{line}</p>
              ))}
            </div>

            <div className="p-4 rounded-lg" style={{ background: '#F0F9FE' }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: '#2D7BA8' }}>🚚 SHIP TO</h3>
              <p className="font-bold text-gray-900">{order.fullName}</p>
              {order.companyName && <p className="text-sm text-gray-600 font-semibold">{order.companyName}</p>}
              {addressLines.map((line, i) => (
                <p key={i} className="text-sm text-gray-700">{line}</p>
              ))}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 overflow-x-auto rounded-lg border" style={{ borderColor: '#E8F4FB' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)' }}>
                  <th className="px-4 py-4 text-left font-bold text-white">#</th>
                  <th className="px-4 py-4 text-left font-bold text-white">Item Name</th>
                  <th className="px-4 py-4 text-center font-bold text-white">Category</th>
                  <th className="px-4 py-4 text-center font-bold text-white">Qty</th>
                  <th className="px-4 py-4 text-right font-bold text-white">Price/Unit</th>
                  <th className="px-4 py-4 text-right font-bold text-white">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => {
                  const lineTotal = item.quantity * item.price;
                  return (
                    <tr key={i} className="border-b hover:bg-gray-50 transition" style={{ borderColor: '#E8F4FB' }}>
                      <td className="px-4 py-4 font-semibold" style={{ color: '#2D7BA8' }}>{i + 1}</td>
                      <td className="px-4 py-4 font-semibold text-gray-900">{item.product.name}</td>
                      <td className="px-4 py-4 text-center text-gray-600 text-xs">{item.product.category}</td>
                      <td className="px-4 py-4 text-center font-semibold text-gray-700">{item.quantity}</td>
                      <td className="px-4 py-4 text-right text-gray-700">£{(item.price || 0).toFixed(2)}</td>
                      <td className="px-4 py-4 text-right font-bold" style={{ color: '#2D7BA8' }}>£{(lineTotal || 0).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="p-4 rounded-lg" style={{ background: '#F0F9FE' }}>
              <h3 className="font-bold text-xs mb-3" style={{ color: '#2D7BA8' }}>AMOUNT IN WORDS</h3>
              <p className="text-gray-700 text-sm font-semibold">{numberToWords(order.totalAmount)}</p>
            </div>

            <div></div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm border-b pb-2" style={{ borderColor: '#E8F4FB' }}>
                <span className="text-gray-600">Total Items</span>
                <span className="font-bold text-gray-900">{order.totalItems}</span>
              </div>
              <div className="flex justify-between text-sm border-b pb-2" style={{ borderColor: '#E8F4FB' }}>
                <span className="text-gray-600">Sub Total</span>
                <span className="font-bold text-gray-900">£{(order.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm border-b pb-2 mb-2" style={{ borderColor: '#E8F4FB' }}>
                <span className="text-gray-600">VAT (20%)</span>
                <span className="font-bold text-gray-900">£{(order.vat || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold px-4 py-4 rounded-lg" style={{ background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)', color: 'white' }}>
                <span>💰 Grand Total</span>
                <span>£{(order.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Payment */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b-2" style={{ borderColor: '#E8F4FB' }}>
            <div className="p-4 rounded-lg" style={{ background: '#F0F9FE' }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: '#2D7BA8' }}>📋 PAYMENT DETAILS</h3>
              <p className="text-sm text-gray-700 mb-3"><strong>Mode:</strong> Bank Transfer / Credit Account</p>
              <p className="text-xs text-gray-600"><strong>Account:</strong> 98765432</p>
              <p className="text-xs text-gray-600"><strong>Sort Code:</strong> 51-81-34</p>
              <p className="text-xs text-gray-600 mt-2"><strong>Holder:</strong> KATHIR LTD</p>
            </div>

            <div className="p-4 rounded-lg" style={{ background: '#FEF3C7' }}>
              <h3 className="font-bold text-sm mb-2" style={{ color: '#92400E' }}>⚠️ IMPORTANT</h3>
              <p className="text-xs text-gray-700 mb-2">• Payment terms as per agreement</p>
              <p className="text-xs text-gray-700 mb-2">• Contact us for any clarifications</p>
              <p className="text-xs text-gray-700 mb-2">• Authorized signature required</p>
              <p className="text-xs text-gray-700">• Invoice valid for 30 days</p>
            </div>
          </div>

          {/* Status */}
          <div className="mb-8 flex justify-center">
            <span className="px-6 py-3 rounded-full text-sm font-bold inline-block" style={{ background: order.status === 'Delivered' ? '#D1FAE5' : order.status === 'Processing' ? '#DBEAFE' : '#FEF3C7', color: order.status === 'Delivered' ? '#065F46' : order.status === 'Processing' ? '#1E40AF' : '#92400E' }}>
              📦 Status: {order.status}
            </span>
          </div>

          {/* Footer */}
          <div className="text-center py-6 border-t-2" style={{ borderColor: '#E8F4FB' }}>
            <p className="text-xs text-gray-600 mb-1">
              © 2026 KATHIR LTD. All rights reserved. | Reg No. 16001575
            </p>
            <p className="text-xs text-gray-600">
              📧 orders@kathir.co.uk | 📞 +44 (0) 1925 XXX XXX
            </p>
            <p className="text-xs text-gray-600 mt-2 italic">
              Thank you for your business!
            </p>
          </div>

          {/* Print Button */}
          <div className="flex justify-center gap-4 mt-8 no-print">
            <button onClick={handlePrint} className="px-8 py-3 font-bold text-white rounded-lg transition hover:scale-105" style={{ background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)' }}>
              🖨️ Print Invoice
            </button>
            <button onClick={() => window.history.back()} className="px-8 py-3 font-bold text-white rounded-lg transition hover:scale-105" style={{ background: 'linear-gradient(135deg, #8FD3F4 0%, #5CB3E6 100%)' }}>
              ← Back
            </button>
          </div>
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
