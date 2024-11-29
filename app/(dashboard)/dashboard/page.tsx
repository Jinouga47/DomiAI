'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/app/components/DashboardLayout';

interface ActivityItem {
  id: string | number;
  name: string;
  email: string;
}

export default function Dashboard() {
  const [data, setData] = useState<ActivityItem[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetch('/api/data', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
    }
  }, [status, session]);

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
              <div className="welcome-card">
                <h2 className="card-title">Welcome Back</h2>
                <p>{session?.user?.name}</p>
                <Link href="/properties" className="auth-button mt-4">
                  View Properties
                </Link>
              </div>

              <div className="stats-card">
                <h2 className="card-title">Statistics</h2>
                <p>Your activity overview</p>
              </div>

              <div className="activity-card">
                <h2 className="card-title">Recent Activity</h2>
                {data.map((item) => (
                  
                  <div key={item.id} className="activity-item">
                    <p>{item.name}</p>
                    <p>{item.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
} 