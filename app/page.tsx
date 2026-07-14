'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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

      {/* Featured Products Carousel Section */}
      <FeaturedProductsCarousel />

    </div>
  );
}

function FeaturedProductsCarousel() {
  const [products] = useState([
    { id: '27', name: 'Appam idiyappam pathiri podi', category: 'Ready to Cook', price: 3.19, size: '1kg', stock: 50, inStock: true, image: '27_Appam_idiyappam_pathiri_podi_1kg_Kathir_kathir.png' },
    { id: '75', name: 'Barnyard millet 1kg', category: 'Rice & Grains', price: 3.99, size: '1kg', stock: 50, inStock: true, image: '75_Barnyard_millet_1kg_Kathir_kathir.png' },
    { id: '81', name: 'Basmati rice Extra long 1121 5kg', category: 'Rice & Grains', price: 12.49, size: '5kg', stock: 50, inStock: true, image: '81_Basmati_rice_Extra_long_creamy_sella_1121_5kg_Kathir_kathir.png' },
    { id: '127', name: 'Black chick peas (Kadala) 1kg', category: 'Lentils & Pulses', price: 3.29, size: '1kg', stock: 50, inStock: true, image: 'Black chick peas(Kadala) 1kg Kathir.png' },
    { id: '138', name: 'Black rice (Kavuni) 1kg', category: 'Rice & Grains', price: 6.99, size: '1kg', stock: 50, inStock: true, image: '138_Black_rice_Kavuni_1kg_Kathir_kathir.png' },
    { id: '238', name: 'Chemba Puttupodi 1kg', category: 'Groceries', price: 4.99, size: '1kg', stock: 50, inStock: true, image: '238_Chemba_Puttupodi_1kg_Kathir_kathir.png' },
    { id: '348', name: 'Cow peas (Vanpayar) 1kg', category: 'Lentils & Pulses', price: 2.99, size: '1kg', stock: 50, inStock: true, image: '348_Cow_peas_Vanpayar_1kg_Kathir_kathir.png' },
    { id: '722', name: 'Kathir Banana Chips 250gm', category: 'Snacks', price: 2.49, size: '250gm', stock: 50, inStock: true, image: '722_KATHIR_BANANA_CHIPS_250GM_kathir.png' },
    { id: '724', name: 'Kathir Basmati Rice 1kg', category: 'Rice & Grains', price: 3.49, size: '1kg', stock: 50, inStock: true, image: '724_Kathir_Basmati_Rice_1Kg_Loose_1121_kathir.png' },
    { id: '731', name: 'Kathir Matta Rice 2kg', category: 'Rice & Grains', price: 5.99, size: '2kg', stock: 50, inStock: true, image: '731_Kathir_matta_rice_2kg_LOOSE_kathir.png' },
  ]);

  const [scrollIndex, setScrollIndex] = useState(0);
  const [cart, setCart] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('kathir-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const handleAddToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('kathir-cart', JSON.stringify(updatedCart));
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length]);

  const getVisibleProducts = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(products[(scrollIndex + i) % products.length]);
    }
    return visible;
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2D7BA8', letterSpacing: '-0.5px' }}>
            Featured Products
          </h2>
        </motion.div>

        {/* Auto-scrolling Carousel */}
        <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
            {getVisibleProducts().map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="p-6 rounded-xl bg-white cursor-pointer transition-all duration-300"
                  style={{
                    boxShadow: '0 4px 20px rgba(45, 123, 168, 0.08)',
                    border: '2px solid #E5E7EB'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(45, 123, 168, 0.15)';
                    e.currentTarget.style.borderColor = '#2D7BA8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(45, 123, 168, 0.08)';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  <div className="h-32 mb-4 flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-sky-50 to-blue-50">
                    <img
                      src={`/kathir product/${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          parent.textContent = '📦';
                        }
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#2D7BA8' }}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-4 py-2 rounded-lg font-bold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)' }}
                  >
                    Add to Cart
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 pb-6">
            {Array.from({ length: products.length }).map((_, idx) => (
              <motion.div
                key={idx}
                className="h-2 rounded-full transition-all"
                animate={{
                  width: idx === scrollIndex ? 24 : 8,
                  background: idx === scrollIndex ? '#2D7BA8' : '#8FD3F4'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div
            className="px-6 py-4 rounded-lg text-white font-semibold shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
              boxShadow: '0 8px 24px rgba(45, 123, 168, 0.3)'
            }}
          >
            ✓ {notification}
          </div>
        </motion.div>
      )}
    </section>
  );
}
