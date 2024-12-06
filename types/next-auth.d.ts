import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: string;
      accessToken?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
} 