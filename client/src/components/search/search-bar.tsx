import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";

interface SearchBarProps {
  mobile?: boolean;
  className?: string;
}

const SearchBar = ({ mobile = false, className = "" }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setLocation(`/content?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={`relative ${mobile ? 'w-full' : ''} ${className}`}>
      <form onSubmit={handleSearch}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          className="px-3 py-1.5 rounded-full bg-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary-light transition duration-150 w-full"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-800"
          aria-label="Submit search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
