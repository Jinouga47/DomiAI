'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout';
import Link from 'next/link';

interface Property {
  id: string;
  addressLine1: string;
  unitNumber?: string;
}

export default function NewTicketPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenantUnit, setTenantUnit] = useState<{
    id: string;
    propertyAddress: string;
    unitNumber?: string | null;
  } | null>(null);

  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
    priority: 'ROUTINE',
    isEmergency: false,
    propertyId: '',
    accessInstructions: '',
    preferredContact: 'EMAIL',
    availableDates: [] as string[],
  });

  useEffect(() => {
    const fetchTenantUnit = async () => {
      try {
        const response = await fetch('/api/tenant/unit');
        if (!response.ok) throw new Error('Failed to fetch unit');
        const data = await response.json();
        setTenantUnit(data.unit);
      } catch (error) {
        setError('Failed to fetch your unit details');
      }
    };

    fetchTenantUnit();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!tenantUnit) {
      setError('No unit associated with your account');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...ticketData,
          unitId: tenantUnit.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit ticket');
      }

      router.push('/tenant-dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <Link href="/tenant-dashboard" className="back-button">
          ← Back to Dashboard
        </Link>

        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">Submit Maintenance Ticket</h1>
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
                <label className="block text-sm font-medium mb-2">Issue Title</label>
                <input
                  type="text"
                  required
                  className="auth-input"
                  value={ticketData.title}
                  onChange={(e) => setTicketData({ ...ticketData, title: e.target.value })}
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Detailed Description</label>
                <textarea
                  required
                  className="auth-input min-h-[150px]"
                  value={ticketData.description}
                  onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                  placeholder="Please provide as much detail as possible about the issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority Level</label>
                <select
                  className="auth-input"
                  value={ticketData.priority}
                  onChange={(e) => setTicketData({ ...ticketData, priority: e.target.value })}
                >
                  <option value="ROUTINE">Routine</option>
                  <option value="URGENT">Urgent</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={ticketData.isEmergency}
                  onChange={(e) => setTicketData({ ...ticketData, isEmergency: e.target.checked })}
                  className="form-checkbox"
                />
                <label htmlFor="emergency" className="text-sm">
                  This is an emergency requiring immediate attention
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Access Instructions</label>
                <textarea
                  className="auth-input"
                  value={ticketData.accessInstructions}
                  onChange={(e) => setTicketData({ ...ticketData, accessInstructions: e.target.value })}
                  placeholder="Any specific instructions for accessing the property"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Contact Method</label>
                <select
                  className="auth-input"
                  value={ticketData.preferredContact}
                  onChange={(e) => setTicketData({ ...ticketData, preferredContact: e.target.value })}
                >
                  <option value="EMAIL">Email</option>
                  <option value="PHONE">Phone</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Available Dates for Inspection</label>
                <input
                  type="date"
                  className="auth-input mb-2"
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    if (e.target.value && !ticketData.availableDates.includes(e.target.value)) {
                      setTicketData({
                        ...ticketData,
                        availableDates: [...ticketData.availableDates, e.target.value]
                      });
                    }
                  }}
                />
                {ticketData.availableDates.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ticketData.availableDates.map(date => (
                      <span
                        key={date}
                        className="bg-gray-100 px-2 py-1 rounded-md text-sm flex items-center gap-2"
                      >
                        {new Date(date).toLocaleDateString()}
                        <button
                          type="button"
                          onClick={() => setTicketData({
                            ...ticketData,
                            availableDates: ticketData.availableDates.filter(d => d !== date)
                          })}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="auth-button flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
                <Link href="/tenant-dashboard" className="auth-switch flex-1 text-center">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
} 