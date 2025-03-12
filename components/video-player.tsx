"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

// YouTube URL patterns
const YOUTUBE_REGEX = {
  STANDARD: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
  SHORT: /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/,
  EMBED: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
}

type VideoSource = {
  src: string | null
  type: "youtube" | "direct"
  videoId?: string
}

export function VideoPlayer({
  src = "https://www.youtube.com/watch?v=K27diMbCsuw",
  poster = "/placeholder.svg?height=720&width=1280",
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Parse the video source on component mount
  useEffect(() => {
    const source = parseVideoSource(src)
    setVideoSource(source)
    setIsLoaded(true)
  }, [src])

  // Function to determine if a URL is a YouTube URL and extract the video ID
  const parseVideoSource = (url: string): VideoSource => {
    // Check if it's a YouTube URL
    for (const [key, regex] of Object.entries(YOUTUBE_REGEX)) {
      const match = url.match(regex)
      if (match && match[1]) {
        return {
          src: url,
          type: "youtube",
          videoId: match[1],
        }
      }
    }

    // If not a YouTube URL, treat as direct video source
    return {
      src: url,
      type: "direct",
    }
  }

  const togglePlay = () => {
    if (!videoSource) return

    if (videoSource.type === "direct") {
      const video = document.getElementById("preview-video") as HTMLVideoElement
      if (video) {
        if (isPlaying) {
          video.pause()
        } else {
          video.play()
        }
        setIsPlaying(!isPlaying)
      }
    } else if (videoSource.type === "youtube") {
      // For YouTube, we'll use the YouTube iframe API
      const iframe = document.getElementById("youtube-player") as HTMLIFrameElement
      if (iframe && iframe.contentWindow) {
        if (isPlaying) {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*")
        } else {
          iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*")
        }
        setIsPlaying(!isPlaying)
      }
    }
  }

  const toggleMute = () => {
    if (!videoSource) return

    if (videoSource.type === "direct") {
      const video = document.getElementById("preview-video") as HTMLVideoElement
      if (video) {
        video.muted = !isMuted
        setIsMuted(!isMuted)
      }
    } else if (videoSource.type === "youtube") {
      const iframe = document.getElementById("youtube-player") as HTMLIFrameElement
      if (iframe && iframe.contentWindow) {
        if (isMuted) {
          iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', "*")
        } else {
          iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', "*")
        }
        setIsMuted(!isMuted)
      }
    }
  }

  // Show loading state until video source is parsed
  if (!isLoaded || !videoSource) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-xl flex items-center justify-center">
        <div className="text-white">Loading video...</div>
      </div>
    )
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-xl">
      {videoSource.type === "direct" ? (
        // Direct video file player
        <video
          id="preview-video"
          className="w-full h-full object-cover"
          poster={poster}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={videoSource.src || undefined} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        // YouTube embed
        <iframe
          id="youtube-player"
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoSource.videoId}?enablejsapi=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-colors"
            aria-label="Play video"
          >
            <Play size={32} />
          </button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="text-white hover:text-white/80 transition-colors"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={toggleMute}
            className="text-white hover:text-white/80 transition-colors"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}

