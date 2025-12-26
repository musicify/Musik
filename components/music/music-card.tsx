"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  ShoppingCart,
  Heart,
  Clock,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  genre: string;
  subgenre?: string;
  mood?: string;
  duration: string;
  price: number;
  coverImage?: string;
  coverGradient?: string;
  licenseType?: string;
  isPlaying?: boolean;
  isFavorite?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  className?: string;
}

export function MusicCard({
  id,
  title,
  artist,
  artistId,
  genre,
  subgenre,
  mood,
  duration,
  price,
  coverImage,
  coverGradient = "from-primary to-accent",
  licenseType = "Commercial",
  isPlaying = false,
  isFavorite = false,
  onPlay,
  onPause,
  onAddToCart,
  onToggleFavorite,
  className,
}: MusicCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        "group bg-card border-border/50 overflow-hidden transition-all duration-300 hover:-translate-y-1",
        isPlaying && "border-primary/50 shadow-glow-sm",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Cover */}
        <div className="relative aspect-square">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "w-full h-full bg-gradient-to-br",
                coverGradient
              )}
            />
          )}

          {/* Play Button Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered || isPlaying ? 1 : 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity"
          >
            <Button
              size="icon"
              className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90 shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                isPlaying ? onPause?.() : onPlay?.();
              }}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>
          </motion.div>

          {/* Equalizer animation when playing */}
          {isPlaying && (
            <div className="absolute bottom-4 left-4 flex items-end gap-1 h-6">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white rounded-full"
                  animate={{
                    height: ["20%", "100%", "20%"],
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

          {/* Favorite Button */}
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "absolute top-3 right-3 w-8 h-8 bg-black/20 backdrop-blur hover:bg-black/40",
              isHovered || isFavorite ? "opacity-100" : "opacity-0",
              isFavorite && "text-red-500"
            )}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite?.();
            }}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </Button>

          {/* License Badge */}
          <Badge
            className={cn(
              "absolute top-3 left-3 text-xs",
              licenseType === "Commercial"
                ? "bg-blue-500/80"
                : licenseType === "Enterprise"
                ? "bg-purple-500/80"
                : licenseType === "Exclusive"
                ? "bg-amber-500/80"
                : "bg-green-500/80"
            )}
          >
            {licenseType}
          </Badge>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <Link href={`/marketplace/${id}`}>
                <h3 className="font-semibold truncate hover:text-primary transition-colors">
                  {title}
                </h3>
              </Link>
              {artistId ? (
                <Link
                  href={`/directors/${artistId}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {artist}
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">{artist}</p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="w-8 h-8 -mr-2">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Zur Playlist hinzufügen</DropdownMenuItem>
                <DropdownMenuItem>Ähnliche Tracks</DropdownMenuItem>
                <DropdownMenuItem>Teilen</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge variant="secondary" className="text-xs font-normal">
              {genre}
            </Badge>
            {mood && (
              <Badge variant="secondary" className="text-xs font-normal">
                {mood}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {duration}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">€{price}</span>
              <Button
                size="sm"
                variant="secondary"
                className="h-8"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart?.();
                }}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

