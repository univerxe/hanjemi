"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import CustomVideoPlayer from "@/components/custom-video-player"
import EmailForm from "@/components/email-form"
import Logo from "@/components/logo"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [dominantColor, setDominantColor] = useState("rgba(0, 0, 0, 0.5)")
  const [mounted, setMounted] = useState(false)

  // Video source - in a real implementation, this would be processed server-side
  const videoSource = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

  // YouTube video ID for thumbnail/preview (just for demonstration)
  const youtubeId = "dQw4w9WgXcQ"

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main
      className="min-h-screen flex flex-col p-4 transition-colors duration-500 bg-black"
      style={{
        background: `linear-gradient(to bottom, ${dominantColor}, rgba(0, 0, 0, 0.95))`,
      }}
    >
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <div className="w-full max-w-7xl mx-auto mb-8">
        <Logo />
      </div>

      <div className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="order-2 md:order-1 md:col-span-4 flex items-start">
          <div className="w-full max-w-md">
            <EmailForm />
          </div>
        </div>
        <div className="order-1 md:order-2 md:col-span-8">
          <CustomVideoPlayer src={videoSource} youtubeId={youtubeId} onColorChange={setDominantColor} />
        </div>
      </div>
    </main>
  )
}

