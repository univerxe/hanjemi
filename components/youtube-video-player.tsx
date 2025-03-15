"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { YouTubeVideoPlayerProps } from "@/types/video-player"
import YouTube from "react-youtube"

export default function YouTubeVideoPlayer({ youtubeId, onColorChange }: YouTubeVideoPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerRef = useRef<any>(null)

  const extractColor = (videoElement: HTMLElement) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) return

    try {
      context.drawImage(videoElement as any, 0, 0, canvas.width, canvas.height)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      let r = 0, g = 0, b = 0, count = 0

      for (let i = 0; i < data.length; i += 20) {
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
        count++
      }

      r = Math.floor(r / count)
      g = Math.floor(g / count)
      b = Math.floor(b / count)

      onColorChange(`rgba(${r}, ${g}, ${b}, 0.5)`)
    } catch (e) {
      console.error("Error extracting color:", e)
    }
  }

  const onReady = (event: any) => {
    playerRef.current = event.target
  }

  useEffect(() => {
    let animationFrame: number
    
    const updateColor = () => {
      if (playerRef.current) {
        const iframe = playerRef.current.getIframe()
        extractColor(iframe)
      }
      animationFrame = requestAnimationFrame(updateColor)
    }

    if (playerRef.current) {
      updateColor()
    }

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [playerRef.current])

  return (
    <Card className="w-full h-auto overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <YouTube
            videoId={youtubeId}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 0,
                modestbranding: 1,
                rel: 0,
              },
            }}
            onReady={onReady}
            className="absolute inset-0"
          />
          <canvas ref={canvasRef} width="150" height="100" className="hidden" />
        </div>
      </CardContent>
    </Card>
  )
}
