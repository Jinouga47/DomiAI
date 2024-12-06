'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, use } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import Link from 'next/link';

interface TenantDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string;
  employmentStatus: string;
  annualIncome: number | null;
  rightToRentCheckDate: string;
  rightToRentExpiry: string | null;
  referenceCheckStatus: string;
  lease: {
    startDate: string;
    endDate: string;
    monthlyRent: number;
    status: string;
    property: {
      addressLine1: string;
      unitNumber: string | null;
    };
  } | null;
}

export default function TenantDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { data: session } = useSession();
  const { id } = use(params);
  const [tenant, setTenant] = useState<TenantDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await fetch(`/api/tenants/${id}`);
        if (!response.ok) throw new Error('Failed to fetch tenant details');
        const data = await response.json();
        setTenant(data.tenant);
      } catch (error) {
        console.error('Error fetching tenant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="loading-spinner" />
        </div>
      </DashboardLayout>
    );
  }

  if (!tenant) {
    return (
      <DashboardLayout>
        <div className="error-message">Tenant not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <Link href="/tenants" className="back-button">
          ← Back to Tenants
        </Link>

        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">Tenant Details</h1>
          </div>
        </header>

        <main className="main-content">
          <div className="content-wrapper">
            <div className="tenant-detail-card">
              <div className="tenant-header">
                <h2 className="tenant-name">
                  {tenant.firstName} {tenant.lastName}
                </h2>
              </div>

              <div className="detail-section">
                <h3>Personal Information</h3>
                <div className="detail-grid">
                  <p><strong>Email:</strong> {tenant.email}</p>
                  <p><strong>Phone:</strong> {tenant.phone || 'Not provided'}</p>
                  <p><strong>Date of Birth:</strong> {new Date(tenant.dateOfBirth).toLocaleDateString()}</p>
                  <p><strong>Employment Status:</strong> {tenant.employmentStatus}</p>
                  {tenant.annualIncome && (
                    <p><strong>Annual Income:</strong> £{tenant.annualIncome.toLocaleString()}</p>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h3>Verification Status</h3>
                <div className="detail-grid">
                  <p><strong>Right to Rent Check:</strong> {new Date(tenant.rightToRentCheckDate).toLocaleDateString()}</p>
                  {tenant.rightToRentExpiry && (
                    <p><strong>Right to Rent Expiry:</strong> {new Date(tenant.rightToRentExpiry).toLocaleDateString()}</p>
                  )}
                  <p><strong>Reference Check Status:</strong> {tenant.referenceCheckStatus}</p>
                </div>
              </div>

              {tenant.lease && (
                <div className="detail-section">
                  <h3>Lease Information</h3>
                  <div className="detail-grid">
                    <p><strong>Property:</strong> {tenant.lease.property.addressLine1}</p>
                    {tenant.lease.property.unitNumber && (
                      <p><strong>Unit:</strong> {tenant.lease.property.unitNumber}</p>
                    )}
                    <p><strong>Monthly Rent:</strong> £{tenant.lease.monthlyRent}</p>
                    <p><strong>Lease Start:</strong> {new Date(tenant.lease.startDate).toLocaleDateString()}</p>
                    <p><strong>Lease End:</strong> {new Date(tenant.lease.endDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {tenant.lease.status}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
} 