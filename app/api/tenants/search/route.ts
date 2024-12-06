import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ tenants: [] });
    }

    const tenants = await prisma.tenant.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { user: { email: { contains: query, mode: 'insensitive' } } }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        user: {
          select: {
            email: true
          }
        }
      },
      take: 5
    });

    return NextResponse.json({
      tenants: tenants.map(tenant => ({
        id: tenant.id,
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        email: tenant.user.email
      }))
    });
  } catch (error) {
    // console.error('Tenant search error:', error);
    return NextResponse.json(
      { error: 'Failed to search tenants' },
      { status: 500 }
    );
  }
} 