import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Maximize, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface VideoPlayerProps {
  isWaiting: boolean;
  videoUrl?: string;
}

export const VideoPlayer = ({ isWaiting, videoUrl }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Default demo video URL - you can replace with your actual video
  const defaultVideoUrl = "/videos/videoplayback.mp4";
  const currentVideoUrl = videoUrl || defaultVideoUrl;

  useEffect(() => {
    if (isWaiting && !isPlaying) {
      handlePlay();
    }
  }, [isWaiting]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const handlePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (video && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-ai">
            <Play className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Video thư giãn</h2>
            <p className="text-sm text-muted-foreground">
              {isWaiting ? "Watch while processing..." : "Hãy xem video này trong khi chờ đợi kết quả nhé!!!!! >< ><"}
            </p>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <Card className="flex-1 bg-ai-surface border-border shadow-card overflow-hidden">
        <div className="relative h-full group">
          <video
            ref={videoRef}
            className="w-full h-full object-contain rounded-lg bg-black"
            src={currentVideoUrl}
            loop
            muted={volume === 0}
            playsInline
          >
            Your browser does not support the video tag.
          </video>

          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
              {/* Progress Bar */}
              <div 
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-ai-primary rounded-full transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={handlePlay}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={handleRestart}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-white" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => {
                        const newVolume = parseFloat(e.target.value);
                        setVolume(newVolume);
                        if (videoRef.current) {
                          videoRef.current.volume = newVolume;
                        }
                      }}
                      className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => {
                      if (videoRef.current) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          videoRef.current.requestFullscreen();
                        }
                      }
                    }}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Play Button Overlay (when not playing) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                className="bg-ai-primary hover:bg-ai-primary/90 text-white rounded-full p-6 shadow-glow"
                onClick={handlePlay}
              >
                <Play className="h-8 w-8 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Video Info */}
      {isWaiting && (
        <Card className="p-4 bg-ai-surface border-border shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-ai-primary rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Mô hình đang xử lý, hãy đợi trong giây lát...
              </span>
            </div>
            <div className="text-sm text-ai-primary font-medium">
              {isPlaying ? "Playing" : "Paused"}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};