import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { isValidEmail } from '@/utils/email'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const subscriber = await prisma.emailSubscriber.create({
      data: { email }
    })

    return NextResponse.json(
      { message: 'Subscription successful', subscriber },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
