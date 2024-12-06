import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ exists: false }, { status: 400 });
  }

  try {
    // Find user with LANDLORD role
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        role: 'LANDLORD',
        landlord: {
          isNot: null
        }
      }
    });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error('Error verifying landlord:', error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
} 