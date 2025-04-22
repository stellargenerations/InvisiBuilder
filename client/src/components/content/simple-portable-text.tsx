import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import MarkdownWithYouTube from './markdown-with-youtube';

interface Block {
  type?: string;
  id?: string;
  style?: string;
  children?: any[];
  marks?: any[];
  text?: string;
  content?: string;
  markdown?: string;
  _type?: string; // For backward compatibility
  _key?: string;  // For backward compatibility
  [key: string]: any;
}

interface SimplePortableTextProps {
  value: Block[] | Block;
  components?: any;
}

/**
 * A component that can handle basic block content and markdown
 * rendering with proper formatting and media embedding
 */
const SimplePortableText: React.FC<SimplePortableTextProps> = ({ value, components }) => {
  // If value is not provided or is empty, return null
  if (!value) return null;
  
  // If value is a string, render it as markdown
  if (typeof value === 'string') {
    return <MarkdownWithYouTube content={value} />;
  }
  
  // If value is an object but not an array, wrap it in an array
  const blocks = Array.isArray(value) ? value : [value];
  
  return (
    <div className="portable-text">
      {blocks.map((block, index) => {
        // Handle different block types
        if (block._type === 'block' || block.type === 'block' || !block._type) {
          // Basic text block
          if (block.children && Array.isArray(block.children)) {
            const text = block.children.map(child => child.text).join('');
            
            // Render different styles
            switch (block.style) {
              case 'h1':
                return <h1 key={index} className="text-4xl font-bold mb-4">{text}</h1>;
              case 'h2':
                return <h2 key={index} className="text-3xl font-bold mb-3">{text}</h2>;
              case 'h3':
                return <h3 key={index} className="text-2xl font-bold mb-2">{text}</h3>;
              case 'h4':
                return <h4 key={index} className="text-xl font-bold mb-2">{text}</h4>;
              case 'blockquote':
                return <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-4">{text}</blockquote>;
              default:
                return <p key={index} className="mb-4">{text}</p>;
            }
          }
          
          // If there's no children array but there is text, render it
          if (block.text) {
            return <p key={index} className="mb-4">{block.text}</p>;
          }
        }
        
        // Handle markdown blocks
        if (block._type === 'markdown' || block.type === 'markdown' || block.markdown) {
          const markdownContent = block.markdown || '';
          return <MarkdownWithYouTube key={index} content={markdownContent} />;
        }
        
        // Handle content blocks
        if (block.content) {
          if (typeof block.content === 'string') {
            return <MarkdownWithYouTube key={index} content={block.content} />;
          }
        }
        
        // For any other block type, render a placeholder
        return (
          <div key={index} className="text-gray-500 italic mb-4">
            Unsupported content block
          </div>
        );
      })}
    </div>
  );
};

export default SimplePortableText;
