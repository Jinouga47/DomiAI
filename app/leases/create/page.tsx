'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import Link from 'next/link';

interface Unit {
  id: string;
  unitNumber: string | null;
  baseRentPcm: number;
}

interface Property {
  id: string;
  addressLine1: string;
  units: Unit[];
}

interface VerifiedTenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const CreateLeasePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [property, setProperty] = useState<Property | null>(null);
  const [leaseData, setLeaseData] = useState({
    unitId: '',
    startDate: '',
    endDate: '',
    monthlyRent: 0,
    depositAmount: 0,
    includesUtilities: false,
    utilityDetails: '',
    specialTerms: '',
  });
  const [tenantSearch, setTenantSearch] = useState('');
  const [verifiedTenants, setVerifiedTenants] = useState<VerifiedTenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<VerifiedTenant | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (propertyId && session?.user) {
      fetchPropertyDetails();
    }
  }, [propertyId, session]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch property details');
      
      const data = await response.json();
      // console.log('Property data:', data); // Debug log
      
      // Check if property exists in response
      if (!data || !data.property) {
        throw new Error('Invalid property data received');
      }

      setProperty(data.property);
      
      // If there's only one unit, pre-select it
      if (data.property.units && data.property.units.length === 1) {
        setLeaseData(prev => ({
          ...prev,
          unitId: data.property.units[0].id,
          monthlyRent: data.property.units[0].baseRentPcm
        }));
      }
    } catch (error) {
      // console.error('Error fetching property:', error);
      setError('Failed to fetch property details');
    } finally {
      setLoading(false);
    }
  };

  const searchTenants = async (query: string) => {
    if (query.length < 2) {
      setVerifiedTenants([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/tenants/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search tenants');
      const data = await response.json();
      setVerifiedTenants(data.tenants);
    } catch (error) {
      console.error('Error searching tenants:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchTenants(tenantSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [tenantSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedTenant) {
      setError('Please select a valid tenant');
      return;
    }

    try {
      const response = await fetch('/api/leases/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...leaseData,
          tenantId: selectedTenant.id
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create lease');
      }

      router.push(`/leases/property/${propertyId}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create lease');
    }
  };

  const handleUnitChange = (unitId: string) => {
    const selectedUnit = property?.units.find(unit => unit.id === unitId);
    setLeaseData(prev => ({
      ...prev,
      unitId,
      monthlyRent: selectedUnit?.baseRentPcm || prev.monthlyRent
    }));
  };

  if (loading) {
    return <div className="loading-spinner" />;
  }

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <Link 
          href={`/leases/property/${propertyId}`}
          className="back-button"
        >
          ← Back to Leases
        </Link>

        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">Create New Lease</h1>
          </div>
        </header>

        <main className="main-content">
          <div className="content-wrapper">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="auth-error auth-error-failure">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Select Unit</label>
                <select
                  className="auth-input"
                  value={leaseData.unitId}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  required
                >
                  <option value="">Select a unit</option>
                  {property?.units?.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unitNumber || 'Main Unit'} - £{unit.baseRentPcm}/month
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    className="auth-input"
                    value={leaseData.startDate}
                    onChange={(e) => setLeaseData({ ...leaseData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    className="auth-input"
                    value={leaseData.endDate}
                    onChange={(e) => setLeaseData({ ...leaseData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Rent (£)</label>
                  <input
                    type="number"
                    className="auth-input"
                    value={leaseData.monthlyRent}
                    onChange={(e) => setLeaseData({ ...leaseData, monthlyRent: Number(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Deposit Amount (£)</label>
                  <input
                    type="number"
                    className="auth-input"
                    value={leaseData.depositAmount}
                    onChange={(e) => setLeaseData({ ...leaseData, depositAmount: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={leaseData.includesUtilities}
                    onChange={(e) => setLeaseData({ ...leaseData, includesUtilities: e.target.checked })}
                    className="form-checkbox"
                  />
                  <span className="text-sm font-medium">Includes Utilities</span>
                </label>
              </div>

              {leaseData.includesUtilities && (
                <div>
                  <label className="block text-sm font-medium mb-2">Utility Details</label>
                  <textarea
                    className="auth-input min-h-[100px]"
                    value={leaseData.utilityDetails}
                    onChange={(e) => setLeaseData({ ...leaseData, utilityDetails: e.target.value })}
                    placeholder="Specify which utilities are included and any relevant details"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Special Terms</label>
                <textarea
                  className="auth-input min-h-[100px]"
                  value={leaseData.specialTerms}
                  onChange={(e) => setLeaseData({ ...leaseData, specialTerms: e.target.value })}
                  placeholder="Any special terms or conditions for this lease"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tenant Search</label>
                <input
                  type="text"
                  className="auth-input"
                  value={tenantSearch}
                  onChange={(e) => setTenantSearch(e.target.value)}
                  placeholder="Search tenant by name or email"
                />
                
                {isSearching && (
                  <div className="card-loading">
                    <div className="card-spinner" />
                  </div>
                )}

                {verifiedTenants.length > 0 && (
                  <div className="stats-card mt-4">
                    {verifiedTenants.map(tenant => (
                      <div
                        key={tenant.id}
                        className={`property-preview cursor-pointer ${
                          selectedTenant?.id === tenant.id ? 'bg-opacity-50' : ''
                        }`}
                        onClick={() => setSelectedTenant(tenant)}
                      >
                        <div className="property-details">
                          <h3 className="property-title">
                            {tenant.firstName} {tenant.lastName}
                          </h3>
                          <p>{tenant.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTenant && (
                  <div className="activity-card mt-4">
                    <h4 className="card-title">Selected Tenant</h4>
                    <div className="property-details">
                      <p><strong>Name:</strong> {selectedTenant.firstName} {selectedTenant.lastName}</p>
                      <p><strong>Email:</strong> {selectedTenant.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTenant(null)}
                      className="remove-unit-button mt-4"
                    >
                      Remove Selection
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="auth-button flex-1"
                >
                  Create Lease
                </button>
                <Link
                  href={`/leases/property/${propertyId}`}
                  className="auth-switch flex-1 text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default CreateLeasePage; 