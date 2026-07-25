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
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [isPerformingBulkUpdate, setIsPerformingBulkUpdate] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);
  const [priceReason, setPriceReason] = useState('');
  const [itemPrices, setItemPrices] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!authLoading && !isAdminAuthenticated) {
      router.push('/auth/admin/login');
    }
  }, [isAdminAuthenticated, router, authLoading]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchOrders();
    }
  }, [isAdminAuthenticated, statusFilter, page, dateFrom, dateTo, minAmount, maxAmount]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate date range
      if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
        throw new Error('Date From must be before Date To');
      }

      // Validate amount range
      if (minAmount && maxAmount && parseFloat(minAmount) > parseFloat(maxAmount)) {
        setAmountError('Minimum amount must be less than maximum');
        setLoading(false);
        return;
      }
      setAmountError(null);

      const query = new URLSearchParams({
        status: statusFilter,
        page: page.toString(),
        limit: '10',
      });

      if (dateFrom) query.append('dateFrom', dateFrom);
      if (dateTo) query.append('dateTo', dateTo);
      if (minAmount) query.append('minAmount', minAmount);
      if (maxAmount) query.append('maxAmount', maxAmount);

      const res = await fetch(`/api/admin/orders?${query}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (res.status === 401) {
        router.push('/auth/admin/login');
        return;
      }

      if (!res.ok) throw new Error('Failed to fetch orders');

      const data = await res.json();
      setOrders(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load orders';
      setError(errorMessage);
      addNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage,
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

  const handleSendInvoice = async (orderId: string) => {
    const hasAnyPrice = Object.values(itemPrices).some(p => p && parseFloat(p) > 0);
    if (!hasAnyPrice) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Please enter at least one item price',
      });
      return;
    }

    try {
      setIsSendingInvoice(true);

      const res = await fetch('/api/admin/generate-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          orderId,
          itemPrices,
          reason: priceReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send invoice');

      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Invoice generated and sent to customer successfully!',
        duration: 4000,
      });

      setSelectedOrder(null);
      setEditPrice('');
      setPriceReason('');
      setItemPrices({});
      fetchOrders();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to send invoice',
      });
    } finally {
      setIsSendingInvoice(false);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(o => o._id)));
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selectedOrders.size === 0) return;

    try {
      setIsPerformingBulkUpdate(true);

      const res = await fetch('/api/orders/bulk', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderIds: Array.from(selectedOrders),
          status: bulkStatus,
          reason: 'Bulk update from admin',
        }),
      });

      if (!res.ok) throw new Error('Failed to update orders');

      const data = await res.json();

      addNotification({
        type: 'success',
        title: 'Success',
        message: `Updated ${data.updated} orders successfully`,
        duration: 3000,
      });

      setSelectedOrders(new Set());
      setBulkStatus('');
      fetchOrders();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to update orders',
      });
    } finally {
      setIsPerformingBulkUpdate(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const query = new URLSearchParams({
        status: statusFilter,
        format: 'csv',
      });

      if (dateFrom) query.append('dateFrom', dateFrom);
      if (dateTo) query.append('dateTo', dateTo);
      if (minAmount) query.append('minAmount', minAmount);
      if (maxAmount) query.append('maxAmount', maxAmount);

      const res = await fetch(`/api/export/orders?${query}`);
      if (!res.ok) throw new Error('Failed to export orders');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Orders exported successfully',
        duration: 3000,
      });
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to export orders',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);

      const query = new URLSearchParams({
        status: statusFilter,
        format: 'pdf',
      });

      if (dateFrom) query.append('dateFrom', dateFrom);
      if (dateTo) query.append('dateTo', dateTo);
      if (minAmount) query.append('minAmount', minAmount);
      if (maxAmount) query.append('maxAmount', maxAmount);

      const res = await fetch(`/api/export/orders-pdf?${query}`);
      if (!res.ok) throw new Error('Failed to export PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addNotification({
        type: 'success',
        title: 'Success',
        message: 'PDF report exported successfully',
        duration: 3000,
      });
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to export PDF',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setMinAmount('');
    setMaxAmount('');
    setPage(1);
    setShowAdvancedFilters(false);
  };

  const hasActiveFilters = statusFilter !== 'all' || dateFrom || dateTo || minAmount || maxAmount;

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
          <div className="flex gap-4 items-end mb-4">
            <div className="flex-1">
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
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-2 rounded-lg font-medium ${
                showAdvancedFilters
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              ⚙️ Advanced
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || orders.length === 0}
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {isExporting ? '📥 Exporting...' : '📥 Export CSV'}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting || orders.length === 0}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {isExporting ? '📄 Generating...' : '📄 Export PDF'}
            </button>
          </div>

          {hasActiveFilters && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600">Filters active:</span>
              <button
                onClick={handleResetFilters}
                className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Reset all filters
              </button>
            </div>
          )}

          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t pt-4 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Date To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Min Amount (£)
                </label>
                <input
                  type="number"
                  value={minAmount}
                  onChange={(e) => {
                    setMinAmount(e.target.value);
                    setPage(1);
                  }}
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Max Amount (£)
                </label>
                <input
                  type="number"
                  value={maxAmount}
                  onChange={(e) => {
                    setMaxAmount(e.target.value);
                    setPage(1);
                  }}
                  placeholder="999999.00"
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    amountError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {amountError && (
                <div className="col-span-full text-xs text-red-600 bg-red-50 p-2 rounded">
                  ⚠️ {amountError}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {selectedOrders.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-4"
          >
            <span className="text-sm font-medium text-blue-900">
              {selectedOrders.size} order{selectedOrders.size !== 1 ? 's' : ''} selected
            </span>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="px-3 py-1 rounded-lg border border-blue-300 text-sm"
            >
              <option value="">Update Status To...</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleBulkUpdate}
              disabled={!bulkStatus || isPerformingBulkUpdate}
              className="px-4 py-1 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isPerformingBulkUpdate ? 'Updating...' : 'Update'}
            </button>
            <button
              onClick={() => setSelectedOrders(new Set())}
              className="ml-auto px-4 py-1 rounded-lg bg-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-400"
            >
              Clear
            </button>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
          >
            <p className="text-sm text-red-700">
              <strong>Error:</strong> {error}
            </p>
          </motion.div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-600 font-medium">📭 No orders found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
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
                    <th className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedOrders.size > 0 && selectedOrders.size === orders.length}
                        onChange={handleSelectAll}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </th>
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
                    <tr key={order._id} className={`border-t hover:bg-gray-50 ${selectedOrders.has(order._id) ? 'bg-blue-50' : ''}`}>
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedOrders.has(order._id)}
                          onChange={() => handleSelectOrder(order._id)}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </td>
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
                            setEditPrice(order.total?.toString() || '');
                            setPriceReason('');
                            const prices: Record<number, string> = {};
                            order.items?.forEach((item: any, idx: number) => {
                              prices[idx] = item.price?.toString() || '';
                            });
                            setItemPrices(prices);
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
            className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">Order Details & Update Status</h2>

            <div className="mb-6 pb-4 border-b">
              <p className="text-sm text-gray-600"><strong>Order ID:</strong> {selectedOrder.orderNumber}</p>
              <p className="text-sm text-gray-600"><strong>Customer:</strong> {typeof selectedOrder.userId === 'object' ? selectedOrder.userId?.name : 'Loading...'}</p>
              <p className="text-sm text-gray-600"><strong>Email:</strong> {typeof selectedOrder.userId === 'object' ? selectedOrder.userId?.email : 'Loading...'}</p>
              <p className="text-sm text-gray-600"><strong>Total:</strong> £{editPrice ? parseFloat(editPrice).toFixed(2) : (selectedOrder.total?.toFixed(2) || '0.00')}</p>
              <p className="text-sm text-gray-600 mt-2"><strong>Current Status:</strong> <span className={`px-2 py-1 rounded text-xs font-semibold ${editPrice && parseFloat(editPrice) !== selectedOrder.total ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{editPrice && parseFloat(editPrice) !== selectedOrder.total ? 'Price Updated (Pending Invoice)' : selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}</span></p>
            </div>

            {/* Products Section */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="mb-6 pb-4 border-b">
                <h3 className="text-sm font-bold mb-3 text-gray-800">Order Items ({selectedOrder.items.length})</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      {item.size && <p className="text-xs text-gray-600">Size: {item.size}</p>}
                      {item.quantity && <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>}
                      {item.price && <p className="text-xs text-gray-600">Price: £{item.price.toFixed(2)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Entry Section for Invoice */}
            <div className="mb-6 pb-4 border-b">
              <h3 className="text-sm font-bold mb-3 text-gray-800">💰 Edit Item Prices & Send Invoice</h3>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="mb-4 space-y-3">
                  {selectedOrder.items.map((item: any, index: number) => {
                    const itemTotal = (parseFloat(itemPrices[index]) || 0) * (item.quantity || 1);
                    return (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs font-semibold text-gray-700 mb-2">{item.name} × {item.quantity}</p>
                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Price per Unit (£)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={itemPrices[index] || ''}
                              onChange={(e) => setItemPrices({...itemPrices, [index]: e.target.value})}
                              placeholder="0.00"
                              className="w-full px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Total</p>
                            <p className="text-sm font-bold text-gray-900">£{itemTotal.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-600">Order Total:</p>
                    <p className="text-lg font-bold text-blue-600">£{Object.entries(itemPrices).reduce((sum, [idx, price]) => sum + (parseFloat(price) || 0) * (selectedOrder.items[parseInt(idx)]?.quantity || 1), 0).toFixed(2)}</p>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Price Changes (Optional)
                </label>
                <textarea
                  value={priceReason}
                  onChange={(e) => setPriceReason(e.target.value)}
                  placeholder="e.g., Bulk discount applied, Quantity adjustment..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-sm resize-none"
                  rows={2}
                />
              </div>

              <button
                onClick={() => {
                  const hasAnyPrice = Object.values(itemPrices).some(p => p && parseFloat(p) > 0);
                  if (hasAnyPrice) {
                    handleSendInvoice(selectedOrder._id);
                  }
                }}
                disabled={isSendingInvoice || !Object.values(itemPrices).some(p => p && parseFloat(p) > 0)}
                className="w-full px-4 py-3 rounded-lg text-white font-bold bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSendingInvoice ? '📧 Sending Invoice...' : '📧 Generate & Send Invoice'}
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Order Status
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
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                Close
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
