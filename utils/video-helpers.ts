type VideoType = 'youtube' | 'vimeo' | 'direct' | 'unknown';

export function getVideoType(url: string): VideoType {
  if (!url) return 'unknown';
  
  // YouTube patterns
  if (url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/i)) {
    return 'youtube';
  }
  
  // Vimeo patterns
  if (url.match(/^(https?:\/\/)?(www\.)?(vimeo\.com)/i)) {
    return 'vimeo';
  }
  
  // Direct video file patterns
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return 'direct';
  }
  
  return 'unknown';
}

export function getVideoId(url: string, type: VideoType): string | null {
  switch (type) {
    case 'youtube': {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
      return match ? match[1] : null;
    }
    case 'vimeo': {
      const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      return match ? match[1] : null;
    }
    default:
      return null;
  }
}

export function getEmbedUrl(url: string, type: VideoType): string {
  const videoId = getVideoId(url, type);
  
  switch (type) {
    case 'youtube':
      return `https://www.youtube.com/embed/${videoId}`;
    case 'vimeo':
      return `https://player.vimeo.com/video/${videoId}`;
    case 'direct':
      return url;
    default:
      return url;
  }
}
