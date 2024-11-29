'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import { useSession } from 'next-auth/react';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  description: string;
  ownerId: string;
  owner: {
    name: string | null;
    email: string;
  };
}

export default function PropertyDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        console.log('Fetching property with ID:', resolvedParams.id);
        const response = await fetch(`/api/properties/${resolvedParams.id}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error('Property not found');
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        setProperty(data.property);
      } catch (err) {
        console.error('Error details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load property');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (property && session?.user?.id) {
      setIsOwner(property.ownerId === session.user.id);
      console.log('Setting isOwner:', property.ownerId === session.user.id);
    }
  }, [property, session]);

  const handleDelete = async () => {
    if (!property || !session?.user) {
      setError('You must be logged in to delete a property');
      return;
    }

    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await res.json();
      
      if (res.ok) {
        router.push('/properties');
        router.refresh();
      } else {
        throw new Error(data.error || 'Failed to delete property');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete property');
    } finally {
      setIsDeleting(false);
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
        <h1 className="card-title">{property.title}</h1>
        
        <div className="space-y-4">
          <div className="stats-card">
            <h2 className="card-title">Details</h2>
            <p>Location: {property.location}</p>
            {/* <p>Price: ${property.price.toLocaleString()}</p> */}
            <p>{property.bedrooms} bedrooms • {property.bathrooms} bathrooms</p>
            <p>Type: {property.propertyType}</p>
          </div>

          <div className="activity-card">
            <h2 className="card-title">Description</h2>
            <p>{property.description}</p>
          </div>

          {isOwner && (
            <div className="flex gap-4 mt-4">
              <Link 
                href={`/properties/edit/${property.id}`}
                className="auth-button flex-1 text-center"
              >
                Edit Property
              </Link>
              <button 
                className="auth-switch flex-1"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Property'}
              </button>
            </div>
          )}

          {error && (
            <div className="auth-error auth-error-failure mt-4">
              {error}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}