'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { label: '📦 Catalogue', href: '/categories' },
    { label: '🎯 Categories', href: '/categories' },
    { label: '❓ FAQs', href: '/faqs' },
    { label: '📞 Contact', href: '/contact' },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden px-3 py-2.5 rounded-lg font-bold transition-all duration-200 hover:bg-gray-100"
        style={{ color: '#1F2937' }}
        title="Menu"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="w-full block px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-semibold text-sm"
                style={{ color: '#1F2937' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
