"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "@/components/motion"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { getVideoType, getEmbedUrl } from "@/utils/video-helpers"
import { useTheme } from "next-themes"
import Script from 'next/script'

// Update YouTube player interface with all required methods
interface YouTubePlayer {
  getDuration: () => number;
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
}

interface YouTubeEvent {
  target: YouTubePlayer;
  data: number;
}   

interface VideoPlayerProps {
  src: string;
  accentColor?: string;
  thumbnailUrl?: string;
  enableAmbientLight?: boolean;
  defaultAmbientMode?: boolean;
  ambientIntensity?: number;
}

export default function VideoPlayer({
  src,
  accentColor = "#3b82f6",
  thumbnailUrl = "/wide_dark.png",
  enableAmbientLight = true,
  defaultAmbientMode = true,
  ambientIntensity = 0.4,
}: VideoPlayerProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [showEmbed, setShowEmbed] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [ambientMode, setAmbientMode] = useState<boolean>(defaultAmbientMode)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [colors, setColors] = useState<Array<string>>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const { theme } = useTheme()
  const lastColorUpdateRef = useRef<number>(0)
  const isDarkMode = theme === 'dark'
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const videoType = getVideoType(src)
  const isEmbeddable = videoType === 'youtube' || videoType === 'vimeo'
  const embedUrl = isEmbeddable ? getEmbedUrl(src, videoType) : src

  const getEmbedUrlWithParams = () => {
    const baseUrl = embedUrl;
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '0',
      controls: '0',  // Hide YouTube controls
      modestbranding: '1',
      rel: '0',
      enablejsapi: '1'
    });
    return `${baseUrl}?${params.toString()}`;
  };

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initialize YouTube player
  useEffect(() => {
    if (!showEmbed || !isEmbeddable) return;

    const initPlayer = () => {
      if (typeof window.YT === 'undefined') return;
      
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event: YouTubeEvent) => {
            const duration = event.target.getDuration();
            setDuration(duration);
          },
          onStateChange: (event: YouTubeEvent) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    };

    if (typeof window.YT === 'undefined') {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }
  }, [showEmbed, isEmbeddable]);

  const handlePlayPause = () => {
    if (isEmbeddable) {
      if (!showEmbed) {
        setShowEmbed(true);
        setIsPlaying(true);
      } else if (playerRef.current) {
        if (isPlaying) {
          playerRef.current.pauseVideo();
        } else {
          playerRef.current.playVideo();
        }
        setIsPlaying(!isPlaying);
      }
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
    if (isEmbeddable && playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    } else if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  useEffect(() => {
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

            const brightness = (data[0] + data[1] + data[2]) / 3
            if (brightness > 32) {
              newColors.push(`rgba(${data[0]}, ${data[1]}, ${data[2]}, ${ambientIntensity})`)
            }
          }
        }

        if (newColors.length > 0) {
          setColors(newColors)
        }
      } catch (e) {
        console.error("Error sampling video color:", e)
      }

      animationFrameRef.current = requestAnimationFrame(sampleVideoColor)
    }

    if (isPlaying && !isEmbeddable && enableAmbientLight) {
      sampleVideoColor()
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying, isEmbeddable, enableAmbientLight, ambientMode, isDarkMode, ambientIntensity])

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      setProgress((videoRef.current.currentTime / duration) * 100)
    }
  }

  const handleProgressChange = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    if (isEmbeddable && playerRef.current) {
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
      setProgress(value[0]);
    } else if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(value[0]);
    }
  };

  useEffect(() => {
    if (!showEmbed || !isEmbeddable || !playerRef.current) return;

    const updateTime = () => {
      if (!playerRef.current?.getCurrentTime || !playerRef.current?.getDuration) return;
      
      try {
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();
        setCurrentTime(current);
        setProgress((current / total) * 100);
      } catch (e) {
        console.error('Error updating time:', e);
      }
    };

    const interval = setInterval(updateTime, 500);
    return () => clearInterval(interval);
  }, [showEmbed, isEmbeddable]);

  const handleMouseMove = () => {
    if (isPlaying) {
      setShowControls(true)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false)
      }, 5000)
      return () => clearTimeout(timer)
    } else {
      setShowControls(true)
    }
  }, [isPlaying])

  if (!isMounted) {
    return <div className="w-full h-full bg-muted animate-pulse rounded-md"></div>
  }

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
    <div className="video-container relative w-full p-0 sm:p-2 md:p-4">
      <Script src="https://www.youtube.com/iframe_api" />
      <canvas
        ref={canvasRef}
        className="hidden"
        width="50"
        height="50"
      />

      <motion.div 
        className="relative rounded-none sm:rounded-lg md:rounded-xl overflow-hidden cursor-default"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute -inset-0 sm:-inset-1 rounded-none sm:rounded-lg md:rounded-xl before:absolute before:inset-0 before:rounded-none sm:before:rounded-lg md:before:rounded-xl before:blur-xl before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
          <div className="absolute inset-0 rounded-none sm:rounded-lg md:rounded-xl overflow-hidden">
            <div className="absolute inset-0 blur-[6px] sm:blur-md animate-pulse" style={ambientStyle} />
            <div className="absolute inset-0 blur-lg sm:blur-xl opacity-70" style={ambientStyle} />
            <div className="absolute inset-0 blur-xl sm:blur-2xl opacity-50" style={ambientStyle} />
          </div>
        </div>

        <div className="relative z-10 rounded-none sm:rounded-lg md:rounded-xl overflow-hidden shadow-2xl bg-black">
          {isEmbeddable ? (
            <div className="relative w-full aspect-video bg-black">
              {showEmbed ? (
                <div className="relative w-full h-0 pb-[56.25%]">
                  <iframe
                    ref={iframeRef}
                    src={getEmbedUrlWithParams()}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video Player"
                  />
                </div>
              ) : (
                <Image
                  src={thumbnailUrl || "/wide_dark.png"}
                  alt="Video thumbnail"
                  fill
                  className="object-cover opacity-90"
                />
              )}
            </div>
          ) : (
            <div className="relative w-full aspect-video bg-black">
              <video
                ref={videoRef}
                src={src}
                className="w-full h-full"
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              />
            </div>
          )}

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

          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-4 transition-all duration-300 ${
              showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
            }`}
          >
            <div className="flex flex-col gap-1 sm:gap-2">
              <Slider
                value={[progress]}
                max={100}
                step={0.1}
                className="cursor-pointer [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:opacity-0 [&>span:first-child_span]:bg-primary"
                onValueChange={handleProgressChange}
                onValueCommit={handleProgressChange}
              />
              <div className="flex items-center gap-1 sm:gap-2 text-white text-xs sm:text-sm">
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
                <div className="text-xs ml-2">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <div className="flex-1"></div>
                {renderSettingsButton()}
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
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

declare global {
  interface Window {
    YT: {
      Player: new (
        iframe: HTMLIFrameElement | null,
        config: {
          events: {
            onReady: (event: YouTubeEvent) => void;
            onStateChange: (event: YouTubeEvent) => void;
          };
        }
      ) => YouTubePlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

