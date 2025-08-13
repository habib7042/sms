import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Get the admin user from database
    const admin = await db.admin.findFirst({
      where: {
        username: 'admin'
      }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin.id,
        username: admin.username
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}