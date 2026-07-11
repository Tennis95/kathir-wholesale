import { NextRequest, NextResponse } from 'next/server';

interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  timestamp: number;
  verified: boolean;
  helpful: number;
}

// In-memory storage (replace with DB)
const reviews: Review[] = [];

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId');
    const sort = request.nextUrl.searchParams.get('sort') || 'recent';

    let filtered = productId
      ? reviews.filter((r) => r.productId === productId)
      : reviews;

    if (sort === 'helpful') {
      filtered.sort((a, b) => b.helpful - a.helpful);
    } else if (sort === 'rating-high') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      filtered.sort((a, b) => b.timestamp - a.timestamp);
    }

    const avgRating =
      filtered.length > 0
        ? (filtered.reduce((sum, r) => sum + r.rating, 0) / filtered.length).toFixed(1)
        : 0;

    return NextResponse.json({
      reviews: filtered.slice(0, 10),
      total: filtered.length,
      averageRating: avgRating,
      distribution: {
        5: filtered.filter((r) => r.rating === 5).length,
        4: filtered.filter((r) => r.rating === 4).length,
        3: filtered.filter((r) => r.rating === 3).length,
        2: filtered.filter((r) => r.rating === 2).length,
        1: filtered.filter((r) => r.rating === 1).length,
      },
    });
  } catch (error) {
    console.error('[Reviews] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, userId, rating, title, content } = await request.json();

    if (!productId || !userId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid review data' }, { status: 400 });
    }

    const review: Review = {
      id: `review_${Date.now()}`,
      productId,
      userId,
      rating,
      title: title || 'No title',
      content: content || '',
      timestamp: Date.now(),
      verified: Math.random() > 0.5,
      helpful: 0,
    };

    reviews.push(review);

    return NextResponse.json({
      success: true,
      review,
      message: 'Review posted successfully',
    });
  } catch (error) {
    console.error('[Reviews] Error:', error);
    return NextResponse.json({ error: 'Failed to post review' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { reviewId, action } = await request.json();

    const review = reviews.find((r) => r.id === reviewId);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (action === 'helpful') {
      review.helpful++;
    }

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('[Reviews] Error:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 400 });
  }
}
