import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/auth/error?error=missing_token', request.url));
  }

  try {
    // Find user with verification token
    const user = await prisma.user.findFirst({
      where: { 
        verificationToken: token,
        emailVerified: false
      }
    });

    if (!user) {
      return NextResponse.redirect(new URL('/auth/error?error=invalid_token', request.url));
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        status: 'ACTIVE'
      }
    });

    return NextResponse.redirect(new URL('/auth/verified', request.url));
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(new URL('/auth/error?error=verification_failed', request.url));
  }
} 