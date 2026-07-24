'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('kathir-admin-user', JSON.stringify(data.user));
      localStorage.setItem('kathir-admin-token', data.token);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT SIDE - ADMIN BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E5A7A 0%, #154A66 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle cx="200" cy="200" r="150" fill="none" stroke="white" strokeWidth="1" opacity="0.1" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="text-4xl font-bold mb-2">🛡️ KATHIR ADMIN</div>
              <div className="text-lg" style={{ color: '#E8F4FB' }}>Wholesale Management Portal</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold mb-4">Manage Your<br />Wholesale Business</h2>
                <p className="text-sm leading-relaxed" style={{ color: '#E8F4FB' }}>
                  Access your admin dashboard to manage orders, products, invoices, and team members.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#8FD3F4' }}>
                    <span>📦</span>
                  </div>
                  <span className="text-sm">Order Management</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#8FD3F4' }}>
                    <span>📊</span>
                  </div>
                  <span className="text-sm">Analytics & Reports</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#8FD3F4' }}>
                    <span>💼</span>
                  </div>
                  <span className="text-sm">Team Management</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#8FD3F4' }}>
                    <span>📄</span>
                  </div>
                  <span className="text-sm">Invoice Generation</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-xs" style={{ color: '#E8F4FB' }}>
            © 2026 KATHIR LTD. Admin Portal. All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1E5A7A' }}>
              Admin Login
            </h1>
            <p className="text-gray-600">Sign in to your admin account</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg"
              style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1F2937' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@kathir.co.uk"
                required
                className="w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none focus:border-blue-600"
                style={{
                  borderColor: '#E5E7EB'
                }}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold" style={{ color: '#1F2937' }}>
                  Password
                </label>
                <Link href="/auth/admin/forgot-password" className="text-sm font-semibold" style={{ color: '#2D7BA8' }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none focus:border-blue-600"
                style={{
                  borderColor: '#E5E7EB'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-center text-sm text-gray-600 mb-4">
              Don't have an admin account?
            </p>
            <Link
              href="/auth/admin/signup"
              className="block w-full py-3 rounded-lg font-bold text-center transition"
              style={{ background: '#F3F4F6', color: '#2D7BA8', border: '2px solid #E5E7EB' }}
            >
              Request Admin Access
            </Link>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <Link href="/auth/login" className="hover:underline">
              ← Back to Customer Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
