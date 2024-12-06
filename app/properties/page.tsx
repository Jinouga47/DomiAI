'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/app/components/DashboardLayout';

interface Property {
  id: string;
  addressLine1: string;
  addressLine2?: string | null;
  cityTown: string;
  county?: string | null;
  postcode: string;
  propertyType: string;
  units: {
    id: string;
    unitNumber?: string | null;
    bedrooms: number;
    bathrooms: number;
    baseRentPcm: number;
  }[];
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetch('/api/properties', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      .then(res => res.json())
      .then(data => {
        setProperties(data.properties);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching properties:', error);
        setIsLoading(false);
      });
    }
  }, [status, session]);

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <Link 
          href="/dashboard" 
          className="back-button mx-4 mt-4 inline-block"
        >
          ← Back to Dashboard
        </Link>

        <header className="dashboard-header">
          <div className="header-content flex justify-between items-center">
            <h1 className="header-title">Your Properties</h1>
            <Link href="/properties/add" className="action-button">
              Add New Property
            </Link>
          </div>
        </header>

        <main className="main-content">
          <div className="content-wrapper">
            {isLoading ? (
              <div className="card-loading">
                <div className="card-spinner" />
              </div>
            ) : (
              <div className={`card-content ${!isLoading ? 'loaded' : ''}`}>
                <div className="card-grid">
                  {properties.length > 0 ? (
                    properties.map(property => (
                      <div key={property.id} className="stats-card">
                        <div className="property-card-content">
                          <h2 className="card-title">{property.addressLine1}</h2>
                          <div className="property-card-details">
                            <p>{property.cityTown}, {property.postcode}</p>
                            {property.county && <p>{property.county}</p>}
                            <p>Type: {property.propertyType}</p>
                            <p>Units: {property.units.length}</p>
                            {property.units.map(unit => (
                              <div key={unit.id} className="unit-details">
                                {unit.unitNumber && <p>Unit: {unit.unitNumber}</p>}
                                <p>Bedrooms: {unit.bedrooms}</p>
                                <p>Bathrooms: {unit.bathrooms}</p>
                                <p>Rent: £{unit.baseRentPcm}/month</p>
                              </div>
                            ))}
                          </div>
                          <div className="property-card-footer">
                            <Link 
                              href={`/properties/${property.id}`}
                              className="action-link"
                            >
                              View Details →
                            </Link>
                            <Link 
                              href={`/properties/edit/${property.id}`}
                              className="edit-button"
                            >
                              Edit Property
                            </Link>
                            <Link 
                              href={`/leases/property/${property.id}`}
                              className="lease-button"
                            >
                              Manage Leases
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="welcome-card">
                      <h2 className="card-title">No Properties Found</h2>
                      <p className="welcome-text">Get started by adding your first property</p>
                      <Link href="/properties/add" className="welcome-link">
                        Add Your First Property →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
} 