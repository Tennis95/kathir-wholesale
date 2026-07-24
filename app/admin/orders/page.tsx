'use client';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const dynamic = 'force-dynamic';

export default function OrdersPage() {
  const { isAdminAuthenticated } = useAdminAuth();
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push('/auth/admin/login');
    }
  }, [isAdminAuthenticated, router]);

  if (!isAdminAuthenticated) return null;

  const orders = [
    { id: 'ORD-001', customer: 'John Smith', email: 'john@example.com', amount: '£245.99', status: 'delivered', date: '2026-07-24', items: 3 },
    { id: 'ORD-002', customer: 'Sarah Johnson', email: 'sarah@example.com', amount: '£89.50', status: 'processing', date: '2026-07-23', items: 2 },
    { id: 'ORD-003', customer: 'Mike Brown', email: 'mike@example.com', amount: '£156.75', status: 'shipped', date: '2026-07-22', items: 4 },
    { id: 'ORD-004', customer: 'Emma Wilson', email: 'emma@example.com', amount: '£512.30', status: 'delivered', date: '2026-07-21', items: 5 },
  ];

  const filtered = orders.filter(o => filterStatus === 'all' || o.status === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/admin" className="text-blue-600 text-sm hover:underline">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold mt-2" style={{ color: '#1F2937' }}>Order Management</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <label className="block text-sm font-medium mb-2">Filter by Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full md:w-48 px-4 py-2 rounded-lg border border-gray-300">
            <option value="all">All Orders</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: '#F3F4F6' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: '#2D7BA8' }}>{o.id}</td>
                    <td className="px-6 py-4 text-sm"><div className="font-medium">{o.customer}</div><div className="text-gray-500 text-xs">{o.email}</div></td>
                    <td className="px-6 py-4 text-sm">{o.items}</td>
                    <td className="px-6 py-4 text-sm font-medium">{o.amount}</td>
                    <td className="px-6 py-4 text-sm"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(o.status)}`}>{o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{o.date}</td>
                    <td className="px-6 py-4 text-center"><button className="text-blue-600 hover:underline text-sm">View</button></td>
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
