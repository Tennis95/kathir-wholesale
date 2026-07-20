'use client';

export const dynamic = 'force-dynamic';
import { useState, useEffect, Suspense } from 'react';
import { Product } from '@/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    const savedCart = localStorage.getItem('kathir-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    fetch('/products.json')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error loading products:', err));
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query, products]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const newCart = [...cart];
    for (let i = 0; i < quantity; i++) {
      newCart.push(product);
    }
    setCart(newCart);
    localStorage.setItem('kathir-cart', JSON.stringify(newCart));
    alert(`${quantity} x ${product.name} added to cart!`);
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const updateQuantity = (productId: string, value: number) => {
    if (value >= 1) {
      setQuantities(prev => ({ ...prev, [productId]: value }));
    }
  };

  const getQuantity = (productId: string) => {
    return quantities[productId] || 1;
  };

  const getProductDiscount = (productId: string) => {
    return [15, 18, 12, 20, 25, 22][Math.floor(Math.random() * 6)] || 15;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="text-sm">
            {i < Math.floor(rating) ? '⭐' : '☆'}
          </span>
        ))}
      </div>
      <span className="text-xs text-gray-600">({(rating || 0).toFixed(1)})</span>
    </div>
  );

  return (
    <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="bg-white/95 backdrop-blur border-b py-3" style={{ borderColor: '#E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-4 text-sm">
          <a href="/" className="text-sky-600 hover:underline font-medium">Home</a>
          <span className="text-gray-400 mx-2">/</span>
          <span style={{ color: '#2D7BA8' }} className="font-semibold">Search Results</span>
        </div>
      </div>

      {/* Header */}
      <motion.div
        className="bg-white shadow-md border-b"
        style={{ borderColor: '#E5E7EB' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <motion.h1
            className="text-4xl md:text-5xl font-black mb-3"
            style={{ color: '#1F2937', letterSpacing: '-1px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Search Results
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {query ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"` : 'Enter a search term to find products'}
          </motion.p>

          {/* Search Input */}
          <motion.form
            onSubmit={handleSearch}
            className="flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 px-5 py-3 border-2 rounded-xl text-base transition focus:shadow-lg focus:outline-none"
              style={{ borderColor: '#8FD3F4', color: '#333' }}
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
                boxShadow: '0 4px 12px rgba(45, 123, 168, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(45, 123, 168, 0.35)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 123, 168, 0.25)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🔍 Search
            </button>
          </motion.form>
        </div>
      </motion.div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {!query ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-xl font-medium">Enter a search term to find products</p>
          </motion.div>
        ) : results.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-xl font-medium mb-6">No products found matching "{query}"</p>
            <a
              href="/categories"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
                boxShadow: '0 6px 20px rgba(45, 123, 168, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(45, 123, 168, 0.35)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(45, 123, 168, 0.25)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Browse all categories
            </a>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {results.map((product, idx) => {
              const discount = getProductDiscount(product.id);
              const oldPrice = parseFloat((product.price / (1 - discount / 100)).toFixed(2));

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group cursor-pointer"
                  style={{
                    boxShadow: '0 4px 20px rgba(79, 169, 217, 0.08)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(79, 169, 217, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(79, 169, 217, 0.08)';
                  }}
                >
                  <div className="h-48 bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 flex items-center justify-center relative overflow-hidden">
                    {discount > 0 && (
                      <motion.div
                        className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        -{discount}%
                      </motion.div>
                    )}
                    <motion.div
                      className="text-6xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      📦
                    </motion.div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="mb-3">{renderStars(4.7)}</div>
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full inline-block mb-3"
                        style={{ background: '#E8F4FB', color: '#2D7BA8', letterSpacing: '0.5px' }}
                      >
                        {product.category}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-2 leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">📦 {product.size}</p>

                      <div
                        className="p-4 rounded-xl mb-4"
                        style={{
                          background: 'linear-gradient(135deg, #F5F9FB 0%, #EDF6FB 100%)',
                          border: '2px solid #E8F4FB'
                        }}
                      >
                        <div className="text-3xl font-black" style={{ color: '#2D7BA8', letterSpacing: '-0.5px' }}>
                          £{(product.price || 0).toFixed(2)}
                        </div>
                        {discount > 0 && (
                          <div className="text-xs text-gray-600 mt-2">
                            <span className="line-through">£{(oldPrice || 0).toFixed(2)}</span>
                            <span className="text-red-600 font-bold ml-2">Save {discount}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 items-center">
                      {/* Quantity Selector */}
                      <div
                        className="flex items-center rounded-full px-2 py-2 transition"
                        style={{ background: '#F0F9FE', border: '2px solid #E8F4FB' }}
                      >
                        <button
                          onClick={() => updateQuantity(product.id, getQuantity(product.id) - 1)}
                          disabled={getQuantity(product.id) <= 1}
                          className="p-1 font-bold text-lg transition transform hover:scale-110 disabled:opacity-50"
                          style={{ color: '#2D7BA8' }}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={getQuantity(product.id)}
                          onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                          className="w-12 text-center py-1 border-0 font-bold text-sm rounded-lg mx-1"
                          style={{ color: '#2D7BA8', background: 'white' }}
                        />
                        <button
                          onClick={() => updateQuantity(product.id, getQuantity(product.id) + 1)}
                          className="p-1 font-bold text-lg transition transform hover:scale-110"
                          style={{ color: '#2D7BA8' }}
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product, getQuantity(product.id))}
                        disabled={!product.inStock}
                        className="flex-1 py-2.5 rounded-lg font-bold text-sm text-white transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: product.inStock ? 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)' : '#D1D5DB',
                          boxShadow: product.inStock ? '0 4px 12px rgba(45, 123, 168, 0.25)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (product.inStock) {
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(45, 123, 168, 0.35)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (product.inStock) {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 123, 168, 0.25)';
                          }
                        }}
                      >
                        🛒 Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
