"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings } from "lucide-react"

interface CustomVideoPlayerProps {
  src: string
  youtubeId?: string
  onColorChange: (color: string) => void
}

export default function CustomVideoPlayer({ src, youtubeId, onColorChange }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Extract colors from video frames
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) return

    const extractColor = () => {
      try {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        let r = 0,
          g = 0,
          b = 0,
          count = 0

        // Sample pixels at intervals for performance
        for (let i = 0; i < data.length; i += 20) {
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
          count++
        }

        // Calculate average color
        r = Math.floor(r / count)
        g = Math.floor(g / count)
        b = Math.floor(b / count)

        onColorChange(`rgba(${r}, ${g}, ${b}, 0.5)`)
      } catch (e) {
        // Handle potential CORS issues or other errors
        console.error("Error extracting color:", e)
      }
    }

    let animationFrame: number

    const updateColor = () => {
      if (video.paused || video.ended) return

      extractColor()
      animationFrame = requestAnimationFrame(updateColor)
    }

    video.addEventListener("play", () => {
      updateColor()
    })

    video.addEventListener("pause", () => {
      cancelAnimationFrame(animationFrame)
    })

    video.addEventListener("ended", () => {
      cancelAnimationFrame(animationFrame)
    })

    // Initial color extraction
    if (!video.paused) {
      updateColor()
    }

    return () => {
      cancelAnimationFrame(animationFrame)
      video.removeEventListener("play", updateColor)
      video.removeEventListener("pause", () => cancelAnimationFrame(animationFrame))
      video.removeEventListener("ended", () => cancelAnimationFrame(animationFrame))
    }
  }, [onColorChange])

  // Add these event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  // Replace the existing togglePlay function
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Play was prevented:", error);
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    const newTime = value[0]
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration)
    }
  }

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0)
    }
  }

  // Show/hide controls on mouse movement
  const handleMouseMove = () => {
    setShowControls(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (id: string) => {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="relative flex-1 min-h-[300px] bg-black" onMouseMove={handleMouseMove}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-contain"
            poster={youtubeId ? getYouTubeThumbnail(youtubeId) : undefined}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            crossOrigin="anonymous"
            preload="auto"
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Hidden canvas for color extraction */}
          <canvas ref={canvasRef} width="150" height="100" className="hidden" />

          {/* Video controls */}
          <div
            className={`absolute inset-0 flex flex-col justify-between p-4 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Top controls */}
            <div className="flex justify-end items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Center play button */}
            {!isPlaying && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary/100"
                onClick={togglePlay}
              >
                <Play className="h-8 w-8" />
              </Button>
            )}

            {/* Bottom controls */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.01}
                onValueChange={handleSeek}
                className="h-1"
              />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={skipBackward}>
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={skipForward}>
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <span className="text-xs text-white">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 w-24">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={toggleMute}>
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="h-1"
                    />
                  </div>

                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={handleFullscreen}>
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

