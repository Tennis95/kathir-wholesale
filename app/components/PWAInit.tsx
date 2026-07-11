'use client';

import { useEffect, useState } from 'react';

export default function PWAInit() {
  const [installPrompt, setInstallPrompt] = useState<any | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Only run the service worker in production. In development it caches
    // pages behind your live edits, making the site look "stuck" on old code.
    if (process.env.NODE_ENV !== 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
      if (window.caches) {
        caches.keys().then((names) => names.forEach((name) => caches.delete(name)));
      }
      return;
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('Service Worker registered:', registration);

          // Check for updates every 24 hours
          setInterval(() => {
            registration.update();
          }, 24 * 60 * 60 * 1000);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    // Check if app is already installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle install button click
  const handleInstallClick = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  // Show install button only if app is not installed and prompt is available
  if (!installPrompt || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-fade-in-up">
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all active:scale-95"
        title="Install KATHIR LTD app"
      >
        📱 Install App
      </button>
    </div>
  );
}
