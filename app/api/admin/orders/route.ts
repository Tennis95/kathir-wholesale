import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
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
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");

    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = toDate;
      }
    }

    if (minAmount || maxAmount) {
      query.total = {};
      if (minAmount) {
        query.total.$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        query.total.$lte = parseFloat(maxAmount);
      }
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Order.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: orders,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Admin Orders GET]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error fetching orders" },
      { status: 500 }
    );
  }
}
