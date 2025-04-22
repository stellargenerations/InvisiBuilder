
import { FC } from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo: FC<LogoProps> = ({ className = "", size = "md" }) => {
  const sizes = {
    sm: "h-8",  // Original size
    md: "h-10", // Original size
    lg: "h-12", // Original size
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
