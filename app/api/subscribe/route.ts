import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { isValidEmail } from '@/utils/email'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

type SubscribeResponse = {
  success: boolean;
  message: string;
  subscriber?: Awaited<ReturnType<typeof prisma.emailSubscriber.create>>;
  error?: string;
};

export async function POST(request: Request): Promise<NextResponse<SubscribeResponse>> {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required',
        error: 'Email is required'
      }, { status: 400 })
    }
    
    if (!isValidEmail(email)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format',
        error: 'Invalid email format'
      }, { status: 400 })
    }

    const subscriber = await prisma.emailSubscriber.create({
      data: { email }
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription successful',
      subscriber
    }, { status: 201 })

  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({
          success: false,
          message: 'This email is already subscribed',
          error: 'Duplicate email'
        }, { status: 409 })
      }
    } else if (error instanceof SyntaxError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request format',
        error: 'Invalid JSON'
      }, { status: 400 })
    }
    
    console.error('Subscription error:', error);
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: 'Internal server error'
    }, { status: 500 })
  }
}
