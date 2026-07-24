'use client';

export const dynamic = 'force-dynamic';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

interface Order {
  _id: string;
  orderNumber: string;
  total?: number;
  status: string;
  createdAt: string;
}

export default function AccountPage() {
  const { user, isAuthenticated, logout, token, isLoading } = useAuth();
  const router = useRouter();
  const redirectedRef = useRef(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isLoading) return;

    if (!isAuthenticated && !redirectedRef.current) {
      redirectedRef.current = true;
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated && user) {
      setEditData({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
      fetchOrders();
    }
  }, [isAuthenticated, isLoading, user, isMounted, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/user/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user?._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editData.name,
          email: editData.email,
          phone: editData.phone,
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isMounted || isLoading || loading || !isAuthenticated) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }} className="flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }} className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#1F2937' }}>
              My Account
            </h1>
            <p className="text-gray-600">Welcome, {user?.name}!</p>
          </div>
          <motion.button
            onClick={handleLogout}
            className="px-6 py-3 rounded-lg font-bold text-white transition transform hover:scale-105"
            style={{
              background: '#DC2626',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
            }}
            whileHover={{ scale: 1.05 }}
          >
            Logout
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <motion.div className="mb-8 flex gap-2">
          {[
            { id: 'orders', label: 'Order History', icon: '📦' },
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-bold transition ${
                activeTab === tab.id 
                  ? 'text-white' 
                  : 'text-gray-600 bg-white'
              }`}
              style={{
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)'
                  : '#f3f4f6'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Order History */}
        {activeTab === 'orders' && (
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D7BA8' }}>Order History</h2>
            {loading ? (
              <p className="text-gray-600">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-600">No orders yet. <a href="/categories" className="text-blue-600 hover:underline">Shop now</a></p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ background: '#F0F9FE', borderBottom: '2px solid #E8F4FB' }}>
                    <tr>
                      <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Order #</th>
                      <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Status</th>
                      <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Date</th>
                      <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} style={{ borderBottom: '1px solid #E8F4FB' }}>
                        <td className="px-6 py-4 font-bold" style={{ color: '#2D7BA8' }}>{order.orderNumber}</td>
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
                        <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 flex gap-3">
                          <a href={`/account/orders/${order._id}`} className="text-blue-600 hover:underline text-sm font-bold">
                            View
                          </a>
                          <a
                            href={`/invoice?orderId=${order._id}&autoprint=0`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline text-sm font-bold"
                          >
                            📄 Invoice
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* Profile */}
        {activeTab === 'profile' && (
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#2D7BA8' }}>Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => {
                    setEditData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
                    setIsEditing(true);
                  }}
                  className="text-blue-600 hover:underline text-sm font-bold"
                >
                  Edit
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <p className="text-lg font-medium">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="text-lg font-medium">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <p className="text-lg font-medium">{user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Account Type</label>
                  <p className="text-lg font-medium">{user?.role === 'admin' ? 'Administrator' : 'Customer'}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 px-4 py-2 rounded-lg font-bold text-white transition"
                    style={{ background: saving ? '#A0C9E5' : '#2D7BA8' }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
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
          </motion.div>
        )}

        {/* Wishlist */}
        {activeTab === 'wishlist' && (
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2D7BA8' }}>My Wishlist</h2>
            <p className="text-gray-600">Wishlist feature coming soon!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
