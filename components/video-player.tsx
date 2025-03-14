"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "@/components/motion"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { getVideoType, getEmbedUrl } from "@/utils/video-helpers"

interface VideoPlayerProps {
  src: string;
  isYouTube?: boolean;
  accentColor?: string;
  thumbnailUrl?: string;
}

export default function VideoPlayer({
  src,
  isYouTube = false,
  accentColor = "#3b82f6", // Default accent color (blue)
  thumbnailUrl = "/wide_dark.png",
}: VideoPlayerProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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

  if (!isMounted) {
    return <div className="w-full h-full bg-muted animate-pulse rounded-md"></div>
  }

  // Stronger ambient light effect
  const ambientStyle = {
    background: `radial-gradient(circle at center, ${accentColor} 0%, rgba(0,0,0,0) 70%)`,
    opacity: 0.8,
  }

  return (
    <div className="video-container relative w-full">
      {/* Enhanced ambient light effect */}
      <div className="absolute -inset-6 rounded-3xl blur-3xl z-0" style={ambientStyle} />

      {/* Video player with custom controls */}
      <motion.div
        className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.01 }}
      >
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
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <Settings className="w-5 h-5" />
                    </Button>
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
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

