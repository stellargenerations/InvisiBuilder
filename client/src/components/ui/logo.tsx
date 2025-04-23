
import { FC } from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo: FC<LogoProps> = ({ className = "", size = "md" }) => {
  const sizes = {
    sm: "h-7",  // Smaller size
    md: "h-8",  // Medium size
    lg: "h-10", // Large size
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/images/builder-icon.png" 
        alt="Invisibuilder Logo" 
        className={`${sizes[size]} object-contain`}
      />
    </div>
  );
};

export default Logo;
