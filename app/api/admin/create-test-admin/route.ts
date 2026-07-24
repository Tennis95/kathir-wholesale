import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/lib/models/AdminUser';
import { NextRequest, NextResponse } from 'next/server';

// Test admin accounts to create
const TEST_ADMIN_ACCOUNTS = [
  {
    name: 'Admin User',
    email: 'admin@kathir.co.uk',
    password: 'AdminPassword123!',
    companyName: 'KATHIR LTD',
    role: 'super_admin',
  },
  {
    name: 'Order Manager',
    email: 'manager@kathir.co.uk',
    password: 'Manager123!',
    companyName: 'KATHIR LTD',
    role: 'manager',
  },
  {
    name: 'Finance Manager',
    email: 'finance@kathir.co.uk',
    password: 'Finance123!',
    companyName: 'KATHIR LTD',
    role: 'finance',
  },
];

export async function POST(req: NextRequest) {
  try {
    // Verify authorization token
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== process.env.ADMIN_SETUP_TOKEN) {
      return NextResponse.json(
        { message: 'Unauthorized. Invalid setup token.' },
        { status: 401 }
      );
    }

    await connectDB();

    const createdAdmins = [];
    const errors = [];

    for (const adminData of TEST_ADMIN_ACCOUNTS) {
      try {
        // Check if admin already exists
        const existingAdmin = await AdminUser.findOne({ email: adminData.email });
        if (existingAdmin) {
          errors.push(`${adminData.email}: Already exists`);
          continue;
        }

        // Create admin user
        const newAdmin = await AdminUser.create({
          ...adminData,
          isApproved: true,
          approvedAt: new Date(),
        });

        createdAdmins.push({
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          password: adminData.password, // Return password only during initial creation
        });

        console.log(`✅ Test admin created: ${adminData.email}`);
      } catch (error: any) {
        errors.push(`${adminData.email}: ${error.message}`);
        console.error(`❌ Error creating test admin ${adminData.email}:`, error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Test admin accounts setup complete',
        created: createdAdmins,
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error creating test admins:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check existing admin accounts
export async function GET(req: NextRequest) {
  try {
    // Verify authorization token
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== process.env.ADMIN_SETUP_TOKEN) {
      return NextResponse.json(
        { message: 'Unauthorized. Invalid setup token.' },
        { status: 401 }
      );
    }

    await connectDB();

    const admins = await AdminUser.find({}, 'name email role isApproved createdAt');

    return NextResponse.json(
      {
        success: true,
        total: admins.length,
        admins: admins,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error fetching admins:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
