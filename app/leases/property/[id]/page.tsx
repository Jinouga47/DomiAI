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

  const assignTenantToLease = async (leaseId: string, tenantId: string | null) => {
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
      fetchPropertyLeases();
    } catch (error) {
      setError('Failed to assign tenant to lease');
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

                  {lease.tenant ? (
                    <div className="tenant-details">
                      <h4>Assigned Tenant</h4>
                      <p>{lease.tenant.firstName} {lease.tenant.lastName}</p>
                      <p>{lease.tenant.email}</p>
                      <button
                        onClick={() => assignTenantToLease(lease.id, null)}
                        className="remove-tenant-button"
                      >
                        Remove Tenant
                      </button>
                    </div>
                  ) : (
                    <div className="tenant-assignment">
                      <h4>Assign Tenant</h4>
                      <div className="relative">
                        <input
                          type="text"
                          className="auth-input"
                          placeholder="Search tenant by name or email"
                          value={tenantSearch}
                          onChange={(e) => {
                            setTenantSearch(e.target.value);
                            searchTenants(e.target.value);
                          }}
                        />
                        
                        {isSearching && (
                          <div className="absolute right-3 top-3">
                            <div className="card-spinner w-4 h-4" />
                          </div>
                        )}

                        {availableTenants.length > 0 && tenantSearch.length >= 2 && (
                          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                            {availableTenants.map(tenant => (
                              <div
                                key={tenant.id}
                                className="property-preview cursor-pointer"
                                onClick={() => {
                                  assignTenantToLease(lease.id, tenant.id);
                                  setTenantSearch('');
                                }}
                              >
                                <div className="property-details">
                                  <p className="font-medium">
                                    {tenant.firstName} {tenant.lastName}
                                  </p>
                                  <p className="text-sm text-gray-500">{tenant.email}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
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