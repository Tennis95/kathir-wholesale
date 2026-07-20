'use client';

import { useState, useEffect, Suspense } from 'react';
import { Product } from '@/types';
import { motion } from 'motion/react';
import SearchBar from '../../components/SearchBar';

export const dynamic = 'force-dynamic';

function CategoriesContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const productsPerPage = 15;

  useEffect(() => {
    const savedCart = localStorage.getItem('kathir-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    fetch('/products.json')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(err => console.error('Error loading products:', err));
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (sortBy === 'lowest') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'highest') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [selectedCategory, sortBy, products, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const newCart = [...cart];
    for (let i = 0; i < quantity; i++) {
      newCart.push(product);
    }
    setCart(newCart);
    localStorage.setItem('kathir-cart', JSON.stringify(newCart));
    setNotification(`${quantity} x ${product.name} added to cart!`);
    setTimeout(() => setNotification(null), 3000);
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

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const getProductImageName = (productId: string): string | null => {
    // Mapping of all product IDs to product images in kathir product folder
    const imageMap: { [key: string]: string | null } = {
      '27': '27_Appam_idiyappam_pathiri_podi_1kg_Kathir_kathir.png',
      '75': '75_Barnyard_millet_1kg_Kathir_kathir.png',
      '81': '81_Basmati_rice_Extra_long_creamy_sella_1121_5kg_Kathir_kathir.png',
      '127': 'Black chick peas(Kadala) 1kg Kathir.png',
      '138': '138_Black_rice_Kavuni_1kg_Kathir_kathir.png',
      '238': '238_Chemba_Puttupodi_1kg_Kathir_kathir.png',
      '348': '348_Cow_peas_Vanpayar_1kg_Kathir_kathir.png',
      '424': '424_Easy_palappam_podi_1kg_Kathir_kathir.png',
      '440': '440_Extra_long_sella_Basmati_rice_1kg_112l_XXL_Kathir_kathir.png',
      '464': '464_Foxtail_millet_1kg_Kathir_kathir.png',
      '721': '721_Kathir_Kaima_Rice_1_Kg_Loose_kathir.png',
      '722': '722_KATHIR_BANANA_CHIPS_250GM_kathir.png',
      '723': '723_KATHIR_BANANA_CHIPS_500GM_kathir.png',
      '724': '724_Kathir_Basmati_Rice_1Kg_Loose_1121_kathir.png',
      '725': '725_Kathir_Black_Chick_Pea_Kadala_Whole_1_plus_1_kathir.png',
      '726': '726_Kathir_Cow_Pea_Vanparu_1_plus_1_kathir.png',
      '727': '727_KATHIR_JACKFRUIT_CHIPS_200GM_kathir.png',
      '728': 'KATHIR KERALA MIXTURE SPICY 300GM.png',
      '729': 'kathir madurasava 150gm.png',
      '730': 'KATHIR RICE MURUKKU 150GM.png',
      '731': 'ponkathir matta rice.png',
      '732': 'Kathir Mung Bean (Cheruparu) 1+ 1.png',
      '733': 'KATHIR MURUKKU TOMATO 150GM.png',
      '734': 'KATHIR PAKKAVADA 150GM.png',
      '735': 'Kathir Palakkadan Matta Rice) 1 Kg (Loose).png',
      '736': 'KATHIR RICE MURUKKU 150GM.png',
      '737': 'kathir rip.png',
      '738': 'kathir ripe banana chips.png',
      '739': 'kathir shakaravati.png',
      '740': null,
      '741': 'kathir toor dhal.png',
      '742': 'Kathir Urid [Uzhunnu] Parippu (Whole) 1+1.png',
      '743': 'kathir white raw rice.png',
      '770': 'kathir kood millet.png',
      '839': 'kathir little millet.png',
      '875': 'kathir mappilai samba rice.png',
      '896': 'ponkathir matta rice.png',
      '945': 'kathir moong dhall.png',
      '958': 'kathir mung bean.png',
      '1078': 'kathir pearl millets.png',
      '1108': 'kathir pottu kadala.png',
      '1148': 'kathir puttu podi.png',
      '1155': 'kathir ragi whole.png',
      '1173': 'kathir red lentils.png',
      '1204': 'kathir rice powder.png',
      '1305': 'silced coconut ponkathir .png',
      '1416': 'kathir toor dhal.png',
      '1438': 'kathir urud dhal whole.png',
      '1482': 'kathir white chick peas.png',
      '1486': 'kathir white puttu podi.png',
    };
    return imageMap[productId] ?? null;
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="bg-white/95 backdrop-blur border-b py-3" style={{ borderColor: '#E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-4 text-sm">
          <a href="/" className="text-sky-600 hover:underline font-medium">Home</a>
          <span className="text-gray-400 mx-2">/</span>
          <span style={{ color: '#2D7BA8' }} className="font-semibold">Categories</span>
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
            className="text-4xl md:text-5xl font-black mb-6"
            style={{ color: '#1F2937', letterSpacing: '-1px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            All Products
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl"
          >
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 border-2 rounded-xl text-base transition focus:shadow-lg focus:outline-none"
              style={{ borderColor: '#8FD3F4', color: '#333' }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Products Grid */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {paginatedProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col group cursor-pointer"
                  style={{
                    boxShadow: '0 2px 12px rgba(79, 169, 217, 0.08)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(79, 169, 217, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(79, 169, 217, 0.08)';
                  }}
                >
                  {/* Smaller Image Area */}
                  <div className="h-24 bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 flex items-center justify-center relative overflow-hidden">
                    {getProductImageName(product.id) ? (
                      <img
                        src={`/kathir product/${getProductImageName(product.id)}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent && !parent.querySelector('.fallback-emoji')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'fallback-emoji text-4xl absolute';
                            fallback.textContent = '📦';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <div className="text-4xl">📦</div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-full inline-block mb-2"
                        style={{ background: '#E8F4FB', color: '#2D7BA8' }}
                      >
                        {product.category}
                      </span>
                      <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1 leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3">📦 {product.size}</p>
                    </div>

                    <div className="flex gap-2 items-center">
                      <div
                        className="flex items-center rounded-full px-1 py-1 transition text-xs"
                        style={{ background: '#F0F9FE', border: '1px solid #E8F4FB' }}
                      >
                        <button
                          onClick={() => updateQuantity(product.id, getQuantity(product.id) - 1)}
                          disabled={getQuantity(product.id) <= 1}
                          className="p-0.5 font-bold transition transform hover:scale-110 disabled:opacity-50"
                          style={{ color: '#2D7BA8' }}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={getQuantity(product.id)}
                          onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                          className="w-8 text-center py-0.5 border-0 font-bold text-xs rounded mx-0.5"
                          style={{ color: '#2D7BA8', background: 'white' }}
                        />
                        <button
                          onClick={() => updateQuantity(product.id, getQuantity(product.id) + 1)}
                          className="p-0.5 font-bold transition transform hover:scale-110"
                          style={{ color: '#2D7BA8' }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product, getQuantity(product.id))}
                        disabled={!product.inStock}
                        className="flex-1 py-1.5 rounded text-xs font-bold text-white transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: product.inStock ? 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)' : '#D1D5DB',
                          boxShadow: product.inStock ? '0 2px 8px rgba(45, 123, 168, 0.2)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (product.inStock) {
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(45, 123, 168, 0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (product.inStock) {
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(45, 123, 168, 0.2)';
                          }
                        }}
                      >
                        🛒 Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <motion.div
              className="flex justify-center items-center gap-3 mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="px-4 py-2 rounded-lg font-bold transition"
                  style={{
                    background: currentPage === page ? 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)' : '#E8F4FB',
                    color: currentPage === page ? 'white' : '#2D7BA8',
                    boxShadow: currentPage === page ? '0 4px 12px rgba(45, 123, 168, 0.2)' : 'none'
                  }}
                >
                  {page}
                </button>
              ))}
              {totalPages > 1 && (
                <button
                  onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))}
                  className="px-4 py-2 rounded-lg font-bold transition ml-4"
                  style={{
                    background: currentPage < totalPages ? 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)' : '#D1D5DB',
                    color: 'white',
                    boxShadow: currentPage < totalPages ? '0 4px 12px rgba(45, 123, 168, 0.2)' : 'none'
                  }}
                  disabled={currentPage >= totalPages}
                >
                  Next →
                </button>
              )}
            </motion.div>
        </motion.div>
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
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading products...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}
