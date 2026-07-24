import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/lib/models/AdminUser';
import { sendPasswordResetEmail } from '@/lib/adminEmailService';
import { NextRequest, NextResponse } from 'next/server';
import { sanitizeEmail } from '@/lib/sanitize';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email);

    // Connect to database
    await connectDB();

    // Find admin user
    const adminUser = await AdminUser.findOne({ email: sanitizedEmail });

    if (!adminUser) {
      // Don't reveal if email exists for security reasons
      return NextResponse.json(
        { message: 'If an admin account with this email exists, a password reset link will be sent.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = adminUser.generatePasswordResetToken();
    await adminUser.save();

    // Send reset email
    await sendPasswordResetEmail(sanitizedEmail, resetToken);

    console.log(`✅ Password reset email sent to ${sanitizedEmail}`);

    return NextResponse.json(
      {
        message: 'Password reset link sent to your email address. Please check your inbox.',
        email: sanitizedEmail,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Forgot password error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
