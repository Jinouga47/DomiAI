'use client';

import { SessionProvider } from 'next-auth/react';
import SessionManager from './components/SessionManager';

export default function Providers({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <SessionProvider>
      <SessionManager />
      {children}
    </SessionProvider>
  );
} 