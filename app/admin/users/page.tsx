'use client';

import { useAdminAuth } from '@/context/AdminAuthContext';
import { useNotification } from '@/context/NotificationContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const dynamic = 'force-dynamic';

export default function UsersPage() {
  const { isAdminAuthenticated, adminToken, isLoading: authLoading } = useAdminAuth();
  const { addNotification } = useNotification();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdminAuthenticated) {
      router.push('/auth/admin/login');
    }
  }, [isAdminAuthenticated, router, authLoading]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchUsers();
    }
  }, [isAdminAuthenticated, statusFilter, page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        status: statusFilter,
        page: page.toString(),
        limit: '10',
      });

      const res = await fetch(`/api/admin/users?${query}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch users');

      const data = await res.json();
      setUsers(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to load users',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    if (!window.confirm(
      currentStatus
        ? 'Are you sure you want to deactivate this customer?'
        : 'Are you sure you want to activate this customer?'
    )) {
      return;
    }

    try {
      setTogglingId(userId);

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) throw new Error('Failed to update user');

      addNotification({
        type: 'success',
        title: 'Success',
        message: `Customer ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        duration: 3000,
      });

      fetchUsers();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to update customer',
      });
    } finally {
      setTogglingId(null);
    }
  };

  if (!isAdminAuthenticated) return null;

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin" className="text-blue-600 text-sm hover:underline">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold mt-2" style={{ color: '#1F2937' }}>
                Customer Management
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
          >
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading customers...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No customers found</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <table className="w-full">
                <thead style={{ background: '#F3F4F6' }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Orders</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user._id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.orderCount || 0}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(user._id, user.isActive)}
                          disabled={togglingId === user._id}
                          className={`text-sm font-medium ${
                            user.isActive
                              ? 'text-red-600 hover:underline'
                              : 'text-green-600 hover:underline'
                          } disabled:opacity-50`}
                        >
                          {togglingId === user._id
                            ? 'Updating...'
                            : user.isActive
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">{page} of {totalPages}</span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
