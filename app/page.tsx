"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Mail, Send, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import VideoPlayer from "@/components/video-player"
import Image from "next/image"
import { motion, AnimatePresence } from "@/components/motion"

export default function Home() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues with theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    console.log("Email submitted:", email)
    setSubmitted(true)
    // Note: We no longer reset the form after submission
    // The thank you message will persist until page refresh
  }

  // Determine accent color based on theme
  const accentColor =
    theme === "dark"
      ? "rgba(59, 130, 246, 0.6)" // Brighter blue for dark mode
      : "rgba(99, 102, 241, 0.4)" // Brighter indigo for light mode

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <header className="w-full p-4 flex justify-between items-center border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* Logo Placement */}
          <div className="relative h-10 w-10 overflow-hidden rounded-md">
            <Image
              src="/logo_dark.png"
              alt="HanJaemi Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">HanJaemi</span>
        </div>

        {mounted && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}
      </header>

      <div className="flex-1 flex flex-col items-center pt-12 sm:pt-16 p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">HanJaemi</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Your journey to mastering Korean starts here
            </p>
        </motion.div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-7 gap-6 lg:gap-8 items-center">
          {/* Enhanced Email Collection Form - Now Smaller */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden border shadow-md backdrop-blur-sm bg-card/80 relative max-w-sm mx-auto lg:mx-0 lg:ml-auto">
              {/* Decorative elements - smaller */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8 z-0"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-primary/5 rounded-full -ml-6 -mb-6 z-0"></div>

              <CardContent className="p-3 sm:p-4 relative z-10">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center justify-center py-4 text-center space-y-2"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="rounded-full bg-primary/10 p-2"
                      >
                        <CheckCircle2 className="w-8 h-8 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-bold">Thank You!</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        We've received your email. We'll keep you updated on HanJaemi's launch and send you exclusive
                        early access.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <h2 className="text-lg font-semibold">Join the Waitlist</h2>
                          <Send className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          After watching our introduction, be the first to experience HanJaemi when we launch.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="relative">
                          <Mail className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            className="pl-8 h-8 text-xs border focus:border-primary transition-all duration-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Button
                            type="submit"
                            className="w-full h-8 text-xs font-medium group overflow-hidden relative"
                            size="sm"
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
                        </motion.div>

                        <p className="text-[10px] text-center text-muted-foreground">
                          By signing up, you agree to our{" "}
                          <a href="#" className="underline underline-offset-2 hover:text-primary transition-colors">
                            Terms & Conditions
                          </a>
                        </p>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Video Player with enhanced background - Now Larger */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative p-4 lg:col-span-5"
          >
            <VideoPlayer src="https://www.youtube.com/watch?v=xAwB9lQnxAY&pp=ygUac2xvdyBjb2xvciBjaGFuZ2luZyBsaWdodHM%3D" isYouTube={true} accentColor={accentColor} />
          </motion.div>
        </div>
      </div>

      <footer className="w-full p-6 text-center text-sm text-muted-foreground border-t backdrop-blur-sm bg-background/80">
        <div className="max-w-6xl mx-auto">© {new Date().getFullYear()} HanJaemi. All rights reserved.</div>
      </footer>
    </main>
  )
}

