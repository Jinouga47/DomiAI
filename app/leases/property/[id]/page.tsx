'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
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
  depositAmount: number;
  depositProtectionRef: string;
  noticePeriodDays: number;
}

interface TenantWithLease {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  leases: {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
    property: {
      id: string;
      address: string;
      unitNumber: string | null;
      rent: number;
    };
  }[];
}

export default function PropertyLeaseManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [availableTenants, setAvailableTenants] = useState<TenantWithLease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingLease, setEditingLease] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    monthlyRent: 0,
    depositAmount: 0,
    depositProtectionRef: '',
    noticePeriodDays: 30,
    startDate: '',
    endDate: '',
  });
  const [tenantSearch, setTenantSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { id } = use(params);

  useEffect(() => {
    if (session?.user?.id) {
      fetchPropertyLeases();
      fetchAvailableTenants();
    }
  }, [session, id]);

  const fetchPropertyLeases = async () => {
    try {
      const response = await fetch(`/api/leases/property/${id}`);
      const data = await response.json();
      setLeases(data.leases);
      setProperty(data.property);
    } catch (error) {
      // console.error('Error fetching property leases:', error);
      setError('Failed to fetch property leases');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTenants = async () => {
    try {
      const response = await fetch('/api/tenants/leased');
      if (!response.ok) throw new Error('Failed to fetch tenants');
      const data = await response.json();
      setAvailableTenants(data.tenants);
    } catch (error) {
      // console.error('Error fetching available tenants:', error);
    }
  };

  const deleteLease = async (leaseId: string) => {
    if (!confirm('Are you sure you want to delete this lease? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/leases/${leaseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete lease');

      // Refresh leases after deletion
      fetchPropertyLeases();
    } catch (error) {
      setError('Failed to delete lease');
    }
  };

  const handleEditLease = (lease: Lease) => {
    setEditingLease(lease.id);
    setEditForm({
      monthlyRent: lease.monthlyRent,
      depositAmount: lease.depositAmount,
      depositProtectionRef: lease.depositProtectionRef,
      noticePeriodDays: lease.noticePeriodDays,
      startDate: new Date(lease.startDate).toISOString().split('T')[0],
      endDate: new Date(lease.endDate).toISOString().split('T')[0],
    });
  };

  const handleUpdateLease = async (leaseId: string) => {
    try {
      const response = await fetch(`/api/leases/${leaseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error('Failed to update lease');

      // Refresh leases and reset editing state
      fetchPropertyLeases();
      setEditingLease(null);
    } catch (error) {
      // console.error('Failed to update lease:', error);
      setError('Failed to update lease');
    }
  };

  const searchTenants = async (query: string) => {
    if (query.length < 2) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/tenants/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search tenants');
      const data = await response.json();
      setAvailableTenants(data.tenants);
    } catch (error) {
      console.error('Error searching tenants:', error);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner" />;
  }

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <Link href="/properties" className="back-button">
          ← Back to Properties
        </Link>

        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">
              Lease Management: {property?.addressLine1}
            </h1>
            <Link 
              href={`/leases/create?propertyId=${id}`} 
              className="action-button"
            >
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
                    {lease.unit.unitNumber && <h3>Unit {lease.unit.unitNumber}</h3>}
                  </div>

                  <div className="lease-details">
                    <p>Start Date: {new Date(lease.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(lease.endDate).toLocaleDateString()}</p>
                    <p>Monthly Rent: £{lease.monthlyRent}</p>
                    <p>Status: {lease.status}</p>
                  </div>

                  <div className="tenant-details">
                    <h4>Tenant</h4>
                    {lease.tenant && (
                      <>
                        <p>{lease.tenant.firstName} {lease.tenant.lastName}</p>
                        <p>{lease.tenant.email}</p>
                      </>
                    )}
                    <button
                      onClick={() => deleteLease(lease.id)}
                      className="remove-tenant-button mt-4"
                    >
                      Delete Lease
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
} 