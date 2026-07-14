import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    console.log('[Auth] Signup request received');

    // Connect to database
    console.log('[Auth] Connecting to database...');
    await connectDB();
    console.log('[Auth] Database connected successfully');

    const { name, email, password, confirmPassword } = await req.json();

    // Validation
    if (!name || !email || !password) {
      console.warn('[Auth] Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      console.warn('[Auth] Password mismatch');
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Check if user exists
    console.log('[Auth] Checking if email already registered:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn('[Auth] Email already registered:', email);
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    console.log('[Auth] Creating new user:', email);
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log('[Auth] ✅ User created successfully:', user._id);

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // Set cookie
    const response = NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      { status: 201 }
    );

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('[Auth] ❌ Signup error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
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
      { message: error.message || 'Error creating user' },
      { status: 500 }
    );
  }
}
