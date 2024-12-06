'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import { useSession } from 'next-auth/react';

interface Property {
  id: string;
  landlordId: string;
  addressLine1: string;
  addressLine2?: string | null;
  cityTown: string;
  county?: string | null;
  postcode: string;
  purchaseDate?: Date | null;
  propertyType: 'DETACHED' | 'SEMI_DETACHED' | 'TERRACED' | 'FLAT';
  tenure: 'FREEHOLD' | 'LEASEHOLD';
  councilTaxBand: string;
  epcRating: string;
  units?: Unit[];
}

interface Unit {
  id: string;
  unitNumber?: string | null;
  squareMetres?: number | null;
  bedrooms: number;
  bathrooms: number;
  baseRentPcm: number;
  furnishedStatus: 'FURNISHED' | 'PART_FURNISHED' | 'UNFURNISHED';
  hmoLicense?: string | null;
  councilTaxReference?: string | null;
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
      setIsOwner(property.landlordId === session.user.id);
      console.log('Setting isOwner:', property.landlordId === session.user.id);
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
      <button 
        onClick={() => router.back()} 
        className="back-button"
      >
        ← Back
      </button>

      <div className="welcome-card">
        {/* <h1 className="card-title">{property.title}</h1> */}
        <h1 className="card-title">Property Details</h1>
        
        <div className="space-y-4">
          {/* Main Property Details */}
          <div className="stats-card">
            <h2 className="card-title">Property Overview</h2>
            <div className="property-details-grid">
              <div className="detail-group">
                <h3 className="detail-title">Location</h3>
                <div className="property-address">
                  <p>{property.addressLine1}</p>
                  {property.addressLine2 && <p>{property.addressLine2}</p>}
                  <p>{property.cityTown}</p>
                  {property.county && <p>{property.county}</p>}
                  <p>{property.postcode}</p>
                </div>
              </div>
              
              <div className="detail-group">
                <h3 className="detail-title">Property Type</h3>
                <p>{property.propertyType.replace('_', ' ')}</p>
                <p>Tenure: {property.tenure}</p>
              </div>

              <div className="detail-group">
                <h3 className="detail-title">Property Details</h3>
                <p>Council Tax Band: {property.councilTaxBand}</p>
                <p>EPC Rating: {property.epcRating}</p>
                {property.purchaseDate && (
                  <p>Purchase Date: {new Date(property.purchaseDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>

          {/* Units Information */}
          {property.units && property.units.length > 0 && (
            <div className="activity-card">
              <h2 className="card-title">Units</h2>
              <div className="units-grid">
                {property.units.map((unit, index) => (
                  <div key={unit.id} className="unit-card">
                    <h3 className="detail-title">
                      {unit.unitNumber ? `Unit ${unit.unitNumber}` : `Unit ${index + 1}`}
                    </h3>
                    <div className="unit-details">
                      <p>Bedrooms: {unit.bedrooms}</p>
                      <p>Bathrooms: {unit.bathrooms}</p>
                      {unit.squareMetres && <p>Size: {unit.squareMetres}m²</p>}
                      <p>Rent PCM: £{unit.baseRentPcm.toLocaleString()}</p>
                      <p>Status: {unit.furnishedStatus.replace('_', ' ')}</p>
                      {unit.hmoLicense && <p>HMO License: {unit.hmoLicense}</p>}
                      {unit.councilTaxReference && <p>Council Tax Ref: {unit.councilTaxReference}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <div className="button-group">
              <Link 
                href={`/properties/edit/${property.id}`}
                className="auth-button"
              >
                Edit Property
              </Link>
              <button 
                className="auth-switch"
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