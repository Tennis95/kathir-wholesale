'use client';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  const { isAdminAuthenticated } = useAdminAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push('/auth/admin/login');
    }
  }, [isAdminAuthenticated, router]);

  if (!isAdminAuthenticated) return null;

  const products = [
    { id: 1, name: 'Appam Idiyappam pathiri podi 1kg', sku: 'APP-001', category: 'Flours', stock: 45, price: '£12.99', status: 'active' },
    { id: 2, name: 'Barnyard millet 1kg', sku: 'BAR-001', category: 'Grains', stock: 32, price: '£8.50', status: 'active' },
    { id: 3, name: 'Premium Basmati Rice 5kg', sku: 'BAS-001', category: 'Rice', stock: 28, price: '£24.99', status: 'active' },
    { id: 4, name: 'Organic Turmeric Powder 500g', sku: 'TUM-001', category: 'Spices', stock: 0, price: '£6.99', status: 'inactive' },
  ];

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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-4" />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300">
            <option value="all">All Categories</option>
            <option value="Flours">Flours</option>
            <option value="Grains">Grains</option>
            <option value="Rice">Rice</option>
            <option value="Spices">Spices</option>
          </select>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: '#F3F4F6' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">SKU</th>
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
                    <td className="px-6 py-4 text-sm text-gray-600">{p.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.category}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: p.stock === 0 ? '#DC2626' : p.stock < 20 ? '#B45309' : '#059669' }}>{p.stock}</td>
                    <td className="px-6 py-4 text-sm font-medium">{p.price}</td>
                    <td className="px-6 py-4 text-center text-sm"><button className="text-blue-600 hover:underline mr-3">Edit</button><button className="text-red-600 hover:underline">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
