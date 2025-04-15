import React from 'react';
import { Link } from 'wouter';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <svg 
                className="w-3 h-3 mx-1 text-neutral-500" 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 6 10"
              >
                <path 
                  stroke="currentColor" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="m1 9 4-4-4-4"
                />
              </svg>
            )}
            
            {item.href ? (
              <Link href={item.href}>
                <a className={`inline-flex items-center text-sm font-medium ${
                  index === items.length - 1 
                    ? 'text-neutral-700 cursor-default pointer-events-none'
                    : 'text-neutral-600 hover:text-primary-dark'
                }`}>
                  {index === 0 && (
                    <svg 
                      className="w-4 h-4 mr-2" 
                      aria-hidden="true" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                  )}
                  {item.label}
                </a>
              </Link>
            ) : (
              <span className="inline-flex items-center text-sm font-medium text-neutral-700">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;