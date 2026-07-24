import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/lib/models/AdminUser';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { token, password, confirmPassword } = await req.json();

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Hash the reset token to match what's stored in DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find admin user with valid reset token
    const adminUser = await AdminUser.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiry: { $gt: Date.now() },
    });

    if (!adminUser) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token. Please request a new password reset.' },
        { status: 400 }
      );
    }

    // Update password
    adminUser.password = password;
    adminUser.passwordResetToken = undefined;
    adminUser.passwordResetExpiry = undefined;
    await adminUser.save();

    console.log(`✅ Password reset successfully for ${adminUser.email}`);

    return NextResponse.json(
      {
        message: 'Password reset successfully. You can now login with your new password.',
        redirect: '/auth/admin/login',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Reset password error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
