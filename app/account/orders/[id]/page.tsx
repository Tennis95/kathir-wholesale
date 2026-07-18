'use client';

export const dynamic = 'force-dynamic';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
}

export default function OrderDetailsPage() {
  const { isAuthenticated, token, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAddress, setEditedAddress] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchOrderDetails();
  }, [isAuthenticated, isLoading, token, router]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/user/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setEditedAddress(data.order.shippingAddress);
      } else if (res.status === 404) {
        router.push('/account/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    if (!editedAddress || !order) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/user/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shippingAddress: editedAddress }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating address:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/user/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        router.push('/account/orders');
      } else {
        alert('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order');
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading || loading) return null;
  if (!isAuthenticated) return null;
  if (!order) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }} className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  const statusColor = order.status === 'delivered' ? '#D1FAE5' :
                      order.status === 'shipped' ? '#DBEAFE' : '#FEF3C7';
  const statusTextColor = order.status === 'delivered' ? '#065F46' :
                         order.status === 'shipped' ? '#1E40AF' : '#92400E';

  return (
    <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }} className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:underline"
            >
              ← Back to Orders
            </button>
            {order.status === 'pending' && (
              <motion.button
                onClick={handleDeleteOrder}
                disabled={deleting}
                className="px-4 py-2 rounded-lg font-bold text-white transition"
                style={{ background: deleting ? '#A0C9E5' : '#DC2626' }}
                whileHover={{ scale: 1.02 }}
              >
                {deleting ? 'Deleting...' : 'Delete Order'}
              </motion.button>
            )}
          </div>
          <h1 className="text-4xl font-bold" style={{ color: '#1F2937' }}>
            Order {order.orderNumber}
          </h1>
          <p className="text-gray-600 mt-2">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </motion.div>

        {/* Order Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Order Status</p>
              <span className="px-4 py-2 rounded-full font-bold text-sm inline-block"
                style={{
                  background: statusColor,
                  color: statusTextColor
                }}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Payment Status</p>
              <span className="px-4 py-2 rounded-full font-bold text-sm inline-block"
                style={{
                  background: order.paymentStatus === 'paid' ? '#D1FAE5' : '#FEF3C7',
                  color: order.paymentStatus === 'paid' ? '#065F46' : '#92400E'
                }}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
            {order.trackingNumber && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Tracking Number</p>
                <p className="font-bold">{order.trackingNumber}</p>
              </div>
            )}
          </div>
          {order.estimatedDelivery && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Estimated Delivery</p>
              <p className="font-bold text-lg" style={{ color: '#2D7BA8' }}>
                {new Date(order.estimatedDelivery).toLocaleDateString()}
              </p>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D7BA8' }}>
              Order Items
            </h2>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-bold text-lg">{item.name || item.productName}</p>
                  </div>
                  <p className="text-gray-600 font-medium">Qty: {item.quantity}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#2D7BA8' }}>
                Shipping Address
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:underline text-sm font-bold"
                >
                  Edit
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-3 text-sm">
                <p className="font-bold">{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Street</label>
                  <input
                    type="text"
                    value={editedAddress?.street || ''}
                    onChange={(e) => setEditedAddress(prev => ({ ...prev!, street: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">City</label>
                  <input
                    type="text"
                    value={editedAddress?.city || ''}
                    onChange={(e) => setEditedAddress(prev => ({ ...prev!, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">State/Region</label>
                  <input
                    type="text"
                    value={editedAddress?.state || ''}
                    onChange={(e) => setEditedAddress(prev => ({ ...prev!, state: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Postal Code</label>
                  <input
                    type="text"
                    value={editedAddress?.zipCode || ''}
                    onChange={(e) => setEditedAddress(prev => ({ ...prev!, zipCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button
                    onClick={handleUpdateAddress}
                    disabled={saving}
                    className="flex-1 px-4 py-2 rounded-lg font-bold text-white transition"
                    style={{ background: saving ? '#A0C9E5' : '#2D7BA8' }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {saving ? 'Saving...' : 'Save Address'}
                  </motion.button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2 rounded-lg font-bold border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Billing Address */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-bold mb-3" style={{ color: '#2D7BA8' }}>Billing Address</h3>
              <div className="space-y-2 text-sm">
                <p className="font-bold">{order.billingAddress.street}</p>
                <p>{order.billingAddress.city}, {order.billingAddress.state}</p>
                <p>{order.billingAddress.zipCode}</p>
                <p>{order.billingAddress.country}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
