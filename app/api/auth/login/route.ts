import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { sanitizeEmail, sanitizeInput } from '@/lib/sanitize';

export async function POST(req: NextRequest) {
  try {
    console.log('[Auth] Login request received');

    // Connect to database
    console.log('[Auth] Connecting to database...');
    await connectDB();
    console.log('[Auth] Database connected successfully');

    let { email, password } = await req.json();

    // Sanitize inputs
    email = sanitizeEmail(email);
    password = sanitizeInput(password);

    // Validation
    if (!email || !password) {
      console.warn('[Auth] Missing email or password');
      return NextResponse.json(
        { message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user and include password
    console.log('[Auth] Looking up user:', email);
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.warn('[Auth] User not found:', email);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      console.warn('[Auth] Invalid password for user:', email);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('[Auth] ✅ User authenticated successfully:', email);

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // Set cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('[Auth] ❌ Login error:', {
      message: error.message,
      code: error.code,
      name: error.name,
    });

    // Provide specific error messages
    if (error.message?.includes('querySrv')) {
      return NextResponse.json(
        { message: 'Database connection failed. Please check your internet connection or contact support.' },
        { status: 503 }
      );
    }

    if (error.message?.includes('ENOTFOUND')) {
      return NextResponse.json(
        { message: 'Cannot reach MongoDB. Check your network connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: error.message || 'Error logging in' },
      { status: 500 }
    );
  }
}
