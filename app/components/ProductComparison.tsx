'use client';

import { useState } from 'react';
import { Product } from '@/types';

interface ProductComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: Product[];
  onRemoveProduct?: (productId: string) => void;
}

export default function ProductComparison({
  isOpen,
  onClose,
  selectedProducts,
  onRemoveProduct,
}: ProductComparisonProps) {
  if (!isOpen || selectedProducts.length === 0) return null;

  const features = [
    { label: 'Price', key: 'price' },
    { label: 'Size', key: 'size' },
    { label: 'Category', key: 'category' },
    { label: 'Stock Status', key: 'inStock' },
    { label: 'Rating', key: 'rating' },
    { label: 'Discount', key: 'discount' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in-up"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 flex justify-between items-center p-6 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Compare Products ({selectedProducts.length})
            </h2>
            <button
              onClick={onClose}
              className="text-3xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
            >
              ✕
            </button>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-4 text-left font-bold text-gray-900 dark:text-white">
                    Feature
                  </th>
                  {selectedProducts.map((product) => (
                    <th key={product.id} className="px-6 py-4 text-left">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-center">
                          <p className="font-bold text-gray-900 dark:text-white line-clamp-2">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {product.category}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoveProduct?.(product.id)}
                          className="mt-2 text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {features.map((feature, idx) => (
                  <tr
                    key={feature.key}
                    className={`border-b dark:border-gray-700 ${
                      idx % 2 === 0
                        ? 'bg-white dark:bg-gray-900'
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      {feature.label}
                    </td>
                    {selectedProducts.map((product) => (
                      <td
                        key={product.id}
                        className="px-6 py-4 text-gray-700 dark:text-gray-300"
                      >
                        {feature.key === 'price' && (
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            £{product.price.toFixed(2)}
                          </span>
                        )}
                        {feature.key === 'size' && <span>{product.size}</span>}
                        {feature.key === 'category' && (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                            {product.category}
                          </span>
                        )}
                        {feature.key === 'inStock' && (
                          <span
                            className={`font-bold ${
                              product.inStock
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                          </span>
                        )}
                        {feature.key === 'rating' && (
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-sm">
                                {i < 4 ? '⭐' : '☆'}
                              </span>
                            ))}
                          </div>
                        )}
                        {feature.key === 'discount' && (
                          <span className="inline-block px-2 py-1 rounded-full text-sm font-bold bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400">
                            {Math.floor(Math.random() * 30) + 10}% OFF
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="border-t dark:border-gray-700 p-6 flex gap-4 justify-end bg-gray-50 dark:bg-gray-800">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-bold border-2 transition hover:bg-gray-100 dark:hover:bg-gray-700"
              style={{ borderColor: '#A0522D', color: '#A0522D' }}
            >
              Close
            </button>
            <button
              className="px-6 py-3 rounded-lg font-bold text-white transition hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #8FD3F4 0%, #4FA9D9 100%)',
              }}
            >
              Add All to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
