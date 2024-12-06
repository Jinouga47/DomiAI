'use client';

import { useState } from 'react';
import { DocumentCategory } from '@prisma/client';

interface DocumentUploadProps {
  onUploadComplete?: (document: any) => void;
  propertyId?: string;
  unitId?: string;
  category?: DocumentCategory;
}

export default function DocumentUpload({
  onUploadComplete,
  propertyId,
  unitId,
  category: defaultCategory
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState<DocumentCategory>(
    defaultCategory || DocumentCategory.OTHER
  );
  const [description, setDescription] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('category', category);
      if (description) formData.append('description', description);
      if (propertyId) formData.append('propertyId', propertyId);
      if (unitId) formData.append('unitId', unitId);

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const document = await response.json();
      onUploadComplete?.(document);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Document Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as DocumentCategory)}
          className="auth-input"
          disabled={uploading}
        >
          {Object.values(DocumentCategory).map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="auth-input min-h-[100px]"
          disabled={uploading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Select Document
        </label>
        <input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          className="auth-input"
        />
      </div>

      {uploading && (
        <div className="text-center">
          <div className="card-spinner" />
          <p>Uploading document...</p>
        </div>
      )}
    </div>
  );
} 