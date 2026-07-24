'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AdminSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    role: 'manager',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    try {
      const res = await fetch('/api/auth/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
      } else {
        setSuccess('✅ Request submitted! An admin will review and approve your access.');
        setTimeout(() => router.push('/auth/admin/login'), 3000);
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
              <div className="text-4xl font-bold mb-2">🛡️ KATHIR ADMIN</div>
              <div className="text-lg" style={{ color: '#E8F4FB' }}>Team Access Request</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Join Your<br />Admin Team</h2>
                <p className="text-sm leading-relaxed" style={{ color: '#E8F4FB' }}>
                  Request admin access to manage your wholesale business. Your request will be reviewed by the admin team.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span>✓</span>
                  <span className="text-sm">Full Order Management</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>✓</span>
                  <span className="text-sm">Invoice Generation</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>✓</span>
                  <span className="text-sm">Analytics & Reports</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>✓</span>
                  <span className="text-sm">Secure Access Control</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-xs" style={{ color: '#E8F4FB' }}>
            © 2026 KATHIR LTD. Admin Portal.
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - SIGNUP FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1E5A7A' }}>
              Request Admin Access
            </h1>
            <p className="text-gray-600">Fill in your details to request admin account</p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1F2937' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-2 rounded-lg border-2 transition focus:outline-none"
                style={{ borderColor: '#E5E7EB' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1F2937' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@kathir.co.uk"
                required
                className="w-full px-4 py-2 rounded-lg border-2 transition focus:outline-none"
                style={{ borderColor: '#E5E7EB' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1F2937' }}>
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="KATHIR LTD"
                required
                className="w-full px-4 py-2 rounded-lg border-2 transition focus:outline-none"
                style={{ borderColor: '#E5E7EB' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1F2937' }}>
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border-2 transition focus:outline-none"
                style={{ borderColor: '#E5E7EB' }}
              >
                <option value="manager">Order Manager</option>
                <option value="admin">Admin</option>
                <option value="finance">Finance Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1F2937' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 rounded-lg border-2 transition focus:outline-none"
                style={{ borderColor: '#E5E7EB' }}
              />
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
                className="w-full px-4 py-2 rounded-lg border-2 transition focus:outline-none"
                style={{ borderColor: '#E5E7EB' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              style={{ background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)' }}
            >
              {loading ? 'Submitting...' : 'Request Admin Access'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">Already have an admin account?</p>
            <Link
              href="/auth/admin/login"
              className="block w-full py-3 rounded-lg font-bold text-center transition"
              style={{ background: '#F3F4F6', color: '#2D7BA8', border: '2px solid #E5E7EB' }}
            >
              Sign In Instead
            </Link>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            <Link href="/auth/login" className="hover:underline">
              ← Back to Customer Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
