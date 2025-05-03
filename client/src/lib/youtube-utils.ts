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
export function shouldEmbedYouTubeLink(href: string, linkText: string, parentText?: string, isFirstLink?: boolean): boolean {
  if (!isYouTubeUrl(href)) return false;
  
  // ALWAYS handle the first YouTube link in the article as plain text, not embedded
  // This is a special case for the byline in the article header
  if (isFirstLink === true) {
    console.log('Not embedding - this is the first YouTube link in the article');
    return false;
  }
  
  // For typical links where the text is NOT the URL, we never embed
  // This makes normal links like [click here](youtube.com) always display as text links
  if (linkText !== href) {
    console.log('Not embedding - link text differs from URL');
    return false;
  }
  
  // Check for specific sections/contexts where embedding should be prevented
  // We use both the link text itself and the surrounding content (parentText) if available
  const containingText = linkText || '';
  const surroundingText = parentText || '';
  const combinedText = containingText + ' ' + surroundingText;
  
  // Explicit check for article byline
  if (surroundingText.includes("By Invisibuilder") || 
      surroundingText.includes("Inspired by") ||
      surroundingText.includes("Team | ")) {
    console.log('Not embedding - detected in byline/author section');
    return false;
  }
  
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
    "Team",
    "I Built a 7000",
    "Jordan Urbs",
    "Video:",
    "Directory With AI"
  ];
  
  for (const pattern of excludedPatterns) {
    if (combinedText.includes(pattern)) {
      console.log('Not embedding YouTube link with pattern:', pattern);
      return false;
    }
  }
  
  // If the link appears in the first 500 characters of the content, 
  // don't embed it - this catches headers, bylines, etc.
  if (parentText && parentText.length > 0) {
    const linkPosition = parentText.indexOf(containingText);
    if (linkPosition >= 0 && linkPosition < 500) {
      console.log('Not embedding YouTube link near top of article');
      return false;
    }
  }
  
  // If no exclusion rules triggered, allow embedding
  return true;
}
