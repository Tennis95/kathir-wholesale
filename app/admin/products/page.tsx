'use client';

export const dynamic = 'force-dynamic';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Product {
  _id: string;
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  size: string;
  inStock: boolean;
}

export default function AdminProducts() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/auth/login');
      return;
    }

    fetchProducts();
  }, [isAuthenticated, user?.role, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
        alert('Product deleted successfully');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.includes(searchTerm)
  );

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #E8F4FB 0%, #F0F9FE 100%)', minHeight: '100vh' }} className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#1F2937' }}>
              Manage Products
            </h1>
            <p className="text-gray-600">Total: {products.length} products</p>
          </div>
          <a
            href="/admin/products/new"
            className="px-6 py-3 rounded-lg font-bold text-white transition transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #2D7BA8 0%, #1E5A7A 100%)',
              boxShadow: '0 4px 12px rgba(45, 123, 168, 0.25)',
            }}
          >
            ➕ Add Product
          </a>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <input
            type="text"
            placeholder="Search by name, category, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
            style={{ borderColor: '#8FD3F4', color: '#333' }}
          />
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-600">No products found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: '#F0F9FE', borderBottom: '2px solid #E8F4FB' }}>
                  <tr>
                    <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>ID</th>
                    <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Name</th>
                    <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Category</th>
                    <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Price</th>
                    <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Stock</th>
                    <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Status</th>
                    <th className="px-6 py-4 text-left font-bold" style={{ color: '#2D7BA8' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} style={{ borderBottom: '1px solid #E8F4FB' }}>
                      <td className="px-6 py-4 text-sm font-bold" style={{ color: '#2D7BA8' }}>
                        {product.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                      <td className="px-6 py-4 text-sm">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-bold">£{(product.price || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">{product.stock} units</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          product.inStock ? 'text-green-700' : 'text-red-700'
                        }`}
                        style={{
                          background: product.inStock ? '#D1FAE5' : '#FEE2E2'
                        }}>
                          {product.inStock ? '✓ In Stock' : '✗ Out'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <a
                          href={`/admin/products/${product._id}`}
                          className="inline-block px-3 py-1 rounded text-white text-xs font-bold"
                          style={{ background: '#2D7BA8' }}
                        >
                          Edit
                        </a>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="px-3 py-1 rounded text-white text-xs font-bold"
                          style={{ background: '#DC2626' }}
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
