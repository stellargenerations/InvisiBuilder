import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import YouTubeEmbed from './youtube-embed';
import { isYouTubeUrl, extractYouTubeVideoId, shouldEmbedYouTubeLink } from '@/lib/youtube-utils';

interface MarkdownWithYouTubeProps {
  content: string;
}

const MarkdownWithYouTube: React.FC<MarkdownWithYouTubeProps> = ({ content }) => {
  // Create a counter for YouTube links to track which ones we've encountered
  let youtubeLinksCounter = 0;
  
  // Helper function to check if a link is the first YouTube link in the article
  const isFirstYouTubeLink = (href: string): boolean => {
    if (isYouTubeUrl(href)) {
      youtubeLinksCounter++;
      return youtubeLinksCounter === 1;
    }
    return false;
  };
  
  // First, detect if the content contains tables
  const hasTable = content.includes('|') &&
                  content.includes('---') &&
                  /^\|.*\|$/m.test(content);

  // If the content has tables, we need to process it as a whole
  if (hasTable) {
    // Reset counter for this render path
    youtubeLinksCounter = 0;
    return (
      <div className="markdown-content">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom table styling
            table: ({node, ...props}) => (
              <div className="overflow-auto my-6">
                <table className="min-w-full divide-y divide-gray-300 border border-gray-300" {...props} />
              </div>
            ),
            thead: ({node, ...props}) => (
              <thead className="bg-gray-50" {...props} />
            ),
            tbody: ({node, ...props}) => (
              <tbody className="divide-y divide-gray-200 bg-white" {...props} />
            ),
            tr: ({node, ...props}) => (
              <tr className="hover:bg-gray-50" {...props} />
            ),
            th: ({node, ...props}) => (
              <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900 border-r last:border-r-0" {...props} />
            ),
            td: ({node, ...props}) => (
              <td className="whitespace-nowrap py-4 px-4 text-sm text-gray-800 border-r last:border-r-0" {...props} />
            ),
            // Custom component for links
            a: ({ node, href, children, ...props }) => {
              // Use our utility function to decide if this link should be embedded
              const textContent = String(children);
              
              // Check if this is the first YouTube link we've encountered
              const isFirstLink = href ? isFirstYouTubeLink(href) : false;
              
              // For the table version, we need a different approach to get context
              // Pass the full content as context, focusing on the beginning of the article
              const fullContent = content || '';
              const parentContext = fullContent.substring(0, 500); // First 500 chars for context
              
              if (href && shouldEmbedYouTubeLink(href, textContent, parentContext, isFirstLink)) {
                const videoId = extractYouTubeVideoId(href);
                if (videoId) {
                  return <YouTubeEmbed videoId={videoId} title="YouTube video" />;
                }
              }
              // Regular link
              return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  // For content without tables, we can process it line by line to handle standalone YouTube URLs
  const lines = content.split('\n');
  const processedContent: React.ReactNode[] = [];

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check if this line is just a YouTube URL
    // Also check surrounding context for specific patterns
    const prevLine = i > 0 ? lines[i-1].trim() : '';
    const nextLine = i < lines.length - 1 ? lines[i+1].trim() : '';
    
    // Don't embed if it's in a special context like headers or "Call to Action" section
    const isInSpecialContext = 
      prevLine.includes("Call to Action") || 
      prevLine.includes("Inspired by") || 
      nextLine.includes("Call to Action");
    
    // Check if this is the first YouTube link in the document - increment counter if it is a YouTube URL
    // This ensures we treat the first YouTube link specially (don't embed it)
    const isFirstLink = trimmedLine ? isFirstYouTubeLink(trimmedLine) : false;
    
    if (trimmedLine && isYouTubeUrl(trimmedLine) && !isInSpecialContext && !isFirstLink) {
      const videoId = extractYouTubeVideoId(trimmedLine);
      if (videoId) {
        processedContent.push(
          <div key={`youtube-${i}`} className="my-6">
            <YouTubeEmbed videoId={videoId} title="YouTube video" />
          </div>
        );
        continue; // Skip to next line
      }
    }

    // Collect consecutive non-YouTube lines to render as a single markdown block
    let markdownBlock = line;
    let j = i + 1;
    while (j < lines.length) {
      const nextLine = lines[j];
      const trimmedNextLine = nextLine.trim();

      // If the next line is a YouTube URL, stop collecting
      if (trimmedNextLine && isYouTubeUrl(trimmedNextLine)) {
        break;
      }

      markdownBlock += '\n' + nextLine;
      j++;
    }

    // If we collected multiple lines, update the index
    if (j > i + 1) {
      i = j - 1; // -1 because the loop will increment i
    }

    // Render the markdown block
    processedContent.push(
      <ReactMarkdown
        key={`md-${i}`}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom component for links
          a: ({ node, href, children, ...props }) => {
            // Use our utility function to decide if this link should be embedded
            const textContent = String(children);
            
            // Check if this is the first YouTube link we've encountered
            const isFirstLink = href ? isFirstYouTubeLink(href) : false;
            
            // Get parent context to help determine if this link should be embedded
            const parentContext = markdownBlock.substring(0, 500); // First 500 chars for context
            
            if (href && shouldEmbedYouTubeLink(href, textContent, parentContext, isFirstLink)) {
              const videoId = extractYouTubeVideoId(href);
              if (videoId) {
                return <YouTubeEmbed videoId={videoId} title="YouTube video" />;
              }
            }
            // Regular link
            return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
          }
        }}
      >
        {markdownBlock}
      </ReactMarkdown>
    );
  }

  return <div className="markdown-content">{processedContent}</div>;
};

export default MarkdownWithYouTube;
