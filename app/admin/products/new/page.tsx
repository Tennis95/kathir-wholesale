'use client';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useNotification } from '@/context/NotificationContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, FormEvent } from 'react';
import { motion } from 'motion/react';

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  const { isAdminAuthenticated, adminToken, isLoading } = useAdminAuth();
  const { addNotification } = useNotification();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.size.trim()) newErrors.size = 'Size is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Stock must be 0 or greater';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields correctly',
        duration: 5000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category,
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          size: formData.size.trim(),
          imageUrl: formData.imageUrl.trim(),
          discount: formData.discount ? parseFloat(formData.discount) : 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create product');
      }

      addNotification({
        type: 'success',
        title: 'Success',
        message: `"${formData.name}" has been created successfully!`,
        duration: 4000,
      });

      router.push('/admin/products');
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to create product',
        duration: 5000,
      });
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. Appam Idiyappam pathiri podi 1kg"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size/Weight *</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${errors.size ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. 1kg, 500g"
              />
              {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Category</option>
                <option value="Specialty Flours">Specialty Flours</option>
                <option value="Grains">Grains</option>
                <option value="Rice">Rice</option>
                <option value="Spices">Spices</option>
                <option value="Lentils & Pulses">Lentils & Pulses</option>
                <option value="Ready to Cook">Ready to Cook</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (£) *</label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="12.99"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="50"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
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
