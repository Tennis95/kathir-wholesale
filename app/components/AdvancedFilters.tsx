'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterState {
  priceRange: [number, number];
  categories: string[];
  brands: string[];
  inStock: boolean;
  rating: number;
  discount: number;
  sortBy: string;
}

const CATEGORIES = [
  'Rice & Grains',
  'Spices & Masalas',
  'Dairy & Milk',
  'Snacks & Biscuits',
  'Vegetables',
  'Fruits',
  'Oils & Condiments',
  'Baking & Flour',
];

const BRANDS = [
  'Aashirvaad',
  'MDH',
  'Tata',
  'Maggi',
  'Britannia',
  'Amul',
  'Heinz',
  'Nestlé',
];

export default function AdvancedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100],
    categories: [],
    brands: [],
    inStock: false,
    rating: 0,
    discount: 0,
    sortBy: 'popularity',
  });

  const [isOpen, setIsOpen] = useState(false);

  const handlePriceChange = (
    value: number,
    type: 'min' | 'max'
  ) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: type === 'min' ? [value, prev.priceRange[1]] : [prev.priceRange[0], value],
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.priceRange[0] > 0) params.append('minPrice', filters.priceRange[0].toString());
    if (filters.priceRange[1] < 100) params.append('maxPrice', filters.priceRange[1].toString());
    if (filters.categories.length > 0) params.append('categories', filters.categories.join(','));
    if (filters.brands.length > 0) params.append('brands', filters.brands.join(','));
    if (filters.inStock) params.append('inStock', 'true');
    if (filters.rating > 0) params.append('minRating', filters.rating.toString());
    if (filters.discount > 0) params.append('minDiscount', filters.discount.toString());
    params.append('sort', filters.sortBy);

    const queryString = params.toString();
    router.push(`/categories?${queryString}`);
    setIsOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 100],
      categories: [],
      brands: [],
      inStock: false,
      rating: 0,
      discount: 0,
      sortBy: 'popularity',
    });
  };

  return (
    <>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition hover:bg-gray-100 dark:hover:bg-gray-800"
        style={{ color: '#1F2937' }}
      >
        🎛️ Filters
        {(filters.categories.length > 0 ||
          filters.brands.length > 0 ||
          filters.inStock ||
          filters.rating > 0) && (
          <span className="ml-2 px-2 py-1 rounded-full text-xs font-bold text-white bg-blue-600">
            {filters.categories.length +
              filters.brands.length +
              (filters.inStock ? 1 : 0) +
              (filters.rating > 0 ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="w-80 bg-white dark:bg-gray-900 overflow-y-auto shadow-2xl animate-slide-in-left">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Filters
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b dark:border-gray-700">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Price Range: £{filters.priceRange[0]} - £{filters.priceRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange(parseInt(e.target.value), 'min')}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(parseInt(e.target.value), 'max')}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6 pb-6 border-b dark:border-gray-700">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Categories
                </label>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6 pb-6 border-b dark:border-gray-700">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Brands
                </label>
                <div className="space-y-2">
                  {BRANDS.slice(0, 5).map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In Stock */}
              <div className="mb-6 pb-6 border-b dark:border-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        inStock: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    In Stock Only
                  </span>
                </label>
              </div>

              {/* Rating */}
              <div className="mb-6 pb-6 border-b dark:border-gray-700">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      rating: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4★ & Up</option>
                  <option value="3">3★ & Up</option>
                  <option value="2">2★ & Up</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={resetFilters}
                  className="flex-1 px-4 py-2 rounded-lg font-bold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Reset
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 px-4 py-2 rounded-lg font-bold text-white transition hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #8FD3F4 0%, #4FA9D9 100%)',
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
