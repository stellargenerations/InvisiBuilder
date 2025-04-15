import { FC } from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo: FC<LogoProps> = ({ className = "", size = "md" }) => {
  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizes[size]}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className={`${sizes[size]}`}>
          <g fill="#BF9D5E">
            <path d="M100 40c-33.1 0-60 26.9-60 60s26.9 60 60 60 60-26.9 60-60-26.9-60-60-60zm0 110c-27.6 0-50-22.4-50-50s22.4-50 50-50 50 22.4 50 50-22.4 50-50 50z"/>
            <path d="M100 70c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z"/>
            <path d="M100 40V20m0 160v-20m60-100h20M20 100h20"/>
            <circle cx="100" cy="100" r="8"/>
          </g>
        </svg>
      </div>
      <span className="text-primary-dark font-heading font-bold text-xl ml-2">INVISIBUILDER</span>
    </div>
  );
};

export default Logo;
