'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Optimized image component with:
 * - Lazy loading (default)
 * - Placeholder blur effect
 * - Responsive sizing
 * - WebP support
 * - Intersection observer for true lazy loading
 */
export default function ImageOptimizer({
  src,
  alt,
  width = 300,
  height = 300,
  className = '',
  priority = false,
}: ImageOptimizerProps) {
  const [isInView, setIsInView] = useState(priority);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  if (!isInView) {
    return (
      <div
        ref={ref}
        className={`bg-gray-200 dark:bg-gray-700 ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <div ref={ref} className={className}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3C/svg%3E"
        quality={75}
      />
    </div>
  );
}
