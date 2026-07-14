'use client';

export const dynamic = 'force-dynamic';
export default function OffersPage() {
  return (
    <div style={{ background: '#8FD3F4', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="bg-white border-b py-3" style={{ borderColor: '#8FD3F4' }}>
        <div className="max-w-7xl mx-auto px-4 text-sm">
          <a href="/" className="text-sky-600 hover:underline">Home</a>
          <span className="text-gray-400 mx-2">/</span>
          <span style={{ color: '#1F2937' }} className="font-semibold">Offers</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-md border-b-2" style={{ borderColor: '#8FD3F4' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1F2937' }}>🔥 Special Offers</h1>
          <p className="text-gray-600 text-lg">Exclusive deals and promotions for our valued customers</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1F2937' }}>Current Promotions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: '🌾 Rice & Grains Special', desc: 'Up to 40% OFF on selected rice varieties', discount: '-40%' },
              { title: '🧂 Spice Bundle Deal', desc: 'Buy 2 Spices, Get 1 FREE on all organic spices', discount: 'FREE' },
              { title: '🥛 Dairy Products Sale', desc: 'Fresh dairy items with 25% discount this week', discount: '-25%' },
              { title: '❄️ Frozen Foods Fest', desc: 'Premium frozen products at wholesale prices', discount: '-35%' },
            ].map((offer, i) => (
              <div key={i} className="border-l-4 p-6 rounded-lg" style={{ borderColor: '#A0522D', background: '#FFF8F0' }}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold" style={{ color: '#1F2937' }}>{offer.title}</h3>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">{offer.discount}</span>
                </div>
                <p className="text-gray-600">{offer.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1F2937' }}>Limited Time Deals</h2>
          <p className="text-gray-600 mb-6">Subscribe to our newsletter to get notified about flash sales and exclusive offers!</p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border-2 rounded-lg"
              style={{ borderColor: '#8FD3F4' }}
            />
            <button
              className="px-6 py-3 font-bold text-white rounded-lg transition hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #A0522D 0%, #8B5A3C 100%)' }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
