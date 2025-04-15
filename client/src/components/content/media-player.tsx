import { useState, useRef } from "react";

interface MediaPlayerProps {
  type: "video" | "image";
  src: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
}

const MediaPlayer = ({ type, src, title, description, thumbnail, duration }: MediaPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (type === "video" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (type === "image") {
    return (
      <div className="relative">
        <img src={src} alt={title} className="w-full h-auto rounded-lg" />
        {title && (
          <div className="mt-2">
            <h4 className="font-heading font-medium text-lg mb-1">{title}</h4>
            {description && <p className="text-sm text-neutral-800">{description}</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 rounded-lg overflow-hidden shadow-sm">
      <div className="relative">
        <div className="relative pb-[56.25%] h-0 bg-neutral-900">
          {!isPlaying ? (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  className="w-16 h-16 rounded-full bg-primary-dark bg-opacity-90 text-white flex items-center justify-center focus:outline-none hover:bg-opacity-100 transition duration-150" 
                  aria-label="Play video"
                  onClick={handlePlayClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <img 
                src={thumbnail || src} 
                alt={title} 
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
            </>
          ) : (
            <video 
              ref={videoRef} 
              src={src} 
              className="absolute inset-0 w-full h-full object-cover" 
              controls 
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
            />
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="font-heading font-medium text-lg mb-2">{title}</h4>
        {description && <p className="text-sm text-neutral-800">{description}</p>}
        {duration && (
          <div className="flex items-center text-xs text-neutral-800 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{duration}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPlayer;
