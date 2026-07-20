'use client';

export const dynamic = 'force-dynamic';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Analytics {
  summary: {
    totalOrders: number;
    totalRevenue: string;
    totalCustomers: number;
    totalProducts: number;
    avgOrderValue: string;
  };
  orders: {
    byStatus: Record<string, number>;
    paymentStatus: Record<string, number>;
    revenueByStatus: Record<string, number>;
  };
  inventory: {
    lowStockCount: number;
    outOfStockCount: number;
    totalStockValue: string;
  };
  sales: {
    categoryRevenue: Record<string, number>;
    dailyRevenue: Record<string, number>;
    recentOrders: any[];
  };
}

export default function AnalyticsDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    fetchAnalytics();
  }, [isAuthenticated, user?.role, router]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  if (loading || !analytics) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }} className="flex items-center justify-center py-12 px-4">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
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
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: analytics.summary.totalOrders, icon: '📦', color: '#2D7BA8' },
            { label: 'Revenue', value: `£${analytics.summary.totalRevenue}`, icon: '💰', color: '#10B981' },
            { label: 'Customers', value: analytics.summary.totalCustomers, icon: '👥', color: '#F59E0B' },
            { label: 'Products', value: analytics.summary.totalProducts, icon: '🛍️', color: '#8B5CF6' },
            { label: 'Avg Order', value: `£${analytics.summary.avgOrderValue}`, icon: '📊', color: '#EC4899' },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="text-3xl mb-2">{metric.icon}</div>
              <p className="text-gray-600 text-sm mb-2">{metric.label}</p>
              <p className="text-2xl font-bold" style={{ color: metric.color }}>
                {metric.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Order Status */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D7BA8' }}>
              Orders by Status
            </h2>
            <div className="space-y-4">
              {Object.entries(analytics.orders.byStatus).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    <span className="font-bold" style={{ color: '#2D7BA8' }}>{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3" style={{ overflow: 'hidden' }}>
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${(count / analytics.summary.totalOrders) * 100}%`,
                        background: status === 'delivered' ? '#10B981' : 
                                  status === 'shipped' ? '#3B82F6' : 
                                  status === 'processing' ? '#F59E0B' : '#EF4444'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Payment Status */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D7BA8' }}>
              Payment Status
            </h2>
            <div className="space-y-4">
              {Object.entries(analytics.orders.paymentStatus).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    <span className="font-bold" style={{ color: '#2D7BA8' }}>{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3" style={{ overflow: 'hidden' }}>
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${(count / analytics.summary.totalOrders) * 100}%`,
                        background: status === 'completed' ? '#10B981' : 
                                  status === 'pending' ? '#F59E0B' : '#EF4444'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Inventory Status */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D7BA8' }}>
              Inventory Status
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Total Stock Value</span>
                  <span className="font-bold text-lg" style={{ color: '#2D7BA8' }}>
                    £{analytics.inventory.totalStockValue}
                  </span>
                </div>
              </div>
              <div className="border-t pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg" style={{ background: '#FEF3C7', borderLeft: '4px solid #F59E0B' }}>
                    <p className="text-sm text-gray-600">Low Stock (&lt;10)</p>
                    <p className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
                      {analytics.inventory.lowStockCount}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ background: '#FEE2E2', borderLeft: '4px solid #EF4444' }}>
                    <p className="text-sm text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold" style={{ color: '#EF4444' }}>
                      {analytics.inventory.outOfStockCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Revenue by Status */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D7BA8' }}>
              Revenue by Order Status
            </h2>
            <div className="space-y-4">
              {Object.entries(analytics.orders.revenueByStatus).map(([status, revenue]) => (
                <div key={status}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    <span className="font-bold" style={{ color: '#2D7BA8' }}>
                      £{(revenue || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3" style={{ overflow: 'hidden' }}>
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${(revenue / parseFloat(analytics.summary.totalRevenue)) * 100}%`,
                        background: 'linear-gradient(90deg, #2D7BA8, #1E5A7A)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Category Revenue */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D7BA8' }}>
            Top Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analytics.sales.categoryRevenue)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([category, revenue]) => (
                <div key={category} className="p-4 rounded-lg" style={{ background: '#F0F9FE' }}>
                  <p className="font-medium text-gray-700 mb-2">{category}</p>
                  <p className="text-2xl font-bold" style={{ color: '#2D7BA8' }}>
                    £{(revenue || 0).toFixed(2)}
                  </p>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D7BA8' }}>
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: '#F0F9FE', borderBottom: '2px solid #E8F4FB' }}>
                <tr>
                  <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Order #</th>
                  <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Amount</th>
                  <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Status</th>
                  <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics.sales.recentOrders.map((order) => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #E8F4FB' }}>
                    <td className="px-6 py-4 font-bold" style={{ color: '#2D7BA8' }}>
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 font-bold">£{(order.total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: order.status === 'delivered' ? '#D1FAE5' : '#FEF3C7',
                          color: order.status === 'delivered' ? '#065F46' : '#92400E'
                        }}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
