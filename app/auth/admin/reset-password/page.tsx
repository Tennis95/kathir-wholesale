'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      setTokenValid(false);
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to reset password');
      } else {
        setSuccess('✅ Password reset successfully! Redirecting to login...');
        setTimeout(() => router.push('/auth/admin/login'), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#DC2626' }}>
            🔗 Invalid Link
          </h1>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/auth/admin/forgot-password"
            className="inline-block px-8 py-3 rounded-lg font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)' }}
          >
            Request New Link
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E5A7A 0%, #154A66 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle cx="200" cy="200" r="150" fill="none" stroke="white" strokeWidth="1" opacity="0.1" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
              <div className="text-4xl font-bold mb-2">🔐 New Password</div>
              <div className="text-lg" style={{ color: '#E8F4FB' }}>KATHIR Admin Portal</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Secure Your<br />Account</h2>
                <p className="text-sm leading-relaxed" style={{ color: '#E8F4FB' }}>
                  Create a strong password to protect your admin account and access your wholesale business management dashboard.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span>✓</span>
                  <span className="text-sm">Minimum 8 characters</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>✓</span>
                  <span className="text-sm">Mix of letters and numbers</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>✓</span>
                  <span className="text-sm">Unique and secure</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-xs" style={{ color: '#E8F4FB' }}>
            © 2026 KATHIR LTD. Secure Portal.
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1E5A7A' }}>
              Create New Password
            </h1>
            <p className="text-gray-600">Enter your new password below</p>
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

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg"
              style={{ background: '#DCFCE7', color: '#166534', border: '1px solid #BBEF63' }}
            >
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1F2937' }}>
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none"
                style={{ borderColor: '#E5E7EB' }}
              />
              <p className="text-xs text-gray-500 mt-2">At least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1F2937' }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none"
                style={{ borderColor: '#E5E7EB' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)' }}
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/admin/login" className="text-sm font-semibold" style={{ color: '#2D7BA8' }}>
              ← Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
