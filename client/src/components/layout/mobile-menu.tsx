import { Link } from "wouter";
import SearchBar from "@/components/search/search-bar";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: { name: string; path: string }[];
}

const MobileMenu = ({ isOpen, navLinks }: MobileMenuProps) => {
  return (
    <div className={`md:hidden bg-neutral-100 shadow-inner ${isOpen ? "" : "hidden"}`}>
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {navLinks.map((link) => (
          <Link key={link.path} href={link.path}>
            <a className="block px-3 py-2 rounded-md text-base font-medium text-neutral-800 hover:bg-neutral-200 hover:text-primary-dark">
              {link.name}
            </a>
          </Link>
        ))}
        <div className="px-3 py-2">
          <SearchBar mobile />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
