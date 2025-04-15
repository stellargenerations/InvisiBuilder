// This is a simplified Portable Text renderer
// In a production app, you'd use @portabletext/react for a complete solution

interface Block {
  _type: string;
  children?: any[];
  style?: string;
  listItem?: string;
  markDefs?: any[];
  [key: string]: any;
}

interface PortableTextProps {
  value: Block[];
  className?: string;
}

export function PortableText({ value, className = '' }: PortableTextProps) {
  if (!value || !Array.isArray(value)) {
    return null;
  }

  return (
    <div className={className}>
      {value.map((block, i) => {
        // Handle different block types
        if (block._type === 'block') {
          return renderBlock(block, i);
        }
        
        // Handle image blocks
        if (block._type === 'image') {
          return (
            <figure key={i} className="my-4">
              <img 
                src={block.asset.url} 
                alt={block.alt || 'Image'} 
                className="rounded-md" 
              />
              {block.caption && (
                <figcaption className="text-sm text-gray-500 mt-2">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }
        
        // Handle code blocks
        if (block._type === 'code') {
          return (
            <pre key={i} className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto my-4">
              <code>{block.code}</code>
            </pre>
          );
        }
        
        // Handle callout blocks
        if (block._type === 'callout') {
          const typeClassMap: Record<string, string> = {
            info: 'bg-blue-50 border-blue-200 text-blue-800',
            warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            success: 'bg-green-50 border-green-200 text-green-800',
            error: 'bg-red-50 border-red-200 text-red-800',
          };
          
          const classes = typeClassMap[block.type] || typeClassMap.info;
          
          return (
            <div key={i} className={`border-l-4 p-4 my-4 ${classes}`}>
              <p>{block.text}</p>
            </div>
          );
        }
        
        // Fallback for unknown blocks
        return <div key={i}>Unsupported block type: {block._type}</div>;
      })}
    </div>
  );
}

function renderBlock(block: Block, key: number) {
  const style = block.style || 'normal';
  
  // Basic mark rendering (bold, italic, etc.)
  const content = block.children?.map((child, i) => {
    if (!child.marks || child.marks.length === 0) {
      return child.text;
    }
    
    let text = child.text;
    
    if (child.marks.includes('strong')) {
      text = <strong key={i}>{text}</strong>;
    }
    
    if (child.marks.includes('em')) {
      text = <em key={i}>{text}</em>;
    }
    
    if (child.marks.includes('code')) {
      text = <code key={i} className="bg-gray-100 px-1 py-0.5 rounded">{text}</code>;
    }
    
    if (child.marks.includes('underline')) {
      text = <u key={i}>{text}</u>;
    }
    
    if (child.marks.includes('strike-through')) {
      text = <s key={i}>{text}</s>;
    }
    
    return text;
  });
  
  // Handle different block styles
  switch (style) {
    case 'h1':
      return <h1 key={key} className="text-3xl font-bold mt-6 mb-3">{content}</h1>;
    case 'h2':
      return <h2 key={key} className="text-2xl font-bold mt-5 mb-2">{content}</h2>;
    case 'h3':
      return <h3 key={key} className="text-xl font-bold mt-4 mb-2">{content}</h3>;
    case 'h4':
      return <h4 key={key} className="text-lg font-bold mt-3 mb-1">{content}</h4>;
    case 'blockquote':
      return (
        <blockquote key={key} className="border-l-4 border-gray-200 pl-4 py-2 my-4 italic">
          {content}
        </blockquote>
      );
    default:
      // Handle lists
      if (block.listItem === 'bullet') {
        return <li key={key}>{content}</li>;
      }
      
      if (block.listItem === 'number') {
        return <li key={key}>{content}</li>;
      }
      
      return <p key={key} className="mb-4">{content}</p>;
  }
}