'use client';

import { useAdminAuth } from '@/context/AdminAuthContext';
import { useNotification } from '@/context/NotificationContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const dynamic = 'force-dynamic';

export default function OrdersPage() {
  const { isAdminAuthenticated, adminToken, isLoading: authLoading } = useAdminAuth();
  const { addNotification } = useNotification();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (!authLoading && !isAdminAuthenticated) {
      router.push('/auth/admin/login');
    }
  }, [isAdminAuthenticated, router, authLoading]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchOrders();
    }
  }, [isAdminAuthenticated, statusFilter, page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        status: statusFilter,
        page: page.toString(),
        limit: '10',
      });

      const res = await fetch(`/api/admin/orders?${query}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch orders');

      const data = await res.json();
      setOrders(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to load orders',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newOrderStatus: string) => {
    try {
      setUpdatingStatus(true);

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: newOrderStatus }),
      });

      if (!res.ok) throw new Error('Failed to update order');

      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Order status updated successfully',
        duration: 3000,
      });

      setSelectedOrder(null);
      fetchOrders();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to update status',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAdminAuthenticated) return null;

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
                Order Management
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <table className="w-full">
                <thead style={{ background: '#F3F4F6' }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order._id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium">{order.userId?.name || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{order.userId?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">£{order.total?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.status);
                          }}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          View & Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">{page} of {totalPages}</span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold mb-4">Update Order Status</h2>

            <div className="mb-6">
              <p className="text-sm text-gray-600">Order ID: {selectedOrder.orderNumber}</p>
              <p className="text-sm text-gray-600">Customer: {selectedOrder.userId?.name}</p>
              <p className="text-sm text-gray-600">Total: £{selectedOrder.total?.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-2">Current Status: {selectedOrder.status}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusChange(selectedOrder._id, newStatus)}
                disabled={updatingStatus}
                className="flex-1 px-4 py-2 rounded-lg text-white font-medium"
                style={{ background: '#2D7BA8', opacity: updatingStatus ? 0.7 : 1 }}
              >
                {updatingStatus ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
