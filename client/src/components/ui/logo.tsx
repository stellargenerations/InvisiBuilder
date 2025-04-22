
import { FC } from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo: FC<LogoProps> = ({ className = "", size = "md" }) => {
  const sizes = {
    sm: "h-12", // Increased by 50% from h-8
    md: "h-14", // Increased by 50% from h-10 (using h-14 as Tailwind doesn't have h-15)
    lg: "h-16", // Increased by 50% from h-12 (using h-16 which is 4rem)
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/invisibuilder-logo.png" 
        alt="Invisibuilder Logo" 
        className={`${sizes[size]}`}
      />
    </div>
  );
};

export default Logo;
