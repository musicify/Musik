"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  src?: string;
  title?: string;
  artist?: string;
  coverImage?: string;
  coverGradient?: string;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
  compact?: boolean;
}

export function AudioPlayer({
  src,
  title = "Untitled",
  artist = "Unknown Artist",
  coverImage,
  coverGradient = "from-primary to-accent",
  onPlay,
  onPause,
  className,
  compact = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  // Generate waveform visualization data
  useEffect(() => {
    // Simulate waveform data (in production, you'd analyze the actual audio)
    const data = Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.2);
    setWaveformData(data);
  }, [src]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      onPause?.();
    } else {
      audioRef.current.play();
      onPlay?.();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, onPlay, onPause]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.7;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / waveformData.length;
      const progress = duration > 0 ? currentTime / duration : 0;

      waveformData.forEach((value, index) => {
        const x = index * barWidth;
        const barHeight = value * height * 0.8;
        const y = (height - barHeight) / 2;

        // Determine if this bar is played
        const isPlayed = index / waveformData.length < progress;

        // Set color based on progress
        ctx.fillStyle = isPlayed
          ? "hsl(var(--primary))"
          : "hsl(var(--muted-foreground) / 0.3)";

        // Draw bar with rounded corners
        const radius = barWidth * 0.3;
        ctx.beginPath();
        ctx.roundRect(x + 1, y, barWidth - 2, barHeight, radius);
        ctx.fill();
      });

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [waveformData, currentTime, duration, isPlaying]);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <Button
          size="icon"
          variant="secondary"
          className="w-10 h-10 rounded-full"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </Button>
        <div className="flex-1 h-8">
          <canvas ref={canvasRef} className="w-full h-full" width={200} height={32} />
        </div>
        <span className="text-xs text-muted-foreground w-12 text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl overflow-hidden",
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-center gap-6">
          {/* Album Cover / Visualizer */}
          <div
            className={cn(
              "relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0",
              `bg-gradient-to-br ${coverGradient}`
            )}
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                {isPlaying && (
                  <div className="flex items-end gap-1 h-8">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-white/80 rounded-full"
                        animate={{
                          height: [8, 24, 8],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Track Info & Controls */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{title}</h3>
            <p className="text-sm text-muted-foreground truncate">{artist}</p>

            {/* Waveform */}
            <div className="mt-4 relative h-12">
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-pointer"
                width={400}
                height={48}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const progress = x / rect.width;
                  handleSeek([progress * duration]);
                }}
              />
            </div>

            {/* Time */}
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="w-8 h-8">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>
            <Button size="icon" variant="ghost" className="w-8 h-8">
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}

