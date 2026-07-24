import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, companyName, role } = await req.json();

    if (!name || !email || !password || !companyName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Note: In production, you would:
    // 1. Hash the password
    // 2. Save to database
    // 3. Send verification email
    // 4. Create admin request record

    // For now, return success response
    return NextResponse.json(
      {
        message: 'Admin access request submitted successfully',
        email,
        status: 'pending_approval',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
