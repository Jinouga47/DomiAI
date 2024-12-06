'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import Link from 'next/link';

interface MaintenanceTicket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  tenant: {
    firstName: string;
    lastName: string;
  };
  unit: {
    unitNumber: string | null;
    property: {
      addressLine1: string;
    };
  };
  responses?: {
    id: string;
    message: string;
    createdAt: string;
    isLandlord: boolean;
    author: {
      firstName: string;
      lastName: string;
    };
  }[];
}

export default function MaintenancePage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets/landlord');
        if (!response.ok) throw new Error('Failed to fetch tickets');
        const data = await response.json();
        setTickets(data.tickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status.toLowerCase() === filter;
  });

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <Link href="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>

        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">Maintenance Tickets</h1>
          </div>
        </header>

        <main className="main-content">
          <div className="content-wrapper">
            <div className="filter-section">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="auth-input"
              >
                <option value="all">All Tickets</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {loading ? (
              <div className="card-loading">
                <div className="card-spinner" />
              </div>
            ) : (
              <div className="tickets-grid">
                {filteredTickets.map(ticket => (
                  <Link 
                    key={ticket.id} 
                    href={`/maintenance/${ticket.id}`}
                    className="ticket-card"
                  >
                    <div className="ticket-header">
                      <h3 className="ticket-title">{ticket.title}</h3>
                      <div className="ticket-badges">
                        <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
                          {ticket.status}
                        </span>
                        <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>

                    <div className="ticket-location">
                      {ticket.unit.property.addressLine1}
                      {ticket.unit.unitNumber && ` - Unit ${ticket.unit.unitNumber}`}
                    </div>

                    <p className="ticket-description">{ticket.description}</p>

                    <div className="ticket-footer">
                      <span className="tenant-name">
                        From: {ticket.tenant.firstName} {ticket.tenant.lastName}
                      </span>
                      <span className="ticket-date">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {ticket.responses && ticket.responses.length > 0 && (
                      <div className="response-count">
                        {ticket.responses.length} response(s)
                      </div>
                    )}
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