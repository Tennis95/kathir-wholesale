'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      router.push('/categories');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }} className="flex items-center justify-center py-12 px-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: '#1F2937' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Create Account
        </motion.h1>

        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-600">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D7BA8' }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition"
              style={{ borderColor: '#8FD3F4', color: '#333' }}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D7BA8' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition"
              style={{ borderColor: '#8FD3F4', color: '#333' }}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D7BA8' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition"
              style={{ borderColor: '#8FD3F4', color: '#333' }}
              placeholder="Min 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2D7BA8' }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition"
              style={{ borderColor: '#8FD3F4', color: '#333' }}
              placeholder="Confirm password"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-white transition transform hover:scale-105 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
              boxShadow: '0 4px 12px rgba(45, 123, 168, 0.25)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="font-bold hover:underline" style={{ color: '#2D7BA8' }}>
            Login here
          </a>
        </p>
      </motion.div>
    </div>
  );
}
