import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createDocument } from '@/lib/services/document-service';
import { DocumentCategory } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as DocumentCategory;
    const description = formData.get('description') as string;
    const propertyId = formData.get('propertyId') as string;
    const unitId = formData.get('unitId') as string;

    if (!file || !category) {
      return NextResponse.json(
        { error: 'File and category are required' },
        { status: 400 }
      );
    }

    const document = await createDocument({
      file,
      userId: session.user.id,
      category,
      description,
      propertyId,
      unitId
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
} 