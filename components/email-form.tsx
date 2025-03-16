"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Send, ArrowRight, Check } from "lucide-react"

export default function EmailForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName.trim()) {
      toast({
        title: "Invalid first name",
        description: "Please enter your first name",
        variant: "destructive",
      })
      return
    }

    if (!lastName.trim()) {
      toast({
        title: "Invalid last name",
        description: "Please enter your last name",
        variant: "destructive",
      })
      return
    }

    if (!email.trim() || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const emailData = { firstName, lastName, email }
    console.log('Email data:', emailData)

    try {
      // Send email to Telegram bot
      const telegramResponse = await fetch("/api/send-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })
      if (!telegramResponse.ok) {
        throw new Error('Failed to send message to Telegram')
      }

      // Send email to the user
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })
      if (!emailResponse.ok) {
        throw new Error('Failed to send email to user')
      }

      setFirstName("")
      setLastName("")
      setEmail("")
      setIsSubmitting(false)
      setIsSubmitted(true)
      toast({
        title: "Success!",
        description: "You've been added to the waitlist.",
      })
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-black/90 border-0 max-w-md mx-auto shadow-lg rounded-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              Join the Waitlist <Send className="h-4 w-4 animate-bounce" />
            </h2>
            <p className="text-sm text-gray-400">
              After watching our introduction, be the first to experience HanJaemi when we launch.
            </p>
          </div>

          {!isSubmitted ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                  <Input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-white/10 border-0 text-white placeholder:text-gray-500 rounded-lg px-4 h-8 focus:ring-2 focus:ring-white w-full"
                  />
                  </div>
                  <div className="relative flex-1">
                  <Input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-white/10 border-0 text-white placeholder:text-gray-500 rounded-lg px-4 h-8 focus:ring-2 focus:ring-white w-full"
                  />
                  </div>
                </div>
                <div className="relative">
                  <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-0 text-white placeholder:text-gray-500 rounded-lg px-4 h-8 focus:ring-2 focus:ring-white w-full"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-8 text-xs font-medium group overflow-hidden relative"
                  size="sm"
                  disabled={isSubmitting}
                >
                  <span className="flex items-center justify-center gap-1 group-hover:-translate-y-8 transition-transform duration-300">
                    Get Early Access
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center gap-1 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                    Send
                    <Send className="h-3 w-3" />
                  </span>
                </Button>
              </form>

              <p className="text-xs text-gray-500 text-center">
                By signing up, you agree to our{" "}
                <a href="#" className="underline hover:text-gray-400">
                  Terms & Conditions
                </a>
              </p>
            </>
          ) : (
            <div className="text-center space-y-3">
              <Check className="h-12 w-12 text-green-500 mx-auto animate-pulse" />
              <h2 className="text-xl font-semibold text-white">Thank You!</h2>
              <p className="text-sm text-gray-400">
                We've added you to our early access list. We'll notify you when we launch!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

