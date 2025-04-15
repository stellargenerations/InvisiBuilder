import { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  src: string;
  title: string;
  duration: string;
}

const AudioPlayer = ({ src, title, duration }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
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
    }
    
    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
      }
    };
  }, []);

  return (
    <div className="bg-neutral-200 rounded-md p-3">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="w-10 h-10 rounded-full bg-primary-dark text-white flex items-center justify-center focus:outline-none hover:bg-primary transition duration-150" 
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
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
          <div className="ml-3">
            <div className="text-sm font-medium">{title}</div>
            <div className="text-xs text-neutral-800">{duration}</div>
          </div>
        </div>
        <div className="text-sm">{currentTime} / {duration}</div>
      </div>
      
      <div className="mt-2 relative" onClick={handleProgressBarClick} ref={progressBarRef}>
        <div className="bg-neutral-300 h-2 rounded-full">
          <div 
            className="bg-primary h-2 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary-dark rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
