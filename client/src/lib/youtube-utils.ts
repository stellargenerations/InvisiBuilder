/**
 * Extracts the YouTube video ID from various YouTube URL formats
 * 
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Regular YouTube watch URLs
  const watchRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const watchMatch = url.match(watchRegex);
  
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }
  
  // YouTube Shorts URLs
  const shortsRegex = /youtube\.com\/shorts\/([^"&?\/\s]{11})/i;
  const shortsMatch = url.match(shortsRegex);
  
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }
  
  return null;
}

/**
 * Checks if a URL is a YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  return !!extractYouTubeVideoId(url);
}
