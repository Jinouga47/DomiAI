'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import Link from 'next/link';

interface TenantDetails {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth: string;
  employmentStatus: string;
  annualIncome?: number;
  propertyDetails?: {
    address: string;
    rentAmount: number;
    leaseStartDate: string;
    leaseEndDate: string;
    unitId: string;
  };
  landlordDetails?: {
    name: string;
    email: string;
    phone?: string;
  };
}

interface MaintenanceTicket {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
}

interface LandlordDetails {
  name: string;
  email: string;
  phone?: string;
  propertyAddress: string;
  unitNumber: string | null;
}

export default function TenantDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tenantDetails, setTenantDetails] = useState<TenantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [landlordDetails, setLandlordDetails] = useState<LandlordDetails | null>(null);
  const [landlordLoading, setLandlordLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }

    if (status === 'authenticated') {
      fetchTenantDetails();
      fetchLandlordDetails();
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchMaintenanceTickets();
    }
  }, [session]);

  const fetchTenantDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tenant/details', {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to fetch tenant details: ${response.status} ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error('Invalid JSON response');
      }

      console.log('Parsed tenant details:', data);
      setTenantDetails(data);
    } catch (error) {
      console.error('Error in fetchTenantDetails:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenanceTickets = async () => {
    try {
      const response = await fetch('/api/tickets/tenant');
      if (!response.ok) throw new Error('Failed to fetch tickets');
      const data = await response.json();
      setMaintenanceTickets(data.tickets);
    } catch (error) {
      console.error('Error fetching maintenance tickets:', error);
    } finally {
      setTicketsLoading(false);
    }
  };

  const fetchLandlordDetails = async () => {
    try {
      const response = await fetch('/api/tenant/landlord');
      if (!response.ok) throw new Error('Failed to fetch landlord details');
      const data = await response.json();
      setLandlordDetails(data.landlordDetails);
    } catch (error) {
      console.error('Error fetching landlord details:', error);
    } finally {
      setLandlordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`dashboard-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">
              Welcome, {tenantDetails?.firstName} {tenantDetails?.lastName}
            </h1>
          </div>
        </div>

        <div className="main-content">
          <div className="content-wrapper">
            <div className="card-grid">
              <div className="welcome-card">
                <h2 className="card-title">Personal Information</h2>
                <div className={`card-content ${!loading ? 'loaded' : ''}`}>
                  <p><strong>Email:</strong> {session?.user?.email}</p>
                  <p><strong>Phone:</strong> {tenantDetails?.phone || 'Not provided'}</p>
                  <p><strong>Employment:</strong> {tenantDetails?.employmentStatus || 'Not provided'}</p>
                </div>
              </div>

              <div className="stats-card">
                <h2 className="card-title">Property Details</h2>
                <div className={`card-content ${!loading ? 'loaded' : ''}`}>
                  {tenantDetails?.propertyDetails ? (
                    <>
                      <p><strong>Address:</strong> {tenantDetails.propertyDetails.address}</p>
                      <p><strong>Monthly Rent:</strong> £{tenantDetails.propertyDetails.rentAmount}</p>
                      <p><strong>Lease Period:</strong></p>
                      <p>Start: {new Date(tenantDetails.propertyDetails.leaseStartDate).toLocaleDateString()}</p>
                      <p>End: {new Date(tenantDetails.propertyDetails.leaseEndDate).toLocaleDateString()}</p>
                    </>
                  ) : (
                    <p>No property details available</p>
                  )}
                </div>
              </div>

              <div className="activity-card">
                <h2 className="card-title">Maintenance</h2>
                <div className={`card-content ${!ticketsLoading ? 'loaded' : ''}`}>
                  {ticketsLoading ? (
                    <div className="card-loading">
                      <div className="card-spinner"></div>
                    </div>
                  ) : (
                    <div className="maintenance-wrapper">
                      {maintenanceTickets && maintenanceTickets.length > 0 ? (
                        <>
                          <div className="maintenance-list">
                            {maintenanceTickets.map((ticket) => (
                              <Link 
                                key={ticket.id} 
                                href={`/tenant/tickets/${ticket.id}`}
                                className="maintenance-item"
                              >
                                <div className="maintenance-header">
                                  <h4 className="ticket-title">{ticket.title}</h4>
                                </div>
                                <div className="maintenance-details">
                                  <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
                                    {ticket.status}
                                  </span>
                                  <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                                    {ticket.priority}
                                  </span>
                                  <span className="ticket-date">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="flex gap-4 mt-4">
                            <Link href="/tenant/tickets" className="action-button flex-1">
                              View All Tickets
                            </Link>
                            <Link href="/tickets/new" className="action-button flex-1">
                              Submit Maintenance Ticket
                            </Link>
                          </div>
                        </>
                      ) : (
                        <p className="no-tickets">No maintenance tickets found</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="activity-card">
                <h2 className="card-title">Landlord Details</h2>
                <div className={`card-content ${!landlordLoading ? 'loaded' : ''}`}>
                  {landlordLoading ? (
                    <div className="card-loading">
                      <div className="card-spinner" />
                    </div>
                  ) : landlordDetails ? (
                    <>
                      <p><strong>Name:</strong> {landlordDetails.name}</p>
                      <p><strong>Email:</strong> {landlordDetails.email}</p>
                      {landlordDetails.phone && (
                        <p><strong>Phone:</strong> {landlordDetails.phone}</p>
                      )}
                      <p><strong>Property:</strong> {landlordDetails.propertyAddress}</p>
                      {landlordDetails.unitNumber && (
                        <p><strong>Unit:</strong> {landlordDetails.unitNumber}</p>
                      )}
                    </>
                  ) : (
                    <p>No landlord details available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 