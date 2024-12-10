import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const leaseId = params.id;

    // Update the lease
    const updatedLease = await prisma.tenancyAgreement.update({
      where: { id: leaseId },
      data: {
        monthlyRent: data.monthlyRent,
        depositAmount: data.depositAmount,
        depositProtectionRef: data.depositProtectionRef,
        noticePeriodDays: data.noticePeriodDays,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      }
    });

    return NextResponse.json(updatedLease);
  } catch (error) {
    console.error('Failed to update lease:', error);
    return NextResponse.json(
      { error: 'Failed to update lease' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.tenancyAgreement.delete({
      where: { id: params.id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete lease:', error);
    return NextResponse.json(
      { error: 'Failed to delete lease' },
      { status: 500 }
    );
  }
} 