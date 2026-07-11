'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
  timestamp: number;
}

interface ReviewsSectionProps {
  productId: string;
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [distribution, setDistribution] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      const data = await response.json();
      setReviews(data.reviews);
      setAvgRating(data.averageRating);
      setDistribution(data.distribution);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: 'user-demo',
          ...formData,
        }),
      });

      if (response.ok) {
        setFormData({ rating: 5, title: '', content: '' });
        setShowForm(false);
        await loadReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        ⭐ Customer Reviews ({reviews.length})
      </h2>

      {/* Rating Summary */}
      <div className="mb-8 pb-8 border-b dark:border-gray-700">
        <div className="flex items-start gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 dark:text-white">
              {avgRating}
            </div>
            <div className="flex gap-1 justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-lg">
                  {i < Math.floor(parseFloat(avgRating as any)) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Based on {reviews.length} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-12">
                  {stars}★
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        reviews.length > 0
                          ? ((distribution[stars as keyof typeof distribution] || 0) /
                              reviews.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                  {distribution[stars as keyof typeof distribution] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-6 py-3 rounded-lg font-bold text-white transition hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #8FD3F4 0%, #4FA9D9 100%)' }}
        >
          ✍️ Write a Review
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 pb-8 border-b dark:border-gray-700">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {'⭐'.repeat(n)} {n} stars
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Summarize your experience..."
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Review
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Tell us what you think..."
                rows={4}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg font-bold text-white transition hover:scale-105"
                style={{ background: '#4FA9D9' }}
              >
                {isSubmitting ? '📤 Posting...' : '✅ Post Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 rounded-lg font-bold border-2 border-gray-300 dark:border-gray-600 transition hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-sm">
                        {i < review.rating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mt-1">
                    {review.title}
                    {review.verified && <span className="text-xs ml-2 text-green-600">✓ Verified</span>}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {review.content}
              </p>

              <button
                onClick={async () => {
                  try {
                    await fetch('/api/reviews', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ reviewId: review.id, action: 'helpful' }),
                    });
                    await loadReviews();
                  } catch (error) {
                    console.error('Error:', error);
                  }
                }}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
              >
                👍 Helpful ({review.helpful})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
