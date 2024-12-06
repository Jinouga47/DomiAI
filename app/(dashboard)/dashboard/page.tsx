'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/app/components/DashboardLayout';

// Define interfaces based on schema
interface Unit {
  id: string;
  unitNumber: string | null;
  bedrooms: number;
  bathrooms: number;
  baseRentPcm: number;
}

interface Property {
  id: string;
  addressLine1: string;
  cityTown: string;
  postcode: string;
  propertyType: string;
  units: Unit[];
}

interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  employmentStatus: string;
  propertyDetails?: {
    address: string;
    rentAmount: number;
    leaseStartDate: string;
    leaseEndDate: string;
  };
  landlordDetails?: {
    name: string;
    email: string;
    phone?: string;
  };
}

// Add to your interfaces
interface TenantStats {
  totalTenants: number;
  activeLeases: number;
  totalRent: number;
}

interface MaintenanceTicket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  tenant?: {
    firstName: string;
    lastName: string;
  };
  unit?: {
    unitNumber: string | null;
    property?: {
      addressLine1: string;
    };
  };
}

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Add loading states
  const [propertiesLoaded, setPropertiesLoaded] = useState(false);
  const [tenantsLoaded, setTenantsLoaded] = useState(false);

  // Add new state
  const [tenantStats, setTenantStats] = useState<TenantStats>({
    totalTenants: 0,
    activeLeases: 0,
    totalRent: 0
  });

  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);

  // Add new fetch function
  const fetchTenantStats = async () => {
    try {
      const response = await fetch('/api/tenants/stats');
      if (!response.ok) throw new Error('Failed to fetch tenant stats');
      const data = await response.json();
      setTenantStats(data);
    } catch (error) {
      // console.error('Error fetching tenant stats:', error);
    }
  };

  // Fetch properties when component mounts
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
        const firstThreeProperties = data.properties.slice(0, 3);
        setProperties(firstThreeProperties);
        setPropertiesLoaded(true);
      })
      .catch(error => {
        // console.error('Error fetching properties:', error);
        setPropertiesLoaded(true);
      });
    }
  }, [status, session]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetch('/api/tenant/details', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      .then(res => res.json())
      .then(data => {
        setTenants(data.tenants);
        setTenantsLoaded(true);
      })
      .catch(error => {
        // console.error('Error fetching tenants:', error);
        setTenantsLoaded(true);
      });
    }
  }, [status, session]);

  // Add to your useEffect
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchTenantStats();
      // ... other fetch calls
    }
  }, [status, session]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets/landlord');
        if (!response.ok) throw new Error('Failed to fetch tickets');
        const data = await response.json();
        setMaintenanceTickets(data.tickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setTicketsLoading(false);
      }
    };

    fetchTickets();

    // Set up real-time updates using WebSocket or Server-Sent Events
    const eventSource = new EventSource('/api/tickets/stream');
    eventSource.onmessage = (event) => {
      const ticket = JSON.parse(event.data);
      setMaintenanceTickets(prev => [ticket, ...prev]);
    };

    return () => eventSource.close();
  }, []);

  if (status === 'loading') {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">Dashboard</h1>
          </div>
        </header>

        <main className="main-content">
          <div className="content-wrapper">
            <div className="card-grid">
              {/* Welcome Card */}
              <div className="welcome-card">
                <h2 className="card-title">Recent Maintenance Requests</h2>
                {ticketsLoading ? (
                  <div className="card-content">
                    <div className="flex justify-center items-center min-h-[200px]">
                      <div className="card-spinner" />
                    </div>
                  </div>
                ) : (
                  maintenanceTickets && maintenanceTickets.length > 0 ? (
                    <>
                      <div className="maintenance-list-static">
                        {maintenanceTickets.slice(0, 3).map(ticket => (
                          <Link 
                            key={ticket.id} 
                            href={`/maintenance/${ticket.id}`}
                            className="maintenance-item"
                          >
                            <div className="maintenance-header">
                              <h4 className="ticket-title">{ticket.title}</h4>
                              {ticket.unit && ticket.unit.property && (
                                <span className="ticket-location">
                                  {ticket.unit.property.addressLine1}
                                  {ticket.unit.unitNumber && ` - Unit ${ticket.unit.unitNumber}`}
                                </span>
                              )}
                            </div>
                            <p className="ticket-description">{ticket.description}</p>
                            <div className="maintenance-details">
                              {ticket.status && (
                                <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
                                  {ticket.status}
                                </span>
                              )}
                              {ticket.priority && (
                                <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                                  {ticket.priority}
                                </span>
                              )}
                              {ticket.tenant && (
                                <span className="tenant-name">
                                  From: {ticket.tenant.firstName} {ticket.tenant.lastName}
                                </span>
                              )}
                              <span className="ticket-date">
                                {new Date(ticket.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link href="/maintenance" className="action-button mt-4">
                        View All Maintenance Tickets
                      </Link>
                    </>
                  ) : (
                    <div className="empty-state">
                      <p className="welcome-text">No maintenance requests at this time</p>
                      <Link href="/properties" className="welcome-link">
                        View All Properties
                      </Link>
                    </div>
                  )
                )}
              </div>

              {/* Properties Section */}
              <div className="stats-card">
                <div className="section-header">
                  <h2 className="card-title">Properties</h2>
                  {properties.length > 0 && (
                    <p className="section-description">
                      Your {properties.length === 3 ? 'most recent' : 'current'} properties
                    </p>
                  )}
                </div>

                {!propertiesLoaded ? (
                  <div className="card-loading">
                    <div className="card-spinner" />
                  </div>
                ) : (
                  <div className={`card-content ${propertiesLoaded ? 'loaded' : ''}`}>
                    {properties.length > 0 ? (
                      <div className="properties-list">
                        {properties.map(property => (
                          <Link 
                            key={property.id} 
                            href={`/properties/${property.id}`}
                            className="property-preview-link"
                          >
                            <div className="property-preview">
                              <h3 className="property-title">{property.addressLine1}</h3>
                              <div className="property-details">
                                <p>{property.cityTown}, {property.postcode}</p>
                                <p>Type: {property.propertyType}</p>
                                <p>Units: {property.units.length}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                        <div className="property-actions">
                          <Link href="/properties/add" className="action-button">
                            Add New Property
                          </Link>
                          <Link href="/properties" className="action-link">
                            View All Properties
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>No properties yet</p>
                        <Link href="/properties/add" className="add-first-link">
                          Add Your First Property →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tenants Card */}
              <div className="activity-card">
                <h2 className="card-title">Tenant Overview</h2>
                <div className="tenant-stats-grid">
                  <div className="tenant-stat-card">
                    <p className="tenant-stat-label">Total Tenants</p>
                    <p className="tenant-stat-value">{tenantStats.totalTenants}</p>
                  </div>
                  <div className="tenant-stat-card">
                    <p className="tenant-stat-label">Active Leases</p>
                    <p className="tenant-stat-value">{tenantStats.activeLeases}</p>
                  </div>
                  <div className="tenant-stat-card">
                    <p className="tenant-stat-label">Monthly Revenue</p>
                    <p className="tenant-stat-value">£{tenantStats.totalRent}</p>
                  </div>
                </div>
                <Link href="/tenants" className="action-button mt-4">
                  Manage Tenants
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
} 