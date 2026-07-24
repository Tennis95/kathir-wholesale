import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function verifyAdminToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return { valid: false, user: null };
    }

    const token = authHeader.substring(7);
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");

    if (!decoded.isAdmin) {
      return { valid: false, user: null };
    }

    return { valid: true, user: decoded };
  } catch {
    return { valid: false, user: null };
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = verifyAdminToken(req);
    if (!auth.valid) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const dateRange = searchParams.get("dateRange") || "30days";

    // Calculate date range
    let startDate = new Date();
    if (dateRange === "7days") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (dateRange === "30days") {
      startDate.setDate(startDate.getDate() - 30);
    } else if (dateRange === "90days") {
      startDate.setDate(startDate.getDate() - 90);
    }

    // Key metrics
    const totalRevenue = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const totalOrders = await Order.countDocuments({});

    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalCustomers = await User.countDocuments({ role: "customer" });
    const activeCustomers = await User.countDocuments({
      role: "customer",
      isActive: true,
    });
    const inactiveCustomers = await User.countDocuments({
      role: "customer",
      isActive: false,
    });

    const totalProducts = await Product.countDocuments({});
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 20 } });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    // Revenue trend (last 30 days by day)
    const revenueTrend = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", 10] } },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 10 },
    ]);

    // Revenue by category
    const revenueByCategory = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          keyMetrics: {
            totalRevenue: totalRevenue[0]?.total || 0,
            totalOrders,
            totalCustomers,
            activeCustomers,
            inactiveCustomers,
            totalProducts,
            lowStockProducts,
            outOfStockProducts,
          },
          ordersByStatus: ordersByStatus.reduce((acc: any, item: any) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          revenueTrend,
          topProducts,
          revenueByCategory,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Admin Analytics]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error fetching analytics" },
      { status: 500 }
    );
  }
}
