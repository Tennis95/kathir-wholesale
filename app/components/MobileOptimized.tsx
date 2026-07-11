'use client';

import { useEffect, useState } from 'react';

export default function MobileOptimized() {
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasNotch, setHasNotch] = useState(false);

  useEffect(() => {
    // Detect mobile and notch
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(isMobileDevice || window.innerWidth < 768);

      // Check for notch (safe area)
      const hasNotchArea =
        CSS.supports('padding-top', 'max(10px)') &&
        (getComputedStyle(document.documentElement).paddingTop.includes('env') ||
          getComputedStyle(document.documentElement).paddingRight.includes('env'));
      setHasNotch(hasNotchArea);

      // Set viewport height
      setViewportHeight(window.innerHeight);
    };

    checkMobile();

    // Handle viewport changes
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    // Prevent zoom on input
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      input.addEventListener('focus', () => {
        if (isMobile) {
          // Don't zoom on iOS
          document.documentElement.style.fontSize = '16px';
        }
      });
    });

    // Optimize touch interactions
    document.addEventListener('touchstart', () => {
      // Reset touch delay
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;

    // Add mobile-specific optimizations
    const style = document.createElement('style');
    style.textContent = `
      /* Optimize touch targets */
      button, a, input {
        min-height: 44px;
        min-width: 44px;
      }

      /* Remove tap highlight on iOS */
      * {
        -webkit-tap-highlight-color: transparent;
      }

      /* Better viewport handling */
      @supports (padding: max(0px)) {
        body {
          padding-left: max(1rem, env(safe-area-inset-left));
          padding-right: max(1rem, env(safe-area-inset-right));
          padding-top: max(1rem, env(safe-area-inset-top));
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }
      }

      /* Smooth scrolling */
      html {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }

      /* Fix input zoom on iOS */
      input, textarea, select {
        font-size: 16px;
      }

      /* Better mobile performance */
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isMobile]);

  // Also optimize for landscape mode
  useEffect(() => {
    const handleOrientationChange = () => {
      const isLandscape = window.innerHeight < window.innerWidth;
      if (isLandscape && isMobile) {
        document.documentElement.style.fontSize = '14px';
      } else {
        document.documentElement.style.fontSize = '16px';
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile]);

  // Return null - this is just setup
  return null;
}
