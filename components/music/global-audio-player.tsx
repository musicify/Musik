"use client";

import { useAudioPlayer } from "@/lib/hooks/use-audio-player";
import { Play, Pause, Volume2, VolumeX, X, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function GlobalAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    toggle,
    seek,
    setVolume,
    pause,
  } = useAudioPlayer();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border"
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Track Info */}
            <div className="flex items-center gap-3 min-w-[200px]">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                  currentTrack.coverGradient || "from-purple-500 to-pink-500"
                } flex-shrink-0 relative overflow-hidden`}
              >
                {isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="flex items-end gap-0.5 h-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-white rounded-full animate-equalizer"
                          style={{
                            animationDelay: `${i * 0.15}s`,
                            height: "100%",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{currentTrack.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8" disabled>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="default"
                  className="h-10 w-10 rounded-full"
                  onClick={toggle}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" disabled>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-2 w-full max-w-md">
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={([value]) => seek(value)}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-10">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume & Close */}
            <div className="flex items-center gap-3 min-w-[150px] justify-end">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                >
                  {volume > 0 ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={([value]) => setVolume(value / 100)}
                  className="w-20"
                />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={pause}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

