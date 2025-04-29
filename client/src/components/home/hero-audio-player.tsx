import { useState, useRef, useEffect } from "react";

interface HeroAudioPlayerProps {
  src: string;
  title: string;
  subtitle?: string;
}

const HeroAudioPlayer = ({ src, title, subtitle }: HeroAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentSeconds = audioRef.current.currentTime;
      setCurrentTime(formatTime(currentSeconds));
      
      const progressPercent = (currentSeconds / audioRef.current.duration) * 100;
      setProgress(progressPercent);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const widthPercent = (x / rect.width) * 100;
      setProgress(widthPercent);
      
      audioRef.current.currentTime = (widthPercent / 100) * audioRef.current.duration;
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(formatTime(audioRef.current.duration));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime("0:00");
      setProgress(0);
    };
    
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    }
    
    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, []);

  return (
    <div className="mt-8 bg-neutral-900/60 border border-primary/30 rounded-lg p-4 backdrop-blur-sm">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="flex items-center space-x-4">
        <button 
          className="w-12 h-12 rounded-full bg-primary text-neutral-900 flex items-center justify-center focus:outline-none hover:bg-primary-light transition duration-150 shadow-md" 
          aria-label={isPlaying ? "Pause podcast" : "Play podcast"}
          onClick={togglePlay}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className="text-sm font-medium text-white">{title}</div>
              {subtitle && <div className="text-xs text-neutral-400">{subtitle}</div>}
            </div>
            <div className="text-xs text-neutral-400 hidden sm:block">{currentTime} / {duration}</div>
          </div>
          
          <div className="relative" onClick={handleProgressBarClick} ref={progressBarRef}>
            <div className="bg-neutral-700 h-1.5 rounded-full">
              <div 
                className="bg-primary h-1.5 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2 sm:hidden">
        <div className="text-xs text-neutral-400">{currentTime}</div>
        <div className="text-xs text-neutral-400">{duration}</div>
      </div>
    </div>
  );
};

export default HeroAudioPlayer;