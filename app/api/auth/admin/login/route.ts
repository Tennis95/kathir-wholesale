import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/lib/models/AdminUser';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { sanitizeEmail, sanitizeInput } from '@/lib/sanitize';

export async function POST(req: NextRequest) {
  try {
    console.log('[Admin Auth] Login request received');

    // Connect to database
    await connectDB();
    console.log('[Admin Auth] Database connected');

    let { email, password } = await req.json();

    // Sanitize inputs
    email = sanitizeEmail(email);
    password = sanitizeInput(password);

    // Validation
    if (!email || !password) {
      console.warn('[Admin Auth] Missing email or password');
      return NextResponse.json(
        { message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find admin user
    console.log('[Admin Auth] Looking up admin user:', email);
    const adminUser = await AdminUser.findOne({ email }).select('+password');

    if (!adminUser) {
      console.warn('[Admin Auth] Admin user not found:', email);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if approved
    if (!adminUser.isApproved) {
      console.warn('[Admin Auth] Admin user not approved:', email);
      return NextResponse.json(
        { message: 'Your admin access has not been approved yet. Please contact support.' },
        { status: 401 }
      );
    }

    // Check if active
    if (adminUser.status !== 'active') {
      console.warn('[Admin Auth] Admin user not active:', email);
      return NextResponse.json(
        { message: `Your admin account is ${adminUser.status}. Please contact support.` },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordCorrect = await adminUser.matchPassword(password);

    if (!isPasswordCorrect) {
      console.warn('[Admin Auth] Invalid password for admin user:', email);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('[Admin Auth] ✅ Admin authenticated successfully:', email);

    // Update last login
    adminUser.lastLogin = new Date();
    await adminUser.save();

    // Create JWT token
    const token = jwt.sign(
      {
        userId: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
        isAdmin: true
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // Set cookie
    const response = NextResponse.json(
      {
        message: 'Admin login successful',
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          isAdmin: true,
        },
        token,
      },
      { status: 200 }
    );

    response.cookies.set('adminAuthToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('[Admin Auth] ❌ Login error:', {
      message: error.message,
      code: error.code,
      name: error.name,
    });

    if (error.message?.includes('querySrv')) {
      return NextResponse.json(
        { message: 'Database connection failed. Please check your internet connection.' },
        { status: 503 }
      );
    }

    if (error.message?.includes('ENOTFOUND')) {
      return NextResponse.json(
        { message: 'Cannot reach database. Check your network connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: error.message || 'Error logging in' },
      { status: 500 }
    );
  }
}
