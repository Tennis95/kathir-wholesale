'use client';

import { useEffect, useRef } from 'react';

interface PageMetrics {
  pathname: string;
  referrer: string;
  timestamp: number;
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
}

interface PerformanceData {
  metrics: PageMetrics;
  userAgent: string;
  timezone: string;
  language: string;
}

class AnalyticsManager {
  private static instance: AnalyticsManager | null = null;
  private metricsBuffer: PerformanceData[] = [];
  private readonly BUFFER_SIZE = 10;
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupPerformanceObserver();
      this.startFlushTimer();
    }
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

  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      try {
        // Track Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          console.log('LCP:', lastEntry.renderTime || lastEntry.startTime);
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Track Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;
            clsValue += (entry as any).value;
            console.log('CLS:', clsValue);
          }
        });

        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Track First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log('FID:', (entry as any).processingDuration);
          }
        });

        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.log('PerformanceObserver not fully supported');
      }
    }
  }

  private startFlushTimer() {
    setInterval(() => {
      this.flushMetrics();
    }, this.FLUSH_INTERVAL);
  }

  trackPageView() {
    if (typeof window === 'undefined') return;

    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    const metrics: PageMetrics = {
      pathname: window.location.pathname,
      referrer: document.referrer,
      timestamp: Date.now(),
      loadTime: perfData?.loadEventEnd ? perfData.loadEventEnd - perfData.fetchStart : 0,
      domContentLoaded: perfData?.domContentLoadedEventEnd
        ? perfData.domContentLoadedEventEnd - perfData.fetchStart
        : 0,
    };

    // Check for First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
    if (fcp) {
      metrics.firstContentfulPaint = fcp.startTime;
    }

    const data: PerformanceData = {
      metrics,
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    };

    this.addMetric(data);
  }

  trackEvent(eventName: string, eventData?: Record<string, any>) {
    if (typeof window === 'undefined') return;

    console.log(`Event: ${eventName}`, eventData);

    // In a real app, you'd send this to your analytics backend
    const eventPayload = {
      event: eventName,
      timestamp: Date.now(),
      pathname: window.location.pathname,
      data: eventData,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventPayload);
    }

    // Send to analytics service
    this.sendEvent(eventPayload);
  }

  trackError(error: Error) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      pathname: typeof window !== 'undefined' ? window.location.pathname : '',
    };

    console.error('Analytics Error:', errorData);
    this.sendEvent({ type: 'error', ...errorData });
  }

  private addMetric(data: PerformanceData) {
    this.metricsBuffer.push(data);

    if (this.metricsBuffer.length >= this.BUFFER_SIZE) {
      this.flushMetrics();
    }
  }

  private flushMetrics() {
    if (this.metricsBuffer.length === 0) return;

    const metrics = [...this.metricsBuffer];
    this.metricsBuffer = [];

    // In a real app, send to analytics backend
    if (process.env.NODE_ENV === 'development') {
      console.log('Flushing metrics:', metrics);
    }
  }

  private sendEvent(eventPayload: any) {
    // Use beacon API for non-blocking event tracking
    if ('sendBeacon' in navigator) {
      const blob = new Blob([JSON.stringify(eventPayload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics', blob);
    }
  }
}

// Lazy-load analytics to avoid SSR issues
let analyticsInstance: AnalyticsManager | null = null;

export function getAnalytics(): AnalyticsManager | null {
  if (typeof window === 'undefined') return null;
  if (!analyticsInstance) {
    analyticsInstance = AnalyticsManager.getInstance();
  }
  return analyticsInstance;
}

export default function Analytics() {
  const analyticsRef = useRef<AnalyticsManager | null>(null);

  useEffect(() => {
    analyticsRef.current = getAnalytics();

    if (!analyticsRef.current) return;

    // Track page view
    analyticsRef.current.trackPageView();

    // Track button clicks
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        const text = target.textContent || '';
        analyticsRef.current?.trackEvent('click', {
          element: target.tagName,
          text: text.substring(0, 50),
        });
      }
    };

    // Track form submissions
    const handleSubmit = (event: Event) => {
      const target = event.target as HTMLFormElement;
      analyticsRef.current?.trackEvent('form_submit', {
        form: target.id || target.name || 'unknown',
      });
    };

    // Track scroll depth
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        if (maxScroll >= 50 && maxScroll < 55) {
          analyticsRef.current?.trackEvent('scroll_depth', { depth: 50 });
        }
        if (maxScroll >= 75 && maxScroll < 80) {
          analyticsRef.current?.trackEvent('scroll_depth', { depth: 75 });
        }
        if (maxScroll >= 90) {
          analyticsRef.current?.trackEvent('scroll_depth', { depth: 90 });
        }
      }
    };

    // Track visibility change (tab switch)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        analyticsRef.current?.trackEvent('page_hidden');
      } else {
        analyticsRef.current?.trackEvent('page_visible');
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Setup error tracking
    const handleError = (event: ErrorEvent) => {
      analyticsRef.current?.trackError(event.error);
    };

    window.addEventListener('error', handleError);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null; // This component doesn't render anything
}
