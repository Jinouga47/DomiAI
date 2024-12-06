'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import Link from 'next/link';

interface Property {
  id: string;
  addressLine1: string;
  units: Unit[];
}

interface Unit {
  id: string;
  unitNumber?: string | null;
  property: Property;
}

interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

interface Lease {
  id: string;
  unitId: string;
  tenantId: string | null;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: string;
  tenant?: Tenant;
  unit: Unit;
}

export default function LeaseManagementPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [verifiedTenants, setVerifiedTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user?.id) {
      fetchProperties();
      fetchLeases();
      fetchVerifiedTenants();
    }
  }, [session]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      const data = await response.json();
      setProperties(data.properties);
    } catch (error) {
      setError('Failed to fetch properties');
    }
  };

  const fetchLeases = async () => {
    try {
      const response = await fetch('/api/leases');
      const data = await response.json();
      setLeases(data.leases);
    } catch (error) {
      setError('Failed to fetch leases');
    }
  };

  const fetchVerifiedTenants = async () => {
    try {
      const response = await fetch('/api/tenants/verified');
      const data = await response.json();
      setVerifiedTenants(data.tenants);
    } finally {
      setLoading(false);
    }
  };

  const assignTenantToLease = async (leaseId: string, tenantId: string) => {
    try {
      const response = await fetch(`/api/leases/${leaseId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tenantId }),
      });

      if (!response.ok) throw new Error('Failed to assign tenant');

      // Refresh leases after assignment
      fetchLeases();
    } catch (error) {
      setError('Failed to assign tenant to lease');
    }
  };

  if (loading) {
    return <div className="loading-spinner" />;
  }

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">Lease Management</h1>
            <Link href="/leases/create" className="action-button">
              Create New Lease
            </Link>
          </div>
        </header>

        <main className="main-content">
          <div className="content-wrapper">
            {error && <div className="error-message">{error}</div>}
            
            <div className="lease-grid">
              {leases.map(lease => (
                <div key={lease.id} className="lease-card">
                  <div className="lease-header">
                    <h3>{lease.unit.property.addressLine1}</h3>
                    {lease.unit.unitNumber && <span>Unit {lease.unit.unitNumber}</span>}
                  </div>

                  <div className="lease-details">
                    <p>Start Date: {new Date(lease.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(lease.endDate).toLocaleDateString()}</p>
                    <p>Monthly Rent: £{lease.monthlyRent}</p>
                    <p>Status: {lease.status}</p>
                  </div>

                  {lease.tenant ? (
                    <div className="tenant-details">
                      <h4>Assigned Tenant</h4>
                      <p>{lease.tenant.firstName} {lease.tenant.lastName}</p>
                      <p>{lease.tenant.email}</p>
                    </div>
                  ) : (
                    <div className="tenant-assignment">
                      <h4>Assign Tenant</h4>
                      <select
                        className="auth-input"
                        onChange={(e) => assignTenantToLease(lease.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Select a tenant</option>
                        {verifiedTenants.map(tenant => (
                          <option key={tenant.id} value={tenant.id}>
                            {tenant.firstName} {tenant.lastName} ({tenant.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
} 