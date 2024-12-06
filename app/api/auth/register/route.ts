import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomBytes } from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON request body
    const body = await request.json();
    // Extract all relevant fields from the request body
    const { 
      email, 
      firstName, 
      lastName, 
      password, 
      role, // Can be either 'LANDLORD' or 'TENANT'
      landlordEmail, // Required only for tenant registration
      // Other fields like phone, utrNumber, dateOfBirth etc.
    } = body;

    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex');

    // For tenant registration, ensure landlordEmail is provided
    if (role === 'TENANT' && !landlordEmail) {
      return new NextResponse('Landlord email is required for tenant registration', { status: 400 });
    }

    // First create the base user record with common fields
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash: await hash(password, 12), // Hash password before storing
        role, // Set user role (LANDLORD/TENANT)
        status: 'PENDING_VERIFICATION', // Initial status for all users
        verificationToken,
        emailVerified: false
      }
    });

    if (role === 'LANDLORD') {
      // For landlord registration, create associated landlord profile
      await prisma.landlord.create({
        data: {
          userId: user.id, // Link to base user record
          firstName,
          lastName,
          utrNumber: body.utrNumber, // Unique Tax Reference number
          phone: body.phone // Optional phone number
        }
      });
    } else {
      // For tenant registration, first verify the landlord exists
      const landlordUser = await prisma.user.findFirst({
        where: {
          email: landlordEmail,
          role: 'LANDLORD'
        },
        include: {
          landlord: true // Include landlord profile to verify it exists
        }
      });

      // If landlord not found, delete the created user and return error
      if (!landlordUser?.landlord) {
        await prisma.user.delete({ where: { id: user.id } });
        return new NextResponse('Invalid landlord email', { status: 400 });
      }

      // Create tenant profile with all required fields
      await prisma.tenant.create({
        data: {
          userId: user.id, // Link to base user record
          firstName,
          lastName,
          phone: body.phone,
          dateOfBirth: new Date(body.dateOfBirth),
          nationalInsuranceNo: body.nationalInsuranceNo,
          employmentStatus: body.employmentStatus,
          annualIncome: body.annualIncome ? parseFloat(body.annualIncome) : null,
          rightToRentCheckDate: new Date(), // Current date as initial check
          referenceCheckStatus: 'PENDING' // Initial reference check status
        }
      });
    }

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Return the created user ID
    return NextResponse.json({ userId: user.id });
  } catch (error) {
    console.error('Registration error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
} 