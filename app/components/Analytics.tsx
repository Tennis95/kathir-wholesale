'use client';

import { useEffect, useRef } from 'react';

interface PageMetrics {
  pathname: string;
  timestamp: number;
  loadTime: number;
}

class AnalyticsManager {
  private static instance: AnalyticsManager | null = null;

  private constructor() {
    // Analytics initialization
  }

  static getInstance(): AnalyticsManager {
    if (typeof window === 'undefined') {
      return null as any;
    }
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  trackPageView() {
    if (typeof window === 'undefined') return;
    // Silent tracking - no console logs
  }

  trackEvent(eventName: string, data?: Record<string, any>) {
    if (typeof window === 'undefined') return;
    // Silent event tracking
  }

  trackError(error: Error) {
    if (typeof window === 'undefined') return;
    // Silent error tracking
  }

  flushMetrics() {
    // Flush metrics silently
  }
}

export default function Analytics() {
  const analyticsRef = useRef<AnalyticsManager | null>(null);

  useEffect(() => {
    analyticsRef.current = AnalyticsManager.getInstance();
    if (analyticsRef.current) {
      analyticsRef.current.trackPageView();
    }
  }, []);

  return null;
}
