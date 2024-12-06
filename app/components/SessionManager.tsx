'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function SessionManager() {
  useEffect(() => {
    // Generate unique tab ID
    const tabId = Math.random().toString(36).substring(7);
    
    // Register this tab
    const registerTab = () => {
      const tabs = JSON.parse(localStorage.getItem('activeTabs') || '[]');
      localStorage.setItem('activeTabs', JSON.stringify([...tabs, tabId]));
      sessionStorage.setItem('tabId', tabId);
    };

    // Remove this tab
    const unregisterTab = () => {
      const tabs = JSON.parse(localStorage.getItem('activeTabs') || '[]');
      const remainingTabs = tabs.filter((id: string) => id !== tabId);
      localStorage.setItem('activeTabs', JSON.stringify(remainingTabs));
      
      // If this was the last tab, log out
      if (remainingTabs.length === 0) {
        signOut();
      }
    };

    registerTab();

    // Handle tab/window close
    window.addEventListener('beforeunload', unregisterTab);
    
    return () => {
      window.removeEventListener('beforeunload', unregisterTab);
      unregisterTab();
    };
  }, []);

  return null;
} 