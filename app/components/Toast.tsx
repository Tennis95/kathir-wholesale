'use client';

import { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// Global toast manager
let toastListener: ((message: ToastMessage) => void) | null = null;

export function showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) {
  const id = Date.now().toString();
  if (toastListener) {
    toastListener({
      id,
      message,
      type,
      duration,
    });
  }
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastListener = (message: ToastMessage) => {
      setToasts((prev) => [...prev, message]);

      if (message.duration !== Infinity) {
        const timer = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== message.id));
        }, message.duration || 3000);

        return () => clearTimeout(timer);
      }
    };

    return () => {
      toastListener = null;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-4 z-50 pointer-events-none space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg pointer-events-auto transform transition-all duration-300 animate-fade-in-up ${getColors(
            toast.type
          )}`}
          onClick={() => removeToast(toast.id)}
        >
          <span className="text-lg font-bold">{getIcon(toast.type)}</span>
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 hover:opacity-70 transition opacity-80"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
