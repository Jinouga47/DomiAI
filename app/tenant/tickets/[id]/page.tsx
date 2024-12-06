'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout';
import Link from 'next/link';

interface TicketResponse {
  id: string;
  message: string;
  createdAt: string;
  isLandlord: boolean;
  author: {
    firstName: string;
    lastName: string;
  };
}

interface MaintenanceTicket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  unit: {
    unitNumber: string | null;
    property: {
      addressLine1: string;
    };
  };
  ticketResponses: TicketResponse[];
}

export default function TenantTicketDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = use(params);
  const [ticket, setTicket] = useState<MaintenanceTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [newResponse, setNewResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${id}`);
        if (!response.ok) throw new Error('Failed to fetch ticket');
        const data = await response.json();
        setTicket(data.ticket);
      } catch (error) {
        console.error('Error fetching ticket:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResponse.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/tickets/${id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newResponse,
          status: ticket?.status // Keep the same status
        }),
      });

      if (!response.ok) throw new Error('Failed to submit response');

      const data = await response.json();
      setTicket(data.ticket);
      setNewResponse('');
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="loading-spinner" />
        </div>
      </DashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="error-message">Ticket not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <Link href="/tenant/tickets" className="back-button">
          ← Back to My Tickets
        </Link>

        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">Maintenance Ticket Details</h1>
          </div>
        </header>

        <main className="main-content">
          <div className="content-wrapper">
            <div className="ticket-detail-card">
              <div className="ticket-header">
                <h2 className="ticket-title">{ticket.title}</h2>
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

              <div className="ticket-meta">
                <span className="ticket-date">
                  Submitted on: {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="responses-section">
                <h3>Responses</h3>
                {ticket.ticketResponses && ticket.ticketResponses.length > 0 ? (
                  ticket.ticketResponses.map(response => (
                    <div 
                      key={response.id} 
                      className={`response-item ${response.isLandlord ? 'landlord-response' : 'tenant-response'}`}
                    >
                      <div className="response-header">
                        <span className="response-author">
                          {response.author.firstName} {response.author.lastName}
                        </span>
                        <span className="response-date">
                          {new Date(response.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="response-message">{response.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-responses">No responses yet</p>
                )}
              </div>

              <form onSubmit={handleSubmitResponse} className="response-form">
                <textarea
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  placeholder="Add a response..."
                  className="auth-input min-h-[100px]"
                  required
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="auth-button"
                >
                  {submitting ? 'Sending...' : 'Send Response'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
} 