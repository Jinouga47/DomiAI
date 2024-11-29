import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getPropertyWithDetails, deleteProperty } from '@/lib/db';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const property = await getPropertyWithDetails(id);
    
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ property });
  } catch (error) {
    console.error('Property fetch error:', error);
    return NextResponse.json(
      { message: 'Error fetching property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    await deleteProperty(id, session.user.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Property deletion error:', error);
    return NextResponse.json(
      { message: 'Error deleting property' },
      { status: 500 }
    );
  }
} 