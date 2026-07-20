'use client';

import { useState } from 'react';
import { Product } from '@/types';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export default function QuickView({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: QuickViewProps) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const discount = Math.floor(Math.random() * 30) + 10;
  const oldPrice = parseFloat((product.price / (1 - discount / 100)).toFixed(2));

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in-up"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <div className="sticky top-0 flex justify-between items-center p-6 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quick View
            </h2>
            <button
              onClick={onClose}
              className="text-3xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image */}
              <div className="flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 dark:from-gray-800 dark:to-gray-700 rounded-xl h-72">
                <div className="text-9xl opacity-80">📦</div>
              </div>

              {/* Details */}
              <div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: '#8FD3F4', color: '#1F2937' }}>
                    {product.category}
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h1>

                {/* Stars */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">
                        {i < 4 ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">(4.8)</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {product.size} • {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </p>

                {/* Pricing */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg mb-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    £{(product.price || 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="line-through">£{(oldPrice || 0).toFixed(2)}</span>
                    <span className="text-red-600 dark:text-red-400 font-bold ml-2">
                      Save {discount}%
                    </span>
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border-2 rounded-lg w-fit" style={{ borderColor: '#4FA9D9' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 font-bold text-white transition hover:scale-110"
                      style={{ background: '#4FA9D9' }}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 text-center border-0 font-bold text-lg dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 font-bold text-white transition hover:scale-110"
                      style={{ background: '#4FA9D9' }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onAddToCart?.(product, quantity);
                      onClose();
                    }}
                    disabled={!product.inStock}
                    className="w-full py-3 rounded-lg font-bold text-white transition transform hover:scale-105 active:scale-95 shadow-md disabled:opacity-50"
                    style={{
                      background: product.inStock
                        ? 'linear-gradient(135deg, #8FD3F4 0%, #4FA9D9 100%)'
                        : '#ccc',
                    }}
                  >
                    🛒 Add to Cart
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-lg font-bold border-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                    style={{ borderColor: '#A0522D', color: '#A0522D' }}
                  >
                    Close
                  </button>
                </div>

                {/* Features */}
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                    Why choose this?
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>✓ Premium quality guarantee</li>
                    <li>✓ Fast delivery available</li>
                    <li>✓ Wholesale bulk pricing</li>
                    <li>✓ Customer satisfaction 98%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
