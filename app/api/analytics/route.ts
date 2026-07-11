import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (in production, use a database)
const analyticsData: any[] = [];
const performanceMetrics: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Categorize incoming data
    if (data.type === 'error') {
      console.log('[Analytics] Error logged:', data);
    } else if (data.event) {
      console.log('[Analytics] Event tracked:', data.event, data.data);
    } else if (data.metrics) {
      performanceMetrics.push(data);
      console.log('[Analytics] Performance metrics received');
    } else {
      analyticsData.push({
        ...data,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('[Analytics] Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const metric = searchParams.get('metric');
    const timeframe = searchParams.get('timeframe') || '24h';

    // Return aggregated metrics
    const metrics = {
      total_events: analyticsData.length,
      total_errors: analyticsData.filter((d) => d.type === 'error').length,
      average_load_time:
        performanceMetrics.length > 0
          ? (
              performanceMetrics.reduce((sum, m) => sum + (m.metrics?.loadTime || 0), 0) /
              performanceMetrics.length
            ).toFixed(2)
          : 0,
      page_views: analyticsData.filter((d) => d.metrics?.pathname).length,
      timeframe,
      metric,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('[Analytics] Error retrieving metrics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 400 }
    );
  }
}
