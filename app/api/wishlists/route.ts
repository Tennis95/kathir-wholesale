import { NextRequest, NextResponse } from 'next/server';

// In-memory wishlist storage (replace with DB in production)
const wishlists = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { userId, productId, action } = await request.json();

    const key = `${userId}`;
    const wishlist = wishlists.get(key) || [];

    if (action === 'add') {
      if (!wishlist.includes(productId)) {
        wishlist.push(productId);
      }
    } else if (action === 'remove') {
      const idx = wishlist.indexOf(productId);
      if (idx > -1) wishlist.splice(idx, 1);
    }

    wishlists.set(key, wishlist);

    return NextResponse.json({
      success: true,
      wishlist,
      count: wishlist.length,
    });
  } catch (error) {
    console.error('[Wishlist] Error:', error);
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ wishlist: [] });

    const wishlist = wishlists.get(userId) || [];
    return NextResponse.json({ wishlist, count: wishlist.length });
  } catch (error) {
    console.error('[Wishlist] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 400 });
  }
}
