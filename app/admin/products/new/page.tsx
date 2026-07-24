'use client';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, FormEvent } from 'react';
import { motion } from 'motion/react';

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  const { isAdminAuthenticated } = useAdminAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push('/auth/admin/login');
    }
  }, [isAdminAuthenticated, router]);

  if (!isAdminAuthenticated) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push('/admin/products');
    }, 1000);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300" placeholder="e.g. Appam Idiyappam pathiri podi 1kg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
              <input type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300" placeholder="e.g. APP-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select required className="w-full px-4 py-2 rounded-lg border border-gray-300">
                <option>Select Category</option>
                <option>Specialty Flours</option>
                <option>Grains</option>
                <option>Rice</option>
                <option>Spices</option>
                <option>Pulses</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (£) *</label>
              <input type="number" required step="0.01" className="w-full px-4 py-2 rounded-lg border border-gray-300" placeholder="12.99" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
              <input type="number" required className="w-full px-4 py-2 rounded-lg border border-gray-300" placeholder="50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select required className="w-full px-4 py-2 rounded-lg border border-gray-300">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea className="w-full px-4 py-2 rounded-lg border border-gray-300" rows={4} placeholder="Product description..."></textarea>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg text-white font-medium" style={{ background: '#2D7BA8', opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </button>
            <Link href="/admin/products">
              <button type="button" className="px-6 py-2 rounded-lg border border-gray-300 font-medium text-gray-700">Cancel</button>
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
