'use client';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, FormEvent } from 'react';
import { motion } from 'motion/react';

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  const { isAdminAuthenticated, adminToken, isLoading } = useAdminAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    size: '',
    imageUrl: '',
    discount: '',
  });

  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated) {
      router.push('/auth/admin/login');
    }
  }, [isAdminAuthenticated, router, isLoading]);

  if (isLoading || !isAdminAuthenticated) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!formData.name || !formData.category || !formData.price || !formData.stock) {
        throw new Error('Please fill in all required fields');
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Error creating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/admin/products" className="text-blue-600 text-sm hover:underline">← Back to Products</Link>
          <h1 className="text-2xl font-bold mt-2" style={{ color: '#1F2937' }}>Add New Product</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200"
            >
              <p style={{ color: '#DC2626' }}>{error}</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                placeholder="e.g. Appam Idiyappam pathiri podi 1kg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size/Weight *</label>
              <input
                type="text"
                name="size"
                required
                value={formData.size}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                placeholder="e.g. 1kg, 500g"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
              >
                <option value="">Select Category</option>
                <option value="Specialty Flours">Specialty Flours</option>
                <option value="Grains">Grains</option>
                <option value="Rice">Rice</option>
                <option value="Spices">Spices</option>
                <option value="Lentils & Pulses">Lentils & Pulses</option>
                <option value="Ready to Cook">Ready to Cook</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (£) *</label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                placeholder="12.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                required
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                placeholder="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
              <input
                type="number"
                name="discount"
                step="0.01"
                value={formData.discount}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                placeholder="0"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300"
              rows={4}
              placeholder="Product description..."
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg text-white font-medium"
              style={{ background: '#2D7BA8', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </button>
            <Link href="/admin/products">
              <button type="button" className="px-6 py-2 rounded-lg border border-gray-300 font-medium text-gray-700">
                Cancel
              </button>
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
