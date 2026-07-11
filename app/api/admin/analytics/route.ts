import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

async function verifyAdmin(req: NextRequest) {
  try {
    const token = req.cookies.get('authToken')?.value;
    if (!token) return { valid: false, user: null };

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return { valid: false, user: null };
    }

    return { valid: true, user };
  } catch {
    return { valid: false, user: null };
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdmin(req);
    if (!auth.valid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get all data
    const orders = await Order.find();
    const users = await User.find();
    const products = await Product.find();

    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalCustomers = users.filter(u => u.role === 'customer').length;
    const totalProducts = products.length;

    // Order status breakdown
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };

    // Payment status breakdown
    const paymentStatus = {
      pending: orders.filter(o => o.paymentStatus === 'pending').length,
      completed: orders.filter(o => o.paymentStatus === 'completed').length,
      failed: orders.filter(o => o.paymentStatus === 'failed').length,
    };

    // Revenue by status
    const revenueByStatus = {
      pending: orders.filter(o => o.status === 'pending').reduce((sum, o) => sum + o.total, 0),
      processing: orders.filter(o => o.status === 'processing').reduce((sum, o) => sum + o.total, 0),
      shipped: orders.filter(o => o.status === 'shipped').reduce((sum, o) => sum + o.total, 0),
      delivered: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0),
    };

    // Stock levels
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    // Top categories
    const categoryRevenue: Record<string, number> = {};
    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        if (!categoryRevenue[item.category]) {
          categoryRevenue[item.category] = 0;
        }
        categoryRevenue[item.category] += item.price * item.quantity;
      });
    });

    // Recent orders
    const recentOrders = orders.slice(-10).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Daily revenue (last 30 days)
    const dailyRevenue: Record<string, number> = {};
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      if (date >= last30Days) {
        const dateKey = date.toISOString().split('T')[0];
        if (!dailyRevenue[dateKey]) {
          dailyRevenue[dateKey] = 0;
        }
        dailyRevenue[dateKey] += order.total;
      }
    });

    return NextResponse.json({
      summary: {
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        totalCustomers,
        totalProducts,
        avgOrderValue: avgOrderValue.toFixed(2),
      },
      orders: {
        byStatus: ordersByStatus,
        paymentStatus,
        revenueByStatus,
      },
      inventory: {
        lowStockCount: lowStockProducts,
        outOfStockCount: outOfStock,
        totalStockValue: totalStockValue.toFixed(2),
      },
      sales: {
        categoryRevenue,
        dailyRevenue,
        recentOrders: recentOrders.slice(0, 5),
      },
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error fetching analytics' },
      { status: 500 }
    );
  }
}
