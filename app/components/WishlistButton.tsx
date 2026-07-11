'use client';

import { useState, useEffect } from 'react';

interface WishlistButtonProps {
  productId: string;
  onToggle?: (isFavorite: boolean) => void;
}

export default function WishlistButton({ productId, onToggle }: WishlistButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userId = 'user-demo'; // In production, get from auth context

  useEffect(() => {
    // Load wishlist status
    const loadWishlist = async () => {
      try {
        const response = await fetch(`/api/wishlists?userId=${userId}`);
        const data = await response.json();
        setIsFavorite(data.wishlist?.includes(productId));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    };

    loadWishlist();
  }, [productId, userId]);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/wishlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId,
          action: isFavorite ? 'remove' : 'add',
        }),
      });

      const data = await response.json();
      setIsFavorite(!isFavorite);
      onToggle?.(!isFavorite);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`px-4 py-2 rounded-lg font-bold transition transform hover:scale-110 active:scale-95 ${
        isFavorite
          ? 'bg-red-500 text-white shadow-lg'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
      }`}
      title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isFavorite ? '❤️ Favorited' : '🤍 Favorite'}
    </button>
  );
}
