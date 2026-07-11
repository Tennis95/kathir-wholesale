'use client';

export default function BestSellersPage() {
  return (
    <div style={{ background: '#8FD3F4', minHeight: '100vh' }}>
      <div className="bg-white border-b py-3" style={{ borderColor: '#8FD3F4' }}>
        <div className="max-w-7xl mx-auto px-4 text-sm">
          <a href="/" className="text-sky-600 hover:underline">Home</a>
          <span className="text-gray-400 mx-2">/</span>
          <span style={{ color: '#1F2937' }} className="font-semibold">Best Sellers</span>
        </div>
      </div>

      <div className="bg-white shadow-md border-b-2" style={{ borderColor: '#8FD3F4' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1F2937' }}>⭐ Best Sellers</h1>
          <p className="text-gray-600 text-lg">Most popular products trusted by thousands of customers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-center text-gray-600 text-lg py-12">
            Browse our <a href="/categories" className="text-sky-600 hover:underline font-bold">Categories page</a> to view all our best-selling products with real-time inventory and pricing.
          </p>
        </div>
      </div>
    </div>
  );
}
