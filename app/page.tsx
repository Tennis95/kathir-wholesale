'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-white overflow-hidden">
      {/* Background Watermark */}
      <div
        className="fixed top-20 right-0 text-9xl font-black opacity-5 pointer-events-none"
        style={{ color: '#F9B233' }}
      >
        KATHIR
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFEF5 0%, #FFFBF0 100%)' }}>
        {/* Gradient Circle Background */}
        <div
          className="absolute top-32 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #F9B233, transparent)' }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #C6E33D, transparent)' }}
        ></div>

        <div className="max-w-7xl mx-auto w-full px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <h1 className="text-7xl md:text-8xl font-black leading-tight" style={{ color: '#2D2D2D' }}>
                Best Deal for <br />
                <span style={{ color: '#F9B233' }}>Your Groceries</span>
              </h1>

              <p className="text-xl text-gray-600 max-w-md leading-relaxed">
                Get fresh groceries delivered to your doorstep with amazing discounts and same-day delivery.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-6">
                <a
                  href="/categories"
                  className="px-8 py-4 rounded-full font-bold text-white transition transform hover:scale-110 hover:shadow-xl"
                  style={{ background: '#C6E33D', color: '#2D2D2D' }}
                >
                  Shop Now
                </a>
                <button
                  onClick={scrollToFeatures}
                  className="px-8 py-4 rounded-full font-bold transition transform hover:scale-110"
                  style={{ color: '#F9B233', border: '2px solid #F9B233' }}
                >
                  Learn More
                </button>
              </div>

              {/* Category Pills */}
              <div className="grid grid-cols-2 gap-3 pt-8 max-w-md">
                {[
                  { icon: '🥬', name: 'Fresh Vegetables' },
                  { icon: '🥩', name: 'Raw Meat' },
                  { icon: '🥛', name: 'Milk & Dairy' },
                  { icon: '❄️', name: 'Frozen Foods' },
                ].map((pill, idx) => (
                  <button
                    key={idx}
                    className="flex items-center gap-2 px-5 py-3 rounded-full border-2 transition transform hover:scale-110 hover:shadow-lg bg-white/50 backdrop-blur-sm"
                    style={{ borderColor: '#C6E33D' }}
                  >
                    <span className="text-xl">{pill.icon}</span>
                    <span className="font-semibold text-sm" style={{ color: '#2D2D2D' }}>
                      {pill.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative h-full min-h-96 flex items-center justify-center">
              {/* Yellow Circle */}
              <div
                className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-70 blur-2xl"
                style={{
                  background: 'radial-gradient(circle, #F9B233, transparent)',
                  transform: `translateY(${scrollY * 0.3}px)`,
                }}
              ></div>

              {/* Hero Image */}
              <div className="relative z-10" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
                <Image
                  src="/hero-image.jpg"
                  alt="Fresh Groceries"
                  width={400}
                  height={400}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🥬', title: 'Fresh Products', desc: 'Daily fresh supplies' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Same-day delivery' },
              { icon: '💳', title: 'Easy Ordering', desc: 'Simple checkout' },
              { icon: '⭐', title: 'Premium Quality', desc: 'Best selections' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl text-center transition transform hover:scale-105 hover:shadow-xl"
                style={{ background: '#F5F5F5' }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#2D2D2D' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
