'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { animate } from 'motion';
import { useAuth } from '@/app/context/AuthContext';
import PillNav from './PillNav';
import CartBadge from './CartBadge';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/categories' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const desktopCartRef = useRef<HTMLAnchorElement>(null);
  const mobileCartRef = useRef<HTMLAnchorElement>(null);
  const desktopAccountRef = useRef<HTMLDivElement>(null);
  const mobileAccountRef = useRef<HTMLDivElement>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isDesktop = desktopAccountRef.current && desktopAccountRef.current.contains(e.target as Node);
      const isMobile = mobileAccountRef.current && mobileAccountRef.current.contains(e.target as Node);
      if (!isDesktop && !isMobile) {
        setShowAccountMenu(false);
      }
    };

    if (showAccountMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showAccountMenu]);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      setShowAccountMenu(!showAccountMenu);
    } else {
      router.push('/auth/login');
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowAccountMenu(false);
    router.push('/');
  };

  const handleOrders = () => {
    setShowAccountMenu(false);
    router.push('/account/orders');
  };

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

        {/* Right: Cart + Account Icon (desktop) */}
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

          {/* Account Button with Dropdown */}
          <div className="relative" ref={desktopAccountRef}>
            <button
              onClick={handleAccountClick}
              className="flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 hover:scale-110"
              style={{
                background: '#2D7BA8',
                boxShadow: '0 2px 8px rgba(45, 123, 168, 0.15)',
              }}
              aria-label="Account"
              title="Account"
            >
              <span style={{ fontSize: '22px' }}>👤</span>
            </button>

            {/* Dropdown Menu */}
            {isAuthenticated && showAccountMenu && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                style={{
                  animation: 'fadeIn 0.2s ease-out',
                }}
              >
                <a
                  href="/account/orders"
                  onClick={handleOrders}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg border-b border-gray-100"
                >
                  My Orders
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
                  style={{ color: '#2D7BA8' }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: Cart + Account icons */}
        <div className="md:hidden flex items-center gap-2">
          <div className="relative" ref={mobileAccountRef}>
            <button
              onClick={handleAccountClick}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition"
              style={{ background: '#2D7BA8' }}
              aria-label="Account"
            >
              <span style={{ fontSize: '18px' }}>👤</span>
            </button>

            {/* Mobile Dropdown Menu */}
            {isAuthenticated && showAccountMenu && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                style={{
                  animation: 'fadeIn 0.2s ease-out',
                }}
              >
                <a
                  href="/account/orders"
                  onClick={handleOrders}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg border-b border-gray-100"
                >
                  My Orders
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
                  style={{ color: '#2D7BA8' }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <a
            ref={mobileCartRef}
            id="header-cart-icon-mobile"
            href="/checkout"
            className="relative flex items-center justify-center w-10 h-10 rounded-lg transition"
            style={{ background: '#F0F9FE' }}
            aria-label="View quote"
          >
            <span style={{ fontSize: '18px' }}>🛒</span>
            <span className="absolute top-1 right-1">
              <CartBadge />
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
