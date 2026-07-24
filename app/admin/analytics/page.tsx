'use client';

import { useAdminAuth } from '@/context/AdminAuthContext';
import { useNotification } from '@/context/NotificationContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  const { isAdminAuthenticated, adminToken, isLoading: authLoading } = useAdminAuth();
  const { addNotification } = useNotification();
  const router = useRouter();

  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    if (!authLoading && !isAdminAuthenticated) {
      router.push('/auth/admin/login');
    }
  }, [isAdminAuthenticated, router, authLoading]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAnalytics();
    }
  }, [isAdminAuthenticated, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/analytics?dateRange=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch analytics');

      const data = await res.json();
      setAnalytics(data.data);
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to load analytics',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdminAuthenticated) return null;

  if (loading || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9FAFB' }}>
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin" className="text-blue-600 text-sm hover:underline">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold mt-2" style={{ color: '#1F2937' }}>
                Analytics & Reports
              </h1>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">
              £{(analytics.keyMetrics?.totalRevenue || 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-blue-600">
              {analytics.keyMetrics?.totalOrders || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Active Customers</p>
            <p className="text-3xl font-bold text-purple-600">
              {analytics.keyMetrics?.activeCustomers || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Total Products</p>
            <p className="text-3xl font-bold text-orange-600">
              {analytics.keyMetrics?.totalProducts || 0}
            </p>
          </div>
        </motion.div>

        {/* Orders by Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
        >
          <h3 className="text-lg font-bold mb-6" style={{ color: '#1F2937' }}>
            Orders by Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { status: 'Pending', key: 'pending', color: 'bg-yellow-100 text-yellow-800' },
              { status: 'Processing', key: 'processing', color: 'bg-blue-100 text-blue-800' },
              { status: 'Shipped', key: 'shipped', color: 'bg-purple-100 text-purple-800' },
              { status: 'Delivered', key: 'delivered', color: 'bg-green-100 text-green-800' },
              { status: 'Cancelled', key: 'cancelled', color: 'bg-red-100 text-red-800' },
            ].map((item) => (
              <div key={item.key} className={`${item.color} rounded-lg p-4 text-center`}>
                <p className="text-2xl font-bold">{analytics.ordersByStatus?.[item.key] || 0}</p>
                <p className="text-sm font-medium mt-1">{item.status}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Customer Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-700 mb-4">Customer Status</p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Active</span>
                <span className="text-sm font-bold text-green-600">
                  {analytics.keyMetrics?.activeCustomers || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Inactive</span>
                <span className="text-sm font-bold text-red-600">
                  {analytics.keyMetrics?.inactiveCustomers || 0}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-sm font-bold">
                  {analytics.keyMetrics?.totalCustomers || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-700 mb-4">Stock Status</p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Low Stock</span>
                <span className="text-sm font-bold text-yellow-600">
                  {analytics.keyMetrics?.lowStockProducts || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Out of Stock</span>
                <span className="text-sm font-bold text-red-600">
                  {analytics.keyMetrics?.outOfStockProducts || 0}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-sm font-medium">Total Products</span>
                <span className="text-sm font-bold">
                  {analytics.keyMetrics?.totalProducts || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-700 mb-4">Revenue by Category</p>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {analytics.revenueByCategory?.slice(0, 5).map((cat: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="truncate">{cat._id}</span>
                  <span className="font-bold text-gray-900">
                    {cat.count} items
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg font-bold mb-6" style={{ color: '#1F2937' }}>
            Top Selling Products
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: '#F3F4F6' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold">Product</th>
                  <th className="px-6 py-3 text-right text-sm font-bold">Quantity Sold</th>
                  <th className="px-6 py-3 text-right text-sm font-bold">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topProducts?.slice(0, 10).map((prod: any, idx: number) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium truncate">{prod._id}</td>
                    <td className="px-6 py-3 text-sm text-right">{prod.quantity}</td>
                    <td className="px-6 py-3 text-sm text-right font-medium">
                      £{(prod.revenue || 0).toFixed(2)}
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
