"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Send, Check } from "lucide-react"

export default function EmailForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const emailData = { email }
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
    <Card className="bg-black/90 border-0 max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              Join the Waitlist <Send className="h-4 w-4" />
            </h2>
            <p className="text-sm text-gray-400">
              After watching our introduction, be the first to experience HanJaemi when we launch.
            </p>
          </div>

          {!isSubmitted ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-0 text-white placeholder:text-gray-500"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-white text-black hover:bg-gray-100"
                >
                  Get Early Access
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
              <Check className="h-12 w-12 text-green-500 mx-auto" />
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

