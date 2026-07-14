'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'motion/react';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user?.role, router]);

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
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#1F2937' }}>
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome, {user?.name}!</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Products', value: 50, icon: '📦' },
            { label: 'Total Orders', value: 0, icon: '🛒' },
            { label: 'Total Users', value: 0, icon: '👥' },
            { label: 'Total Revenue', value: '£0', icon: '💰' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold" style={{ color: '#2D7BA8' }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            {
              title: 'Manage Products',
              description: 'Add, edit, or delete products',
              link: '/admin/products',
              icon: '📝',
            },
            {
              title: 'View Orders',
              description: 'Track and manage all orders',
              link: '/admin/orders',
              icon: '📋',
            },
            {
              title: 'Manage Users',
              description: 'View and manage user accounts',
              link: '/admin/users',
              icon: '👤',
            },
            {
              title: 'Analytics',
              description: 'View sales and performance metrics',
              link: '/admin/analytics',
              icon: '📊',
            },
          ].map((action, idx) => (
            <a
              key={idx}
              href={action.link}
              className="block bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="text-4xl mb-3">{action.icon}</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#1F2937' }}>
                {action.title}
              </h3>
              <p className="text-gray-600">{action.description}</p>
            </a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
