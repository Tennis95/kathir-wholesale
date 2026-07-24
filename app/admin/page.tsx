'use client';

import { useAdminAuth } from '@/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { motion } from 'motion/react';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const { adminUser, isAdminAuthenticated, logout } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push('/auth/admin/login');
    }
  }, [isAdminAuthenticated, router]);

  if (!isAdminAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/auth/admin/login');
  };

  const stats = [
    { label: 'Total Products', value: 50, icon: '📦', color: 'from-blue-50 to-blue-100', textColor: '#1E40AF' },
    { label: 'Total Orders', value: 0, icon: '🛒', color: 'from-emerald-50 to-emerald-100', textColor: '#065F46' },
    { label: 'Total Users', value: 0, icon: '👥', color: 'from-purple-50 to-purple-100', textColor: '#5B21B6' },
    { label: 'Total Revenue', value: '£0', icon: '💰', color: 'from-orange-50 to-orange-100', textColor: '#B45309' },
  ];

  const modules = [
    {
      title: 'Manage Products',
      description: 'Add, edit, or delete products from your catalog',
      icon: '📋',
      href: '/admin/products',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'View Orders',
      description: 'Track and manage all customer orders',
      icon: '📦',
      href: '/admin/orders',
      color: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600'
    },
    {
      title: 'Manage Users',
      description: 'View and manage customer accounts',
      icon: '👥',
      href: '/admin/users',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: 'Analytics',
      description: 'View sales trends and business insights',
      icon: '📊',
      href: '/admin/analytics',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {adminUser?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Role: <span className="font-semibold" style={{ color: '#2D7BA8' }}>{adminUser?.role}</span></span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all"
              style={{ background: '#DC2626' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#B91C1C'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#DC2626'}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-lg font-bold mb-6" style={{ color: '#1F2937' }}>Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 border border-gray-100 shadow-sm transition-all`}
                whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold" style={{ color: stat.textColor }}>
                      {stat.value}
                    </p>
                  </div>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
                <p className="text-xs text-gray-600">View details →</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Management Modules */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-lg font-bold mb-6" style={{ color: '#1F2937' }}>Management Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module, idx) => (
              <Link href={module.href} key={idx}>
                <motion.div
                  className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer transition-all h-full"
                  whileHover={{ scale: 1.02, boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${module.color} ${module.hoverColor} text-white rounded-lg p-3 transition-all text-xl`}>
                      {module.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#1F2937' }}>
                    {module.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                  <div className="flex items-center text-sm font-semibold transition-all group" style={{ color: '#2D7BA8' }}>
                    Open Module
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Quick Access Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 bg-white rounded-xl border border-gray-200 p-8"
        >
          <h2 className="text-lg font-bold mb-6" style={{ color: '#1F2937' }}>Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/products/new">
              <motion.button
                className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all"
                style={{ background: '#2D7BA8' }}
                whileHover={{ scale: 1.02 }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1E5A7A'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#2D7BA8'}
              >
                + Add New Product
              </motion.button>
            </Link>
            <Link href="/admin/orders">
              <motion.button
                className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all"
                style={{ background: '#059669' }}
                whileHover={{ scale: 1.02 }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#047857'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#059669'}
              >
                View Recent Orders
              </motion.button>
            </Link>
            <Link href="/admin/analytics">
              <motion.button
                className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all"
                style={{ background: '#7C3AED' }}
                whileHover={{ scale: 1.02 }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#6D28D9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#7C3AED'}
              >
                View Analytics
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
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
