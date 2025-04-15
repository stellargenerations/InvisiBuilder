import { Link } from "wouter";
import Logo from "@/components/ui/logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Link href="/">
                <a>
                  <Logo className="text-primary" />
                </a>
              </Link>
            </div>
            <p className="text-sm mb-4">Resources for solopreneurs who prefer to work from behind the scenes, without sacrificing success.</p>
            <div className="flex items-center space-x-3">
              <a href="#" className="text-neutral-400 hover:text-primary transition duration-150" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary transition duration-150" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary transition duration-150" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-white">Content</h4>
            <ul className="space-y-2">
              <li><Link href="/content"><a className="text-sm hover:text-primary transition duration-150">Articles</a></Link></li>
              <li><Link href="/content?type=tutorial"><a className="text-sm hover:text-primary transition duration-150">Tutorials</a></Link></li>
              <li><Link href="/content?type=case-study"><a className="text-sm hover:text-primary transition duration-150">Case Studies</a></Link></li>
              <li><Link href="/content?category=resources"><a className="text-sm hover:text-primary transition duration-150">Resources</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-white">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/content?category=content-creation"><a className="text-sm hover:text-primary transition duration-150">Content Creation</a></Link></li>
              <li><Link href="/content?category=monetization"><a className="text-sm hover:text-primary transition duration-150">Monetization</a></Link></li>
              <li><Link href="/content?category=privacy-tools"><a className="text-sm hover:text-primary transition duration-150">Privacy Tools</a></Link></li>
              <li><Link href="/content?category=automation"><a className="text-sm hover:text-primary transition duration-150">Automation</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy"><a className="text-sm hover:text-primary transition duration-150">Privacy Policy</a></Link></li>
              <li><Link href="/terms"><a className="text-sm hover:text-primary transition duration-150">Terms of Service</a></Link></li>
              <li><Link href="/cookie-policy"><a className="text-sm hover:text-primary transition duration-150">Cookie Policy</a></Link></li>
              <li><Link href="/disclaimer"><a className="text-sm hover:text-primary transition duration-150">Disclaimer</a></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-neutral-400 mb-4 md:mb-0">
              &copy; {currentYear} Invisibuilder. All rights reserved.
            </div>
            <div>
              <Link href="/contact"><a className="text-sm text-neutral-400 hover:text-primary transition duration-150">Contact</a></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
