'use client';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  const { isAdminAuthenticated, adminToken } = useAdminAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push('/auth/admin/login');
    }
  }, [isAdminAuthenticated, router]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchProducts();
    }
  }, [isAdminAuthenticated]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch products');

      const data = await res.json();
      setProducts(data.data || []);
      setError('');
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete product');

      setProducts(products.filter(p => p.id !== productId));
    } catch (err: any) {
      alert('Error deleting product: ' + err.message);
    }
  };

  if (!isAdminAuthenticated) return null;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === 'all' || p.category === filterCategory)
  );

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin" className="text-blue-600 text-sm hover:underline">← Back to Dashboard</Link>
              <h1 className="text-2xl font-bold mt-2" style={{ color: '#1F2937' }}>Products</h1>
            </div>
            <Link href="/admin/products/new">
              <button className="px-4 py-2 rounded-lg text-white font-medium" style={{ background: '#2D7BA8' }}>+ Add Product</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200"
          >
            <p style={{ color: '#DC2626' }}>{error}</p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-4"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
          >
            <option value="all">All Categories</option>
            <option value="Flours">Flours</option>
            <option value="Grains">Grains</option>
            <option value="Rice">Rice</option>
            <option value="Spices">Spices</option>
            <option value="Lentils & Pulses">Lentils & Pulses</option>
            <option value="Ready to Cook">Ready to Cook</option>
          </select>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">
              <p>Loading products...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>{products.length === 0 ? 'No products found. Create one to get started.' : 'No matching products found.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: '#F3F4F6' }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Price</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{p.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{p.category}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: p.stock === 0 ? '#DC2626' : p.stock < 20 ? '#B45309' : '#059669' }}>
                        {p.stock}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">£{p.price?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center text-sm">
                        <Link href={`/admin/products/${p.id}`} className="text-blue-600 hover:underline mr-3">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
