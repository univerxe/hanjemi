import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Store the email in your database
    // 2. Add the user to your email marketing platform
    // 3. Maybe send a confirmation email

    console.log("Early access signup:", email)

    return NextResponse.json({ success: true, message: "Email registered for early access" }, { status: 200 })
  } catch (error) {
    console.error("Early access API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

