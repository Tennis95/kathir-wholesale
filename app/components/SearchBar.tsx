'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="flex-1 max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search products, brands, categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-5 py-4 border-2 rounded-xl text-base transition focus:shadow-lg focus:outline-none"
          style={{ borderColor: '#8FD3F4', color: '#333' }}
        />
      </form>
    </div>
  );
}
