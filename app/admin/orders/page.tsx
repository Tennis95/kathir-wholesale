'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Order {
  _id: string;
  orderNumber: string;
  userId: { name: string; email: string };
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminOrders() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, user?.role, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }} className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#1F2937' }}>
            Order Management
          </h1>
          <p className="text-gray-600">Total Orders: {orders.length}</p>
        </motion.div>

        <motion.div className="mb-6 flex gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                filter === status 
                  ? 'text-white' 
                  : 'text-gray-600 bg-white'
              }`}
              style={{
                background: filter === status 
                  ? 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)'
                  : '#f3f4f6'
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <div className="p-8 text-center">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-600">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: '#F0F9FE', borderBottom: '2px solid #E8F4FB' }}>
                  <tr>
                    <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Order #</th>
                    <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Customer</th>
                    <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Amount</th>
                    <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Status</th>
                    <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Payment</th>
                    <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Date</th>
                    <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #E8F4FB' }}>
                      <td className="px-6 py-4 font-bold" style={{ color: '#2D7BA8' }}>{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{order.userId.name}</div>
                        <div className="text-xs text-gray-500">{order.userId.email}</div>
                      </td>
                      <td className="px-6 py-4 font-bold">£{order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{
                            background: order.status === 'delivered' ? '#D1FAE5' : 
                                       order.status === 'shipped' ? '#DBEAFE' : '#FEF3C7',
                            color: order.status === 'delivered' ? '#065F46' :
                                   order.status === 'shipped' ? '#1E40AF' : '#92400E'
                          }}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{order.paymentStatus}</td>
                      <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <a href={`/admin/orders/${order._id}`} className="text-blue-600 hover:underline text-sm font-bold">
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
