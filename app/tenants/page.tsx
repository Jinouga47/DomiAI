'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import Link from 'next/link';

interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  propertyAddress: string | null;
  rentAmount: number | null;
}

export default function TenantsPage() {
  const { data: session } = useSession();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch('/api/tenants');
        if (!response.ok) throw new Error('Failed to fetch tenants');
        const data = await response.json();
        setTenants(data.tenants);
      } catch (error) {
        console.error('Error fetching tenants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <Link href="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>

        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">Tenants</h1>
          </div>
        </header>

        <main className="main-content">
          <div className="content-wrapper">
            {loading ? (
              <div className="card-loading">
                <div className="card-spinner" />
              </div>
            ) : (
              <div className="tenant-grid">
                {tenants.map(tenant => (
                  <Link 
                    key={tenant.id} 
                    href={`/tenants/${tenant.id}`}
                    className="tenant-card"
                  >
                    <div className="tenant-header">
                      <h3 className="tenant-name">
                        {tenant.firstName} {tenant.lastName}
                      </h3>
                      <span className={`status-badge status-${tenant.status.toLowerCase()}`}>
                        {tenant.status}
                      </span>
                    </div>

                    <div className="tenant-details">
                      <p className="tenant-email">{tenant.email}</p>
                      {tenant.propertyAddress && (
                        <p className="tenant-property">
                          Property: {tenant.propertyAddress}
                        </p>
                      )}
                      {tenant.rentAmount && (
                        <p className="tenant-rent">
                          Rent: £{tenant.rentAmount}/month
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
} 