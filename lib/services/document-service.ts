import { Document, DocumentCategory } from '@prisma/client';
import { uploadToS3, deleteFromS3 } from '@/lib/s3';
import prisma from '@/lib/prisma';

export async function createDocument({
  file,
  userId,
  category,
  description,
  propertyId,
  unitId,
}: {
  file: File;
  userId: string;
  category: DocumentCategory;
  description?: string;
  propertyId?: string;
  unitId?: string;
}): Promise<Document> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `documents/${userId}/${Date.now()}-${file.name}`;
  
  const url = await uploadToS3(buffer, key);
  
  return prisma.document.create({
    data: {
      url,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      userId,
      category,
      description,
      propertyId,
      unitId
    }
  });
}

export async function archiveDocument(id: string): Promise<Document> {
  return prisma.document.update({
    where: { id },
    data: { isArchived: true }
  });
}

export async function deleteDocument(id: string): Promise<void> {
  const document = await prisma.document.delete({
    where: { id }
  });
  
  // Extract key from URL
  const key = document.url.split('.com/')[1];
  await deleteFromS3(key);
} 