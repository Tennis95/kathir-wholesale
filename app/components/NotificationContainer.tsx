'use client';

import { useNotification } from '@/context/NotificationContext';
import { motion, AnimatePresence } from 'motion/react';

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-3">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, x: 400 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 400 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-xl border-l-4 p-4"
            style={{
              borderLeftColor:
                notification.type === 'success' ? '#10B981' :
                notification.type === 'error' ? '#EF4444' :
                notification.type === 'order' ? '#2D7BA8' :
                notification.type === 'warning' ? '#F59E0B' : '#3B82F6'
            }}
          >
            {notification.type === 'order' && notification.orderDetails ? (
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <span className="text-lg">📦</span>
                      {notification.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Order: <span className="font-mono font-semibold">{notification.orderDetails.orderNumber}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="bg-blue-50 rounded p-2 text-xs space-y-1">
                  <p className="text-gray-700"><span className="font-semibold">Customer:</span> {notification.orderDetails.customerName}</p>
                  <p className="text-gray-700"><span className="font-semibold">Items:</span> {notification.orderDetails.itemCount}</p>
                  <p className="text-gray-600">{new Date(notification.orderDetails.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm">
                    {notification.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="ml-2 text-gray-400 hover:text-gray-600 text-lg leading-none flex-shrink-0"
                >
                  ×
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
