import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
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

    const query: any = { role: "customer" };
    if (status === "active") {
      query.isActive = true;
    } else if (status === "inactive") {
      query.isActive = false;
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get order count for each user
    const usersWithOrders = await Promise.all(
      users.map(async (user: any) => {
        const orderCount = await Order.countDocuments({ userId: user._id });
        return {
          ...user,
          orderCount,
        };
      })
    );

    const total = await User.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: usersWithOrders,
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
    console.error("[Admin Users GET]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error fetching users" },
      { status: 500 }
    );
  }
}
