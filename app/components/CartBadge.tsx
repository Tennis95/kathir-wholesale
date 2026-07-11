'use client';

import { useEffect, useState } from 'react';

export default function CartBadge() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('kathir-cart');
      const cart = savedCart ? JSON.parse(savedCart) : [];
      setCartCount(cart.length);
    };

    updateCartCount();

    // Listen for storage changes (when cart is updated from other components)
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cart-updated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, []);

  return (
    <span className="bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
      {cartCount}
    </span>
  );
}
