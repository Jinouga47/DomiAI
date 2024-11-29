import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log('1. Starting registration process');
    const body = await request.json();
    const { email, name, password } = body;
    console.log('2. Received registration data:', { email, name });

    if (!email || !name || !password) {
      console.log('3a. Missing required fields');
      return new NextResponse('Missing Fields', { status: 400 });
    }
    console.log('3b. All required fields present');

    const exist = await prisma.user.findUnique({
      where: { email }
    });

    if (exist) {
      console.log('4a. User already exists');
      return new NextResponse('User already exists', { status: 400 });
    }

    const hashedPassword = await hash(password, 12);
    console.log('4b. Password hashed successfully');

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    });
    console.log('5. User created successfully:', user.id);

    return NextResponse.json(user);
  } catch (error) {
    console.error('Registration error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 