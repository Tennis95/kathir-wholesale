import { connectDB } from '@/lib/mongodb';
import AdminAccessRequest from '@/lib/models/AdminAccessRequest';
import { sendAdminAccessRequestNotification } from '@/lib/adminEmailService';
import { NextRequest, NextResponse } from 'next/server';
import { sanitizeEmail, sanitizeInput } from '@/lib/sanitize';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, companyName, role } = await req.json();

    // Validation
    if (!name || !email || !password || !companyName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedName = sanitizeInput(name);
    const sanitizedCompanyName = sanitizeInput(companyName);

    // Connect to database
    await connectDB();

    // Check if request already exists
    const existingRequest = await AdminAccessRequest.findOne({ email: sanitizedEmail });
    if (existingRequest) {
      return NextResponse.json(
        { message: 'Access request already exists for this email' },
        { status: 400 }
      );
    }

    // Create admin access request
    const accessRequest = await AdminAccessRequest.create({
      name: sanitizedName,
      email: sanitizedEmail,
      companyName: sanitizedCompanyName,
      requestedRole: role || 'manager',
      status: 'pending',
    });

    // Send notification to admin team
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@kathir.co.uk';
    await sendAdminAccessRequestNotification(adminEmail, sanitizedName, sanitizedEmail);

    console.log(`✅ Admin access request created: ${sanitizedEmail}`);

    return NextResponse.json(
      {
        message: 'Admin access request submitted successfully. Please wait for admin approval.',
        email: sanitizedEmail,
        status: 'pending_approval',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Admin signup error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
