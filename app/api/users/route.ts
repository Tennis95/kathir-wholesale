import { connectToDatabase } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { User } from '@/app/lib/models';

export async function POST(req: Request) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection<User>('users');
    const body = await req.json();

    // Validate required fields
    const requiredFields = ['email', 'shopName', 'contactPerson', 'phoneNumber'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { status: 'error', message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { status: 'error', message: 'User already exists' },
        { status: 409 }
      );
    }

    const user: User = {
      ...body,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(user);

    return NextResponse.json(
      {
        status: 'success',
        message: 'User created successfully',
        data: { ...user, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to create user',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection<User>('users');

    const users = await usersCollection.find({}).toArray();

    return NextResponse.json(
      {
        status: 'success',
        count: users.length,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch users',
      },
      { status: 500 }
    );
  }
}
