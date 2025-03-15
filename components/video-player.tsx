import { VideoPlayerProps } from "@/types/video-player"
import CustomVideoPlayer from "./custom-video-player"
import YouTubeVideoPlayer from "./youtube-video-player"

export default function VideoPlayer({ src, onColorChange }: VideoPlayerProps) {
  const isYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    return youtubeRegex.test(url)
  }

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : null
  }

  if (isYouTubeUrl(src)) {
    const youtubeId = getYouTubeVideoId(src)
    if (youtubeId) {
      return <YouTubeVideoPlayer src={src} youtubeId={youtubeId} onColorChange={onColorChange} />
    }
  }

  return <CustomVideoPlayer src={src} onColorChange={onColorChange} />
}
