'use client';

export const dynamic = 'force-dynamic';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Order {
  _id: string;
  orderNumber: string;
  items: any[];
  total: number;
  status: string;
  paymentStatus: string;
  estimatedDelivery: string;
  trackingNumber: string;
  createdAt: string;
}

export default function OrdersHistoryPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/user/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }} className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <a href="/account" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Account
          </a>
          <h1 className="text-4xl font-bold" style={{ color: '#1F2937' }}>
            My Orders
          </h1>
        </motion.div>

        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <motion.div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-4">No orders yet</p>
            <a
              href="/categories"
              className="inline-block px-6 py-3 rounded-lg font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
              }}
            >
              Start Shopping
            </a>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg p-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: '#2D7BA8' }}>
                      {order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className="px-4 py-2 rounded-full font-bold text-sm"
                    style={{
                      background:
                        order.status === 'delivered'
                          ? '#D1FAE5'
                          : order.status === 'shipped'
                          ? '#DBEAFE'
                          : '#FEF3C7',
                      color:
                        order.status === 'delivered'
                          ? '#065F46'
                          : order.status === 'shipped'
                          ? '#1E40AF'
                          : '#92400E',
                    }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="font-bold mb-2">Items:</h4>
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      {item.productName} x {item.quantity}
                    </p>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold" style={{ color: '#2D7BA8' }}>
                      £{order.total.toFixed(2)}
                    </p>
                  </div>
                  {order.trackingNumber && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Tracking</p>
                      <p className="font-bold">{order.trackingNumber}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
