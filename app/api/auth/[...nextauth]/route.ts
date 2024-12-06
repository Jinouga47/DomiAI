// Import the main NextAuth library
import NextAuth from "next-auth"
// Import the credentials provider for email/password authentication
import CredentialsProvider from "next-auth/providers/credentials"
// Import Prisma adapter to integrate NextAuth with your database
import { PrismaAdapter } from "@next-auth/prisma-adapter"
// Import PrismaClient to interact with your database
import { PrismaClient } from "@prisma/client"
// Import bcryptjs compare function to check passwords
import { compare } from "bcryptjs"
// Import the JWT callback types from `next-auth`
import type { JWT } from "next-auth/jwt"
// Import the Session type from `next-auth`
import type { Session } from "next-auth"
// Import the DefaultSession type from `next-auth`
import type { DefaultSession } from "next-auth"
import EmailProvider from "next-auth/providers/email"

// Initialize Prisma client
const prisma = new PrismaClient()

// Add after your imports
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"]
  }
}

// Main configuration object for NextAuth
export const authOptions = {
  // Set up Prisma as the adapter for storing sessions/users
  adapter: PrismaAdapter(prisma),
  
  // Array of authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials", // Display name for this provider
      credentials: {
        // Define the fields needed for login
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      
      // The authorize function is called when user tries to log in
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("Please verify your email address before logging in");
        }

        const isPasswordValid = await compare(credentials.password, user.passwordHash);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role
        };
      }
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  // Session configuration
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // Custom pages configuration
  pages: {
    signIn: "/", // Use root page as sign-in page
    error: "/auth/error", // Custom error page
  },

  // Callback functions
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      console.info(`User signed in - Email: ${user.email}, Provider: ${account?.provider}, Time: ${new Date().toISOString()}`);
      return true;
    },
    // Handles redirect after authentication
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // If URL starts with "/", add the base URL
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // If URL is on same origin, return as is
      else if (new URL(url).origin === baseUrl) return url
      // Default redirect to dashboard
      return baseUrl + "/dashboard"
    },
    async jwt({ token, user, account }: { 
      token: JWT; 
      user?: any; 
      account?: any; 
      trigger?: "signIn" | "signUp" | "update"; 
    }) {
      if (account?.remember === false) {
        token.maxAge = 8 * 60 * 60;
      }
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        // Add user ID and role to session
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",
}

// Export the configured NextAuth function
export const GET = NextAuth(authOptions)
export const POST = NextAuth(authOptions)