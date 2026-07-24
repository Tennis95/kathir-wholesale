'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to send reset link');
      } else {
        setSuccess('✅ Password reset link sent to your email. Check your inbox!');
        setEmail('');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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
              <div className="text-4xl font-bold mb-2">🔐 Password Reset</div>
              <div className="text-lg" style={{ color: '#E8F4FB' }}>KATHIR Admin Portal</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Recover Your<br />Admin Account</h2>
                <p className="text-sm leading-relaxed" style={{ color: '#E8F4FB' }}>
                  Enter your email address and we'll send you a secure link to reset your password.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span>🔒</span>
                  <span className="text-sm">Secure password reset</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>⏱️</span>
                  <span className="text-sm">Link expires in 24 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>📧</span>
                  <span className="text-sm">Check your email inbox</span>
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
              Reset Password
            </h1>
            <p className="text-gray-600">Enter your admin email address</p>
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
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kathir.co.uk"
                required
                className="w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none"
                style={{ borderColor: '#E5E7EB' }}
              />
              <p className="text-xs text-gray-500 mt-2">
                We'll send a password reset link to this email address.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)' }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-8 space-y-3">
            <div className="text-center">
              <Link
                href="/auth/admin/login"
                className="text-sm font-semibold"
                style={{ color: '#2D7BA8' }}
              >
                ← Back to Login
              </Link>
            </div>

            <div className="text-center">
              <Link
                href="/auth/admin/signup"
                className="text-sm font-semibold"
                style={{ color: '#2D7BA8' }}
              >
                Request Admin Access →
              </Link>
            </div>

            <div className="text-center text-xs text-gray-500">
              <Link href="/auth/login" className="hover:underline">
                Customer Login
              </Link>
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-8 p-4 rounded-lg" style={{ background: '#F0F9FE' }}>
            <p className="text-xs text-gray-600">
              <strong>Need help?</strong> Contact the admin team at <br />
              <a href="mailto:admin@kathir.co.uk" style={{ color: '#2D7BA8' }} className="font-semibold">
                admin@kathir.co.uk
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
