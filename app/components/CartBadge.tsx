'use client';

import { useCart } from '@/context/CartContext';

export default function CartBadge() {
  const { cartCount } = useCart();

  if (cartCount === 0) {
    return null;
  }

  return (
    <span className="bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
      {cartCount}
    </span>
  );
}
