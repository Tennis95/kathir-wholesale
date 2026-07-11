'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'product' | 'category' | 'brand';
  icon: string;
}

const MOCK_SUGGESTIONS: SearchSuggestion[] = [
  { id: '1', title: 'Aashirvaad Atta 5kg', type: 'product', icon: '📦' },
  { id: '2', title: 'MDH Garam Masala', type: 'product', icon: '📦' },
  { id: '3', title: 'Amul Butter 500g', type: 'product', icon: '📦' },
  { id: '4', title: 'Basmati Rice', type: 'product', icon: '📦' },
  { id: '5', title: 'Rice & Grains', type: 'category', icon: '🎯' },
  { id: '6', title: 'Spices & Masalas', type: 'category', icon: '🎯' },
  { id: '7', title: 'Dairy & Milk', type: 'category', icon: '🎯' },
  { id: '8', title: 'Aashirvaad', type: 'brand', icon: '🏢' },
  { id: '9', title: 'Tata', type: 'brand', icon: '🏢' },
  { id: '10', title: 'Nestlé', type: 'brand', icon: '🏢' },
];

export default function AdvancedSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Filter suggestions based on query
  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const filtered = MOCK_SUGGESTIONS.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.type.includes(query.toLowerCase())
    ).slice(0, 8);

    setSuggestions(filtered);
    setIsOpen(filtered.length > 0);
    setSelectedIndex(-1);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setIsOpen(false);

    // Navigate based on type
    if (suggestion.type === 'category') {
      router.push(`/categories?filter=${encodeURIComponent(suggestion.title)}`);
    } else if (suggestion.type === 'brand') {
      router.push(`/categories?brand=${encodeURIComponent(suggestion.title)}`);
    } else {
      router.push(`/categories?search=${encodeURIComponent(suggestion.title)}`);
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      router.push(`/categories?search=${encodeURIComponent(searchTerm)}`);
      setQuery('');
      setIsOpen(false);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="Search products, categories, brands..."
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <button
          onClick={() => handleSearch(query)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xl transition hover:scale-110 active:scale-95"
        >
          🔍
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto animate-fade-in-up">
          {/* Grouped by type */}
          {['product', 'category', 'brand'].map((type) => {
            const items = suggestions.filter((s) => s.type === type);
            if (items.length === 0) return null;

            return (
              <div key={type}>
                <div className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900 sticky top-0">
                  {type === 'product' ? '📦 Products' : type === 'category' ? '🎯 Categories' : '🏢 Brands'}
                </div>
                {items.map((suggestion, idx) => {
                  const globalIndex = suggestions.indexOf(suggestion);
                  const isSelected = selectedIndex === globalIndex;

                  return (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 transition ${
                        isSelected
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-lg">{suggestion.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {suggestion.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {suggestion.type.charAt(0).toUpperCase() +
                            suggestion.type.slice(1)}
                        </div>
                      </div>
                      {isSelected && <span className="text-blue-600 dark:text-blue-400">→</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* No results message */}
      {isOpen && suggestions.length === 0 && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 p-4 text-center text-gray-500 dark:text-gray-400">
          <p>No results for "{query}"</p>
          <button
            onClick={() => handleSearch(query)}
            className="mt-2 text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Search anyway →
          </button>
        </div>
      )}
    </div>
  );
}
