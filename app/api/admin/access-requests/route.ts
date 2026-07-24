import { connectDB } from '@/lib/mongodb';
import AdminAccessRequest from '@/lib/models/AdminAccessRequest';
import AdminUser from '@/lib/models/AdminUser';
import { sendAccessApprovedEmail, sendAccessRejectedEmail } from '@/lib/adminEmailService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';
    const sort = searchParams.get('sort') || '-createdAt';

    const filter = status === 'all' ? {} : { status };

    const requests = await AdminAccessRequest.find(filter)
      .sort(sort)
      .populate('approvedBy', 'name email');

    return NextResponse.json(
      { success: true, data: requests },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error fetching access requests:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { requestId, action, rejectionReason, approverEmail } = await req.json();

    if (!requestId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }

    await connectDB();

    const accessRequest = await AdminAccessRequest.findById(requestId);
    if (!accessRequest) {
      return NextResponse.json(
        { message: 'Access request not found' },
        { status: 404 }
      );
    }

    const approver = await AdminUser.findOne({ email: approverEmail });

    if (action === 'approve') {
      // Create new admin user
      const newAdmin = await AdminUser.create({
        name: accessRequest.name,
        email: accessRequest.email,
        companyName: accessRequest.companyName,
        role: accessRequest.requestedRole,
        isApproved: true,
        approvedBy: approver?._id,
        approvedAt: new Date(),
        password: Math.random().toString(36).slice(-10), // Temporary password - user should reset it
      });

      // Update request status
      accessRequest.status = 'approved';
      accessRequest.approvedBy = approver?._id;
      accessRequest.approvedAt = new Date();
      await accessRequest.save();

      // Send approval email
      const loginURL = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kathir-wholesale.vercel.app'}/auth/admin/login`;
      await sendAccessApprovedEmail(accessRequest.email, accessRequest.name, loginURL);

      console.log(`✅ Admin access approved for ${accessRequest.email}`);

      return NextResponse.json(
        { success: true, message: 'Access approved and user created', user: newAdmin },
        { status: 200 }
      );
    } else {
      // Reject request
      accessRequest.status = 'rejected';
      accessRequest.approvedBy = approver?._id;
      accessRequest.rejectionReason = rejectionReason || 'No reason provided';
      accessRequest.rejectedAt = new Date();
      await accessRequest.save();

      // Send rejection email
      await sendAccessRejectedEmail(
        accessRequest.email,
        accessRequest.name,
        rejectionReason || 'Your admin access request has been rejected.'
      );

      console.log(`❌ Admin access rejected for ${accessRequest.email}`);

      return NextResponse.json(
        { success: true, message: 'Access request rejected' },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('❌ Error processing access request:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
