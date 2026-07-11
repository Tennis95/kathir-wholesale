'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const CATEGORIES = [
  'Ready to Cook',
  'Rice & Grains',
  'Lentils & Pulses',
  'Groceries',
  'Snacks & Sweets',
  'Flour & Baking',
  'Vegetables',
  'Spices & Masalas',
];

export default function EditProductPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Ready to Cook',
    description: '',
    price: '',
    size: '',
    stock: '',
    discount: '0',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    fetchProduct();
  }, [isAuthenticated, user?.role, router, productId]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`);
      const data = await res.json();
      const product = data.product;

      setFormData({
        name: product.name,
        category: product.category,
        description: product.description || '',
        price: product.price.toString(),
        size: product.size,
        stock: product.stock.toString(),
        discount: (product.discount || 0).toString(),
      });
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          discount: parseInt(formData.discount),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      router.push('/admin/products');
      alert('Product updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Error updating product');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }} className="flex items-center justify-center">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }} className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <a href="/admin/products" className="text-blue-600 hover:underline mb-4 inline-block">
            Back to Products
          </a>
          <h1 className="text-4xl font-bold" style={{ color: '#1F2937' }}>
            Edit Product
          </h1>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2D7BA8' }}>
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#8FD3F4' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2D7BA8' }}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#8FD3F4' }}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2D7BA8' }}>
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#8FD3F4' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2D7BA8' }}>
                  Price (£)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#8FD3F4' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2D7BA8' }}>
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#8FD3F4' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2D7BA8' }}>
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#8FD3F4' }}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-lg font-bold text-white transition transform hover:scale-105 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
                  boxShadow: '0 4px 12px rgba(45, 123, 168, 0.25)',
                }}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </motion.button>
              <a
                href="/admin/products"
                className="flex-1 py-3 rounded-lg font-bold text-white transition text-center"
                style={{ background: '#6B7280' }}
              >
                Cancel
              </a>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
