"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2 } from "lucide-react"

export function EarlyAccessForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      // In a real application, you would send this to your API
      // await fetch('/api/early-access', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
      setEmail("")
    } catch { // Removed unused variable '_'
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <CheckCircle2 className="text-green-500 mb-2" size={48} />
        <h3 className="text-xl font-medium mb-2">Thank You!</h3>
        <p className="text-slate-600">We&apos;ve added you to our early access list. We&apos;ll notify you when we launch!</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            disabled={isSubmitting}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>

        <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Get Early Access"}
        </Button>

        <p className="text-xs text-slate-500 text-center">
          We respect your privacy and will never share your information.
        </p>

      </div>
    </form>
  )
}

