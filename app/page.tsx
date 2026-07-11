'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

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
      <section
        className="relative min-h-screen flex items-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: 'url(/warehouse-produce.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/30 z-5"></div>

        <div className="max-w-7xl mx-auto w-full px-4 py-10 md:py-12 relative z-10">
          <div className="flex flex-col items-start justify-center min-h-[calc(100vh-120px)]">
            {/* Content */}
            <div className="space-y-5 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.6)' }}>
                  Best Deal for <br />
                  <motion.span
                    style={{
                      color: '#F9B233',
                      display: 'inline-block',
                      textShadow: '0 4px 12px rgba(0,0,0,0.6)'
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  >
                    Your Groceries
                  </motion.span>
                </h1>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap gap-4 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              >
                <a
                  href="/categories"
                  className="px-8 py-4 rounded-full font-bold text-white transition transform hover:scale-110 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #8FD3F4 0%, #4FA9D9 100%)',
                    color: 'white',
                    boxShadow: '0 6px 20px rgba(143, 211, 244, 0.35)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(143, 211, 244, 0.55)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(143, 211, 244, 0.35)';
                  }}
                >
                  Shop Now
                </a>
                <button
                  onClick={scrollToFeatures}
                  className="px-8 py-4 rounded-full font-bold transition transform hover:scale-110 bg-white/20 text-white backdrop-blur-sm"
                  style={{ border: '2px solid white' }}
                >
                  Learn More
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24" style={{ background: 'linear-gradient(135deg, #F8FAFB 0%, #F0F9FE 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1F2937', letterSpacing: '-0.5px' }}>
              Why Choose KATHIR
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Premium wholesale solutions designed for your business
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🥬', title: 'Fresh Products', desc: 'Daily fresh supplies' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Same-day delivery' },
              { icon: '💳', title: 'Easy Ordering', desc: 'Simple checkout' },
              { icon: '⭐', title: 'Premium Quality', desc: 'Best selections' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group p-10 rounded-2xl text-center transition-all duration-300 cursor-pointer"
                style={{
                  background: 'white',
                  boxShadow: '0 4px 20px rgba(79, 169, 217, 0.08)',
                  border: '1px solid #E5E7EB'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(79, 169, 217, 0.15)';
                  e.currentTarget.style.borderColor = '#8FD3F4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(79, 169, 217, 0.08)';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
              >
                <motion.div
                  className="text-6xl mb-6 inline-block"
                  initial={{ scale: 1, rotate: 0 }}
                  whileHover={{ scale: 1.2, rotate: 5, transition: { duration: 0.4 } }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 transition-colors" style={{ color: '#2D2D2D' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                <div
                  className="mt-6 h-1 rounded-full transition-all duration-300"
                  style={{ background: '#8FD3F4', width: '0%' }}
                  ref={(el) => {
                    if (el) {
                      el.parentElement?.addEventListener('mouseenter', () => {
                        el.style.width = '100%';
                      });
                      el.parentElement?.addEventListener('mouseleave', () => {
                        el.style.width = '0%';
                      });
                    }
                  }}
                ></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
