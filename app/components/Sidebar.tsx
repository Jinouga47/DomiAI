'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <>
      <div className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="sidebar-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        
        <div className="sidebar-content">
          <Link 
            href="/dashboard" 
            className={`sidebar-link ${isActive('/dashboard') ? 'sidebar-link-active' : ''} ${isCollapsed ? 'sidebar-link-collapsed' : ''}`}
            title="Dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span className="sidebar-text">Dashboard</span>
          </Link>

          <Link 
            href="/properties" 
            className={`sidebar-link ${isActive('/properties') ? 'sidebar-link-active' : ''} ${isCollapsed ? 'sidebar-link-collapsed' : ''}`}
            title="Properties"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="sidebar-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="sidebar-text">Properties</span>
          </Link>
        </div>
      </div>
      <div className={`sidebar-overlay ${isCollapsed ? 'hidden' : ''}`} onClick={() => setIsCollapsed(true)} />
    </>
  );
} 