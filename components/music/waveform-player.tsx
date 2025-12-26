"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface WaveformPlayerProps {
  audioUrl: string;
  title?: string;
  artist?: string;
  coverImage?: string;
  duration?: number;
  compact?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
}

export function WaveformPlayer({
  audioUrl,
  title,
  artist,
  coverImage,
  duration,
  compact = false,
  onPlay,
  onPause,
  onEnded,
  className,
}: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "hsl(var(--muted-foreground) / 0.3)",
      progressColor: "hsl(var(--primary))",
      cursorColor: "hsl(var(--foreground))",
      cursorWidth: 2,
      barWidth: compact ? 2 : 3,
      barGap: compact ? 1 : 2,
      barRadius: 2,
      height: compact ? 40 : 64,
      normalize: true,
      backend: "WebAudio",
    });

    wavesurfer.load(audioUrl);

    wavesurfer.on("ready", () => {
      setIsReady(true);
      setTotalDuration(wavesurfer.getDuration());
      wavesurfer.setVolume(volume);
    });

    wavesurfer.on("audioprocess", () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on("play", () => {
      setIsPlaying(true);
      onPlay?.();
    });

    wavesurfer.on("pause", () => {
      setIsPlaying(false);
      onPause?.();
    });

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
      onEnded?.();
    });

    wavesurferRef.current = wavesurfer;

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl, compact]);

  const togglePlay = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(newVolume);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (wavesurferRef.current) {
      if (isMuted) {
        wavesurferRef.current.setVolume(volume || 0.8);
        setIsMuted(false);
      } else {
        wavesurferRef.current.setVolume(0);
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  const skip = useCallback((seconds: number) => {
    if (wavesurferRef.current) {
      const newTime = Math.max(0, Math.min(currentTime + seconds, totalDuration));
      wavesurferRef.current.seekTo(newTime / totalDuration);
    }
  }, [currentTime, totalDuration]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20"
          onClick={togglePlay}
          disabled={!isReady}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-primary" />
          ) : (
            <Play className="w-4 h-4 text-primary ml-0.5" />
          )}
        </Button>
        <div ref={containerRef} className="flex-1 min-w-0" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("bg-card rounded-xl p-4 border border-border", className)}>
      {/* Track Info */}
      {(title || artist) && (
        <div className="flex items-center gap-4 mb-4">
          {coverImage && (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
              <img src={coverImage} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && <h4 className="font-medium truncate">{title}</h4>}
            {artist && <p className="text-sm text-muted-foreground truncate">{artist}</p>}
          </div>
        </div>
      )}

      {/* Waveform */}
      <div ref={containerRef} className="mb-4" />

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8"
            onClick={() => skip(-10)}
            disabled={!isReady}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90"
            onClick={togglePlay}
            disabled={!isReady}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8"
            onClick={() => skip(10)}
            disabled={!isReady}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(totalDuration)}</span>
        </div>

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
            step={0.1}
            className="w-24"
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
}

