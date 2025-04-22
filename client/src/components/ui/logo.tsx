
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
      <img 
        src="/invisibuilder-logo.png" 
        alt="Invisibuilder Logo" 
        className={`${sizes[size]}`}
      />
    </div>
  );
};

export default Logo;
