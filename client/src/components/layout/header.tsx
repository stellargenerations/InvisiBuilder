import { useState } from "react";
import { Link, useLocation } from "wouter";
import Logo from "@/components/ui/logo";
import SearchBar from "@/components/search/search-bar";
import MobileMenu from "@/components/layout/mobile-menu";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Faceless Marketing", path: "/faceless-digital-marketing" },
    { name: "Articles", path: "/articles" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 bg-neutral-100 shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center flex-shrink-0">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Logo className="h-7 w-auto" />
                <span className="font-semibold text-neutral-800 text-sm md:text-base">Invisibuilder</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <nav className="ml-8 flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <div className={`text-sm font-medium cursor-pointer ${location === link.path ? 'text-primary-dark' : 'text-neutral-800 hover:text-primary-dark'} transition duration-150`}>
                    {link.name}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center md:hidden">
            <button 
              type="button" 
              className="text-neutral-800 hover:text-primary-dark"
              aria-label="Toggle menu"
              onClick={toggleMobileMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <div className="hidden md:flex items-center">
            <SearchBar className="scale-90 origin-right" />
          </div>
        </div>
      </div>
      
      <MobileMenu isOpen={isMobileMenuOpen} navLinks={navLinks} />
    </header>
  );
};

export default Header;
