import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find unverified user
    const user = await prisma.user.findFirst({
      where: {
        email,
        emailVerified: false,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found or already verified' },
        { status: 404 }
      );
    }

    // Generate new verification token
    const verificationToken = randomBytes(32).toString('hex');

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    // Send new verification email
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({
      message: 'Verification email resent successfully',
    });
  } catch (error) {
    console.error('Failed to resend verification email:', error);
    return NextResponse.json(
      { message: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
} 