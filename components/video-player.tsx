"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "@/components/motion"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { getVideoType, getEmbedUrl } from "@/utils/video-helpers"
import { useTheme } from "next-themes"

interface VideoPlayerProps {
  src: string;
  isYouTube?: boolean;
  accentColor?: string;
  thumbnailUrl?: string;
  enableAmbientLight?: boolean;
  defaultAmbientMode?: boolean;
  ambientIntensity?: number;
}

export default function VideoPlayer({
  src,
  isYouTube = false,
  accentColor = "#3b82f6", // Default accent color (blue)
  thumbnailUrl = "/wide_dark.png",
  enableAmbientLight = true,
  defaultAmbientMode = true,
  ambientIntensity = 0.4,
}: VideoPlayerProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [showEmbed, setShowEmbed] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [dominantColor, setDominantColor] = useState<string>(accentColor)
  const [ambientMode, setAmbientMode] = useState<boolean>(defaultAmbientMode)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const { theme } = useTheme()
  const [colors, setColors] = useState<Array<string>>([])
  const lastColorUpdateRef = useRef<number>(0)
  const isDarkMode = theme === 'dark'

  const videoType = getVideoType(src)
  const isEmbeddable = videoType === 'youtube' || videoType === 'vimeo'
  const embedUrl = isEmbeddable ? getEmbedUrl(src, videoType) : src

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handlePlayPause = () => {
    if (isEmbeddable) {
      setShowEmbed(true)
      setIsPlaying(true)
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Enhanced color sampling function
  const sampleVideoColor = () => {
    if (!videoRef.current || !canvasRef.current || !isPlaying || !ambientMode || !isDarkMode) return

    const now = Date.now()
    if (now - lastColorUpdateRef.current < 100) {
      animationFrameRef.current = requestAnimationFrame(sampleVideoColor)
      return
    }
    lastColorUpdateRef.current = now

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const sampleSize = 50
    canvas.width = sampleSize
    canvas.height = sampleSize

    try {
      ctx.drawImage(
        videoRef.current,
        0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight,
        0, 0, sampleSize, sampleSize
      )

      // Sample colors from a 5x5 grid
      const gridSize = 5
      const cellSize = sampleSize / gridSize
      const newColors: string[] = []

      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          const data = ctx.getImageData(
            x * cellSize + cellSize / 2,
            y * cellSize + cellSize / 2,
            1, 1
          ).data

          // Calculate color brightness
          const brightness = (data[0] + data[1] + data[2]) / 3
          if (brightness > 32) { // Filter out very dark colors
            newColors.push(`rgba(${data[0]}, ${data[1]}, ${data[2]}, ${ambientIntensity})`)
          }
        }
      }

      if (newColors.length > 0) {
        setColors(newColors)
        // Use the most prominent color for the main ambient effect
        setDominantColor(newColors[0])
      }
    } catch (e) {
      console.error("Error sampling video color:", e)
    }

    animationFrameRef.current = requestAnimationFrame(sampleVideoColor)
  }

  // Start/stop color sampling
  useEffect(() => {
    if (isPlaying && !isEmbeddable && enableAmbientLight) {
      sampleVideoColor()
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, isEmbeddable, enableAmbientLight, ambientMode])

  if (!isMounted) {
    return <div className="w-full h-full bg-muted animate-pulse rounded-md"></div>
  }

  // Update ambient style with more intense glow
  const ambientStyle: React.CSSProperties = {
    background: ambientMode && isDarkMode
      ? `linear-gradient(45deg, 
          ${colors[0] || accentColor} 0%, 
          ${colors[1] || accentColor} 25%, 
          ${colors[2] || accentColor} 50%,
          ${colors[3] || accentColor} 75%,
          ${colors[0] || accentColor} 100%)`
      : 'none',
    opacity: (ambientMode && isDarkMode) ? 0.8 : 0,
    mixBlendMode: 'lighten' as const,
    transition: 'all 0.8s ease-in-out',
  }

  const renderSettingsButton = () => (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10 relative"
        onClick={() => setShowSettings(!showSettings)}
      >
        <Settings className="w-5 h-5" />
      </Button>
      {showSettings && (
        <div className="absolute right-16 bottom-14 bg-black/90 rounded-md p-2 backdrop-blur-sm border border-white/10">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 text-sm w-full justify-start"
            onClick={() => setAmbientMode(!ambientMode)}
          >
            <span className="mr-2">☄️</span>
            Ambient mode {ambientMode ? 'on' : 'off'}
          </Button>
        </div>
      )}
    </>
  )

  return (
    <div className="video-container relative w-full p-8">
      {/* Hidden canvas for color sampling */}
      <canvas
        ref={canvasRef}
        className="hidden"
        width="50"
        height="50"
      />

      {/* Video player with glowing border */}
      <motion.div className="relative rounded-xl overflow-hidden">
        {/* Glowing border container */}
        <div className="absolute -inset-1 rounded-xl before:absolute before:inset-0 before:rounded-xl before:blur-xl before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
          {/* Multiple glow layers */}
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute inset-0 blur-md animate-pulse" style={ambientStyle} />
            <div className="absolute inset-0 blur-xl opacity-70" style={ambientStyle} />
            <div className="absolute inset-0 blur-2xl opacity-50" style={ambientStyle} />
          </div>
        </div>

        {/* Main video container */}
        <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl bg-black">
          {isEmbeddable ? (
            showEmbed ? (
              // Embedded player (YouTube/Vimeo)
              <div className="relative w-full h-0 pb-[56.25%]">
                <iframe
                  src={`${embedUrl}?autoplay=1&mute=0`}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video Player"
                />
              </div>
            ) : (
              // Custom thumbnail with play button overlay
              <div className="relative w-full aspect-video bg-black">
                <Image
                  src={thumbnailUrl || "/placeholder.svg"}
                  alt="Video thumbnail"
                  fill
                  className="object-cover opacity-90"
                />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    onClick={handlePlayPause}
                    className="w-20 h-20 rounded-full bg-primary/90 hover:bg-primary hover:scale-105 transition-all duration-300"
                  >
                    <Play className="w-10 h-10 fill-primary-foreground" />
                  </Button>
                </div>

                {/* Video title overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent text-white">
                  <h3 className="font-medium text-lg">HanJaemi: Korean Learning Made Simple</h3>
                </div>

                {/* Custom control bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex flex-col gap-2">
                    <Slider
                      defaultValue={[0]}
                      max={100}
                      step={1}
                      className="cursor-pointer [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:opacity-0 [&>span:first-child_span]:bg-primary"
                    />
                    <div className="flex items-center gap-2 text-white">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <Play className="w-5 h-5 fill-white" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <SkipForward className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <Volume2 className="w-5 h-5" />
                      </Button>
                      <div className="text-xs ml-2">0:00 / 3:45</div>
                      <div className="flex-1"></div>
                      {renderSettingsButton()}
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <Maximize className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            // Custom HTML5 video player
            <div className="relative w-full aspect-video bg-black">
              <video
                ref={videoRef}
                src={src}
                className="w-full h-full"
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Play/pause overlay (shows when video is paused) */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Button
                    onClick={handlePlayPause}
                    className="w-20 h-20 rounded-full bg-primary/90 hover:bg-primary hover:scale-105 transition-all duration-300"
                  >
                    <Play className="w-10 h-10 fill-primary-foreground" />
                  </Button>
                </div>
              )}

              {/* Custom control bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex flex-col gap-2">
                  <Slider
                    defaultValue={[0]}
                    max={100}
                    step={1}
                    className="cursor-pointer [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:opacity-0 [&>span:first-child_span]:bg-primary"
                  />
                  <div className="flex items-center gap-2 text-white">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <SkipForward className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                      onClick={handleMuteToggle}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <div className="text-xs ml-2">0:00 / 3:45</div>
                    <div className="flex-1"></div>
                    {renderSettingsButton()}
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }
      `}</style>
    </div>
  )
}

