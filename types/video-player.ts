export interface VideoPlayerProps {
  src: string;
  onColorChange: (color: string) => void;
}

export interface CustomVideoPlayerProps extends VideoPlayerProps {
  youtubeId?: string;
}

export interface YouTubeVideoPlayerProps extends VideoPlayerProps {
  youtubeId: string;
}
