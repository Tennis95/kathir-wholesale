'use client';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { motion } from 'motion/react';

export const dynamic = 'force-dynamic';

export default function UsersPage() {
  const { isAdminAuthenticated } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push('/auth/admin/login');
    }
  }, [isAdminAuthenticated, router]);

  if (!isAdminAuthenticated) return null;

  const users = [
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+44 7700 900000', joinDate: '2026-01-15', orders: 12, status: 'active' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+44 7700 900001', joinDate: '2026-02-20', orders: 8, status: 'active' },
    { id: 3, name: 'Mike Brown', email: 'mike@example.com', phone: '+44 7700 900002', joinDate: '2026-03-10', orders: 15, status: 'active' },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', phone: '+44 7700 900003', joinDate: '2026-04-05', orders: 5, status: 'inactive' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/admin" className="text-blue-600 text-sm hover:underline">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold mt-2" style={{ color: '#1F2937' }}>User Management</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: '#F3F4F6' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Orders</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Joined</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{u.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.phone}</td>
                    <td className="px-6 py-4 text-sm font-medium">{u.orders}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.joinDate}</td>
                    <td className="px-6 py-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{u.status.charAt(0).toUpperCase() + u.status.slice(1)}</span></td>
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
