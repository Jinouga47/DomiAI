import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch data from your database
    const userData = await prisma.user.findMany({
      where: {
        email: session.user.email
      },
      orderBy: {
        id: 'desc'
      },
      take: 10
    });

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
} 