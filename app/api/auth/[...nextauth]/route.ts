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

// Initialize Prisma client
const prisma = new PrismaClient()

// Add after your imports
declare module "next-auth" {
  interface Session {
    user: {
      id: string
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
        // Check if email and password were provided
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          throw new Error("Missing credentials");
        }

        // Look up user in database by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        console.log('User lookup completed');

        // If no user found or user has no password, throw error
        if (!user || !user.password) {
          console.log('No user found or invalid password');
          throw new Error("No user found");
        }

        // Compare provided password with hashed password in database
        const isPasswordValid = await compare(credentials.password, user.password);
        console.log('Password validation completed');

        // If password doesn't match, throw error
        if (!isPasswordValid) {
          console.log('Invalid password');
          throw new Error("Invalid password");
        }

        // If everything is valid, log the successful login
        console.info(`Login successful - Email: ${user.email}, Time: ${new Date().toISOString()}`);

        // Return user object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    }),
  ],

  // Session configuration
  session: {
    strategy: "jwt" as const, // Use JSON Web Tokens for session handling
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
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
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