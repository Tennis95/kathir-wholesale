'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { animate } from 'motion';
import PillNav from './PillNav';
import CartBadge from './CartBadge';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/categories' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const desktopCartRef = useRef<HTMLAnchorElement>(null);
  const mobileCartRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const bump = (iconEl: HTMLElement | null) => {
      if (!iconEl) return;
      animate(
        iconEl,
        { transform: ['scale(1)', 'scale(1.35)', 'scale(1)'] },
        { duration: 0.4, ease: 'easeOut' }
      );
    };

    const handleLanded = () => {
      bump(desktopCartRef.current);
      bump(mobileCartRef.current);
    };

    window.addEventListener('cart-fly-landed', handleLanded);
    return () => window.removeEventListener('cart-fly-landed', handleLanded);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white/98 backdrop-blur-2xl border-b"
      style={{
        borderColor: '#E5E7EB',
        fontFamily: 'var(--font-poppins)',
        boxShadow: '0 8px 32px rgba(79, 169, 217, 0.12), 0 1px 0 rgba(0,0,0,0.05)',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-[100px] flex items-center justify-between gap-8">
        <PillNav
          logo="/kathir logo.jpeg"
          logoAlt="KATHIR LTD"
          items={NAV_LINKS}
          activeHref={pathname || '/'}
          baseColor="#FFFFFF"
          pillColor="#E8F4FB"
          pillTextColor="#2D5A7B"
          hoveredPillTextColor="#1F2937"
          initialLoadAnimation={false}
        />

        {/* Right: Cart + Auth + CTA (desktop) */}
        <div className="hidden md:flex items-center gap-4 min-w-fit">
          <a
            ref={desktopCartRef}
            id="header-cart-icon-desktop"
            href="/checkout"
            className="relative flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 hover:scale-110"
            style={{
              background: '#F0F9FE',
              boxShadow: '0 2px 8px rgba(143, 211, 244, 0.15)',
            }}
            aria-label="View quote"
            title="View quote"
          >
            <span style={{ fontSize: '22px' }}>🛒</span>
            <span className="absolute -top-1 -right-1">
              <CartBadge />
            </span>
          </a>

          <a
            href="/auth/login"
            className="px-6 py-2.5 rounded-lg font-semibold text-blue-700 transition-all duration-300"
            style={{
              background: '#E8F4FB',
              border: '1.5px solid #8FD3F4',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#D4E8F7';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#E8F4FB';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Login
          </a>

          <a
            href="/auth/signup"
            className="px-6 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
              boxShadow: '0 6px 20px rgba(45, 123, 168, 0.25)',
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
            Sign Up
          </a>

          <a
            href="/contact"
            className="px-6 py-2.5 rounded-lg font-semibold text-white transition-all duration-300"
            style={{
              background: '#2D7BA8',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1E5A7A';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#2D7BA8';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Catalogue
          </a>
        </div>

        {/* Mobile: Cart icon (PillNav owns its own hamburger + mobile popover) */}
        <a
          ref={mobileCartRef}
          id="header-cart-icon-mobile"
          href="/checkout"
          className="md:hidden relative flex items-center justify-center w-12 h-12 rounded-lg transition"
          style={{ background: '#F0F9FE' }}
          aria-label="View quote"
        >
          <span style={{ fontSize: '22px' }}>🛒</span>
          <span className="absolute top-1 right-1">
            <CartBadge />
          </span>
        </a>
      </div>
    </header>
  );
}
