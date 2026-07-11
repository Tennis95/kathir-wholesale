import { NextRequest, NextResponse } from 'next/server';

// In-memory notification queue
const notificationQueue: any[] = [];
const sentNotifications: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const notification = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      status: 'queued',
    };

    notificationQueue.push(notification);
    console.log('[Notifications] Notification queued:', notification.title);

    return NextResponse.json({
      success: true,
      notificationId: notification.id,
    });
  } catch (error) {
    console.error('[Notifications] Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to queue notification' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Return pending notifications
    const pending = notificationQueue.slice(0, limit);

    return NextResponse.json({
      pending,
      total: notificationQueue.length,
      userId,
    });
  } catch (error) {
    console.error('[Notifications] Error retrieving notifications:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve notifications' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { notificationId, status } = data;

    // Update notification status
    const index = notificationQueue.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      const notification = notificationQueue[index];
      notification.status = status;
      if (status === 'sent') {
        sentNotifications.push(notification);
        notificationQueue.splice(index, 1);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Notifications] Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 400 }
    );
  }
}
