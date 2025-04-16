import React from 'react';
import { PortableTextComponents } from '@portabletext/react';
import SanityTable from './SanityTable';
import ReactMarkdown from 'react-markdown';

// Configure components for @portabletext/react
export const portableTextComponents: PortableTextComponents = {
  types: {
    table: ({ value }) => <SanityTable value={value} />,
    markdown: ({ value }) => (
      <div className="markdown-content my-4">
        <ReactMarkdown>{value.markdown}</ReactMarkdown>
      </div>
    ),
    code: ({ value }) => (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto my-4">
        <code>{value.code}</code>
      </pre>
    ),
    image: ({ value }) => (
      <figure className="my-4">
        <img 
          src={value.asset.url} 
          alt={value.alt || 'Image'} 
          className="rounded-md" 
        />
        {value.caption && (
          <figcaption className="text-sm text-gray-500 mt-2">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-6 mb-3">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-5 mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-bold mt-3 mb-1">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-200 pl-4 py-2 my-4 italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mb-4">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 px-1 py-0.5 rounded">{children}</code>
    ),
    underline: ({ children }) => <u>{children}</u>,
    'strike-through': ({ children }) => <s>{children}</s>,
    link: ({ value, children }) => {
      const target = (value?.blank || value?.target === '_blank') ? '_blank' : undefined;
      return (
        <a href={value?.href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className="text-primary-dark hover:underline">
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-1">{children}</li>,
    number: ({ children }) => <li className="mb-1">{children}</li>,
  },
};

export default portableTextComponents;