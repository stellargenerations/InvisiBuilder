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

  console.log('Extracting YouTube ID from URL:', url);

  // Regular YouTube watch URLs
  const watchRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const watchMatch = url.match(watchRegex);

  if (watchMatch && watchMatch[1]) {
    console.log('Matched YouTube watch URL, ID:', watchMatch[1]);
    return watchMatch[1];
  }

  // YouTube Shorts URLs
  const shortsRegex = /youtube\.com\/shorts\/([^"&?\/\s]{11})/i;
  const shortsMatch = url.match(shortsRegex);

  if (shortsMatch && shortsMatch[1]) {
    console.log('Matched YouTube shorts URL, ID:', shortsMatch[1]);
    return shortsMatch[1];
  }

  console.log('No YouTube ID found in URL');
  return null;
}

/**
 * Checks if a URL is a YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  console.log('Checking if URL is a YouTube URL:', url);
  const result = !!extractYouTubeVideoId(url);
  console.log('Is YouTube URL:', result);
  return result;
}

/**
 * Determines if a YouTube link should be embedded or shown as a regular link
 * This helps prevent unwanted embeds in certain contexts like headings
 */
export function shouldEmbedYouTubeLink(href: string, linkText: string, parentText?: string): boolean {
  if (!isYouTubeUrl(href)) return false;
  
  // Only embed standalone YouTube URLs (where the link text is the same as the URL)
  if (linkText !== href) return false;
  
  // Check if this link is in a header, byline, introduction, or other special section
  // We use both the link text itself and the surrounding content (parentText) if available
  const containingText = linkText || '';
  const surroundingText = parentText || '';
  const combinedText = containingText + ' ' + surroundingText;
  
  // Extended patterns to detect various contexts where embedding should be prevented
  const excludedPatterns = [
    "Watch the", 
    "Watch the original", 
    "original video",
    "fixing SEO mistakes",
    "full video",
    "Inspired by",
    "Call to Action",
    "By Invisibuilder",
    "Team |",
    "I Built a 7000",
    "Jordan Urbs"
  ];
  
  for (const pattern of excludedPatterns) {
    if (combinedText.includes(pattern)) {
      console.log('Not embedding YouTube link with pattern:', pattern);
      return false;
    }
  }
  
  // If the link is at the very top of the article, don't embed it
  // This heuristic helps catch bylines and headers
  if (surroundingText.indexOf(containingText) < 200) {
    console.log('Not embedding YouTube link near top of article');
    return false;
  }
  
  return true;
}
