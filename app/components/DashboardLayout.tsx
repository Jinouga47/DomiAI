'use client';
import { useState } from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`dashboard-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        {children}
      </div>
      <div 
        className={`dashboard-overlay ${!isCollapsed ? 'dashboard-overlay-visible' : ''}`}
        onClick={() => setIsCollapsed(true)}
      />
    </div>
  );
} 