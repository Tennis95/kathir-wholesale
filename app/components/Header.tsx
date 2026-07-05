'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import CartBadge from './CartBadge';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/categories' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b animate-slide-in-down"
        style={{
          borderColor: '#F3F4F6',
          fontFamily: 'var(--font-manrope)',
          boxShadow: '0 4px 24px rgba(31, 41, 55, 0.04)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-[90px] flex items-center justify-between gap-6">
          {/* Left: Logo */}
          <a href="/" className="flex items-center gap-3 min-w-fit">
            <img
              src="/kathir logo.jpeg"
              alt="KATHIR LTD"
              className="h-12 w-12 md:h-14 md:w-14 object-contain rounded-full animate-logo-float"
            />
            <div className="hidden sm:block leading-tight">
              <div className="font-bold tracking-tight" style={{ fontSize: '34px', color: '#1F2937', lineHeight: 1.1, fontFamily: 'var(--font-playfair)' }}>
                KATHIR LTD
              </div>
              <p className="font-medium" style={{ fontSize: '14px', color: '#1F2937', opacity: 0.55 }}>
                Wholesale Grocery Supplier
              </p>
            </div>
          </a>

          {/* Center: Navigation (desktop) */}
          <nav className="hidden lg:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((item) => {
              const active = isActive(item.href);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="relative font-medium transition-all duration-300 hover:-translate-y-0.5"
                  style={{ fontSize: '18px', color: active ? '#F59E0B' : '#1F2937' }}
                >
                  {item.label}
                  <span
                    className="absolute -bottom-2 left-0 h-0.5 transition-all duration-300"
                    style={{
                      background: '#F59E0B',
                      width: active ? '100%' : '0%',
                    }}
                  />
                </a>
              );
            })}
          </nav>

          {/* Right: Contact + Quote + CTA (desktop) */}
          <div className="hidden md:flex items-center gap-6 min-w-fit">
            <a
              href="tel:+44XXXXXXXXXX"
              className="hidden lg:flex items-center gap-2 font-medium transition hover:opacity-70"
              style={{ fontSize: '14px', color: '#1F2937', opacity: 0.75 }}
            >
              📞 +44 XXX XXX XXXX
            </a>

            <a
              href="/checkout"
              className="relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: '#F5F5F5' }}
              aria-label="View quote"
              title="View quote"
            >
              <span style={{ fontSize: '20px' }}>🛒</span>
              <span className="absolute -top-1 -right-1">
                <CartBadge />
              </span>
            </a>

            <a
              href="/contact"
              className="px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #FDBA2D 100%)',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.55)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(245, 158, 11, 0.35)';
              }}
            >
              Request Catalogue
            </a>
          </div>

          {/* Mobile: Quote icon + Hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <a
              href="/checkout"
              className="relative flex items-center justify-center w-11 h-11 rounded-full transition hover:bg-gray-100"
              aria-label="View quote"
            >
              <span style={{ fontSize: '20px' }}>🛒</span>
              <span className="absolute top-1 right-1">
                <CartBadge />
              </span>
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex flex-col justify-center items-center gap-1.5 w-11 h-11 rounded-full transition hover:bg-gray-100"
              aria-label="Open menu"
            >
              <span className="w-6 h-0.5 rounded-full" style={{ background: '#1F2937' }} />
              <span className="w-6 h-0.5 rounded-full" style={{ background: '#1F2937' }} />
              <span className="w-6 h-0.5 rounded-full" style={{ background: '#1F2937' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]" style={{ fontFamily: 'var(--font-manrope)' }}>
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-[80%] max-w-sm bg-white shadow-2xl flex flex-col p-8 animate-slide-in-right">
            <div className="flex items-center justify-between mb-10">
              <div className="font-bold" style={{ fontSize: '24px', color: '#1F2937', fontFamily: 'var(--font-playfair)' }}>
                KATHIR LTD
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full transition hover:bg-gray-100"
                aria-label="Close menu"
                style={{ fontSize: '20px', color: '#1F2937' }}
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-6 mb-10">
              {NAV_LINKS.map((item) => {
                const active = isActive(item.href);
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-semibold transition"
                    style={{ fontSize: '22px', color: active ? '#F59E0B' : '#1F2937' }}
                  >
                    {item.label}
                  </a>
                );
              })}
              <a
                href="/checkout"
                onClick={() => setMenuOpen(false)}
                className="font-semibold transition flex items-center gap-2"
                style={{ fontSize: '22px', color: isActive('/checkout') ? '#F59E0B' : '#1F2937' }}
              >
                🛒 View Quote
                <CartBadge />
              </a>
            </nav>

            <a
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-3.5 rounded-full font-semibold text-white text-center mb-6 transition"
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #FDBA2D 100%)',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
              }}
            >
              Request Catalogue
            </a>

            <a
              href="tel:+44XXXXXXXXXX"
              className="font-medium"
              style={{ fontSize: '15px', color: '#1F2937', opacity: 0.75 }}
            >
              📞 +44 XXX XXX XXXX
            </a>
            <a
              href="mailto:sales@kathirltd.co.uk"
              className="font-medium mt-2"
              style={{ fontSize: '15px', color: '#1F2937', opacity: 0.75 }}
            >
              📧 sales@kathirltd.co.uk
            </a>
          </div>
        </div>
      )}
    </>
  );
}
