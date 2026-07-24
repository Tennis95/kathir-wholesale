'use client';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { motion } from 'motion/react';

export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  const { isAdminAuthenticated } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push('/auth/admin/login');
    }
  }, [isAdminAuthenticated, router]);

  if (!isAdminAuthenticated) return null;

  const metrics = [
    { label: 'Total Revenue', value: '£12,450', change: '+12.5%', color: '#059669' },
    { label: 'Total Orders', value: '84', change: '+8.2%', color: '#2D7BA8' },
    { label: 'Average Order Value', value: '£148.21', change: '+5.3%', color: '#7C3AED' },
    { label: 'Customer Growth', value: '+24', change: '+6.8%', color: '#B45309' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/admin" className="text-blue-600 text-sm hover:underline">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold mt-2" style={{ color: '#1F2937' }}>Analytics & Reports</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((m, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">{m.label}</p>
              <p className="text-3xl font-bold mb-2" style={{ color: m.color }}>{m.value}</p>
              <p className="text-sm font-semibold" style={{ color: m.color }}>{m.change} from last month</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#1F2937' }}>Revenue Trend</h3>
            <div className="h-48 flex items-end gap-2">
              {[45, 52, 48, 61, 55, 68, 72].map((v, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t" style={{ background: `linear-gradient(to top, #2D7BA8, #5BA3D0)`, height: `${(v / 72) * 100}%` }} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#1F2937' }}>Top Categories</h3>
            <div className="space-y-3">
              {['Specialty Flours', 'Grains', 'Spices', 'Pulses'].map((cat, i) => (
                <div key={i} className="flex items-center">
                  <span className="text-sm font-medium w-24">{cat}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3" style={{ background: '#E5E7EB' }}>
                    <div className="h-full rounded-full" style={{ background: '#2D7BA8', width: `${[85, 72, 68, 55][i]}%` }} />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{[85, 72, 68, 55][i]}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
