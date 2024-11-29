'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  postCode: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  description: string;
  ownerId: string;
  allPropertyId: string;
}

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [property, setProperty] = useState<Property>({
    id: '',
    title: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    postCode: '',
    bedrooms: 0,
    bathrooms: 0,
    propertyType: '',
    description: '',
    ownerId: '',
    allPropertyId: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Property not found');
        }
        const data = await response.json();
        setProperty(data.property);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [resolvedParams.id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!property) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
      });

      if (!response.ok) {
        throw new Error('Failed to update property');
      }

      router.push(`/properties/${property.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update property');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="loading-container"><div className="loading-spinner" /></div>
      </DashboardLayout>
    );
  }

  if (error || !property) {
    return (
      <DashboardLayout>
        <div className="auth-error auth-error-failure">{error || 'Property not found'}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="welcome-card">
        <h1 className="card-title">Edit Property</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="stats-card">
            <h2 className="card-title">Property Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="auth-input"
                  value={property.title}
                  onChange={(e) => setProperty({ ...property, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address Line 1</label>
                <input
                  type="text"
                  className="auth-input"
                  value={property.addressLine1}
                  onChange={(e) => setProperty({ ...property, addressLine1: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address Line 2</label>
                <input
                  type="text"
                  className="auth-input"
                  value={property.addressLine2}
                  onChange={(e) => setProperty({ ...property, addressLine2: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  className="auth-input"
                  value={property.city}
                  onChange={(e) => setProperty({ ...property, city: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">County</label>
                <input
                  type="text"
                  className="auth-input"
                  value={property.county}
                  onChange={(e) => setProperty({ ...property, county: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Post Code</label>
                <input
                  type="text"
                  className="auth-input"
                  value={property.postCode}
                  onChange={(e) => setProperty({ ...property, postCode: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Bedrooms</label>
                  <input
                    type="number"
                    className="auth-input"
                    value={property.bedrooms}
                    onChange={(e) => setProperty({ ...property, bedrooms: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Bathrooms</label>
                  <input
                    type="number"
                    className="auth-input"
                    value={property.bathrooms}
                    onChange={(e) => setProperty({ ...property, bathrooms: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Property Type</label>
                <select
                  className="auth-input"
                  value={property.propertyType}
                  onChange={(e) => setProperty({ ...property, propertyType: e.target.value })}
                  required
                >
                  <option value="">Select property type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>
            </div>
          </div>

          <div className="activity-card">
            <h2 className="card-title">Description</h2>
            <textarea
              className="auth-input"
              value={property.description}
              onChange={(e) => setProperty({ ...property, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button 
              type="submit" 
              className="auth-button flex-1"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link 
              href={`/properties/${property.id}`}
              className="auth-switch flex-1 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
} 