'use client';

import { useRouter } from 'next/navigation';
import { Home, LayoutGrid, ShoppingCart, Phone } from 'lucide-react';
import Dock from './Dock';

export default function QuickActionsDock() {
  const router = useRouter();

  const items = [
    { icon: <Home size={20} />, label: 'Home', onClick: () => router.push('/') },
    { icon: <LayoutGrid size={20} />, label: 'Categories', onClick: () => router.push('/categories') },
    { icon: <ShoppingCart size={20} />, label: 'Quote', onClick: () => router.push('/checkout') },
    { icon: <Phone size={20} />, label: 'Contact', onClick: () => router.push('/contact') },
  ];

  return (
    <div className="md:hidden">
      <Dock items={items} panelHeight={64} baseItemSize={46} magnification={64} />
    </div>
  );
}
