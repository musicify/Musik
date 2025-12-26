"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Play,
  Pause,
  ShoppingCart,
  Heart,
  Clock,
  LayoutGrid,
  List,
  ChevronDown,
  Music as MusicIcon,
  Star,
  Check,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MusicFilterPanel,
  MusicFilterSheet,
  defaultFilters,
  type MusicFilterValues,
} from "@/components/filters/music-filter-panel";
import { useCart } from "@/hooks/use-cart";

// Mock data for tracks
const mockTracks = [
  {
    id: "1",
    title: "Neon Dreams",
    artist: "Max Müller",
    artistId: "dir1",
    genre: "Electronic",
    mood: "Energetic",
    duration: 204, // 3:24
    price: 49,
    priceCommercial: 89,
    priceEnterprise: 199,
    coverGradient: "from-purple-500 to-pink-500",
    badge: "PREMIUM" as const,
    plays: 12540,
    isNew: true,
  },
  {
    id: "2",
    title: "Epic Horizon",
    artist: "Sarah Schmidt",
    artistId: "dir2",
    genre: "Cinematic",
    mood: "Inspiring",
    duration: 252, // 4:12
    price: 79,
    priceCommercial: 149,
    priceEnterprise: 349,
    coverGradient: "from-amber-500 to-orange-600",
    badge: "TOP_SELLER" as const,
    plays: 8920,
    isNew: false,
  },
  {
    id: "3",
    title: "Urban Flow",
    artist: "Tom Weber",
    artistId: "dir3",
    genre: "Hip-Hop",
    mood: "Cool",
    duration: 178, // 2:58
    price: 39,
    priceCommercial: 69,
    priceEnterprise: 159,
    coverGradient: "from-cyan-500 to-blue-600",
    badge: "VERIFIED" as const,
    plays: 5670,
    isNew: true,
  },
  {
    id: "4",
    title: "Sunset Waves",
    artist: "Lisa Braun",
    artistId: "dir4",
    genre: "Ambient",
    mood: "Relaxed",
    duration: 330, // 5:30
    price: 59,
    priceCommercial: 109,
    priceEnterprise: 249,
    coverGradient: "from-rose-500 to-orange-400",
    badge: null,
    plays: 3450,
    isNew: false,
  },
  {
    id: "5",
    title: "Digital Pulse",
    artist: "Max Müller",
    artistId: "dir1",
    genre: "Electronic",
    mood: "Energetic",
    duration: 215,
    price: 55,
    priceCommercial: 99,
    priceEnterprise: 219,
    coverGradient: "from-violet-500 to-indigo-600",
    badge: "PREMIUM" as const,
    plays: 9800,
    isNew: false,
  },
  {
    id: "6",
    title: "Morning Light",
    artist: "Sarah Schmidt",
    artistId: "dir2",
    genre: "Cinematic",
    mood: "Uplifting",
    duration: 284,
    price: 69,
    priceCommercial: 129,
    priceEnterprise: 299,
    coverGradient: "from-yellow-400 to-orange-500",
    badge: "TOP_SELLER" as const,
    plays: 7230,
    isNew: true,
  },
  {
    id: "7",
    title: "Dark Matter",
    artist: "Chris Night",
    artistId: "dir5",
    genre: "Ambient",
    mood: "Dark",
    duration: 402,
    price: 45,
    priceCommercial: 85,
    priceEnterprise: 189,
    coverGradient: "from-gray-700 to-gray-900",
    badge: null,
    plays: 2340,
    isNew: false,
  },
  {
    id: "8",
    title: "Summer Vibes",
    artist: "Lisa Braun",
    artistId: "dir4",
    genre: "Pop",
    mood: "Happy",
    duration: 198,
    price: 49,
    priceCommercial: 89,
    priceEnterprise: 199,
    coverGradient: "from-pink-400 to-purple-500",
    badge: null,
    plays: 6780,
    isNew: true,
  },
];

const sortOptions = [
  { value: "popular", label: "Beliebt" },
  { value: "newest", label: "Neueste" },
  { value: "price_asc", label: "Preis aufsteigend" },
  { value: "price_desc", label: "Preis absteigend" },
];

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function BadgeIcon({ badge }: { badge: string | null }) {
  if (!badge) return null;
  
  const badgeConfig = {
    PREMIUM: { icon: Award, className: "badge-premium" },
    TOP_SELLER: { icon: Star, className: "badge-top-seller" },
    VERIFIED: { icon: Check, className: "badge-verified" },
  };

  const config = badgeConfig[badge as keyof typeof badgeConfig];
  if (!config) return null;

  return (
    <Badge className={config.className}>
      <config.icon className="w-3 h-3 mr-1" />
      {badge.replace("_", " ")}
    </Badge>
  );
}

function TrackCard({
  track,
  isPlaying,
  onPlayToggle,
  onAddToCart,
  viewMode,
}: {
  track: (typeof mockTracks)[0];
  isPlaying: boolean;
  onPlayToggle: () => void;
  onAddToCart: () => void;
  viewMode: "grid" | "list";
}) {
  const [isLiked, setIsLiked] = useState(false);

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group"
      >
        <Card className="bg-card border-border/50 hover:border-border transition-colors">
          <CardContent className="p-3 flex items-center gap-4">
            {/* Cover */}
            <div
              className={`relative w-14 h-14 rounded-lg bg-gradient-to-br ${track.coverGradient} flex-shrink-0`}
            >
              <button
                onClick={onPlayToggle}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>
              {isPlaying && (
                <div className="absolute bottom-1 left-1 flex items-end gap-0.5 h-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-white rounded-full animate-equalizer"
                      style={{
                        animationDelay: `${i * 0.15}s`,
                        height: "100%",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/track/${track.id}`}
                  className="font-medium truncate hover:text-primary transition-colors"
                >
                  {track.title}
                </Link>
                {track.isNew && (
                  <Badge variant="secondary" className="text-xs h-5">
                    Neu
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link
                  href={`/directors/${track.artistId}`}
                  className="hover:text-foreground transition-colors"
                >
                  {track.artist}
                </Link>
                <span>•</span>
                <span>{track.genre}</span>
                <span>•</span>
                <span>{track.mood}</span>
              </div>
            </div>

            {/* Badge */}
            <div className="hidden md:block">
              <BadgeIcon badge={track.badge} />
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(track.duration)}
            </div>

            {/* Price */}
            <div className="text-right min-w-[60px]">
              <span className="font-semibold text-primary">€{track.price}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isLiked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Merken</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button size="sm" className="h-8" onClick={onAddToCart}>
                <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                Kaufen
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="bg-card border-border/50 overflow-hidden card-hover">
        <CardContent className="p-0">
          {/* Cover */}
          <div
            className={`relative aspect-square bg-gradient-to-br ${track.coverGradient}`}
          >
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <Button
                size="icon"
                className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90"
                onClick={onPlayToggle}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
            </div>

            {/* Equalizer when playing */}
            {isPlaying && (
              <div className="absolute bottom-4 left-4 flex items-end gap-1 h-6">
                {[...Array(4)].map((_, i) => (
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
            )}

            {/* Like Button */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <Heart
                className={`w-4 h-4 ${
                  isLiked ? "fill-red-500 text-red-500" : "text-white"
                }`}
              />
            </button>

            {/* New Badge */}
            {track.isNew && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary text-primary-foreground">Neu</Badge>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <Link
                  href={`/track/${track.id}`}
                  className="font-semibold truncate block hover:text-primary transition-colors"
                >
                  {track.title}
                </Link>
                <Link
                  href={`/directors/${track.artistId}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {track.artist}
                </Link>
              </div>
              <BadgeIcon badge={track.badge} />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Badge variant="secondary" className="text-xs">
                {track.genre}
              </Badge>
              <span>•</span>
              <span>{track.mood}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(track.duration)}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">€{track.price}</span>
                <Button size="sm" variant="secondary" className="h-8" onClick={onAddToCart}>
                  <ShoppingCart className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MarketplacePage() {
  const [filters, setFilters] = useState<MusicFilterValues>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const { addToCart } = useCart();

  const handleAddToCart = useCallback((trackId: string) => {
    addToCart(trackId, "COMMERCIAL");
  }, [addToCart]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Filter and sort tracks
  const filteredTracks = useMemo(() => {
    let result = [...mockTracks];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (track) =>
          track.title.toLowerCase().includes(query) ||
          track.artist.toLowerCase().includes(query) ||
          track.genre.toLowerCase().includes(query) ||
          track.mood.toLowerCase().includes(query)
      );
    }

    // Apply genre filter
    if (filters.genres.length > 0) {
      result = result.filter((track) => filters.genres.includes(track.genre));
    }

    // Apply mood filter
    if (filters.moods.length > 0) {
      result = result.filter((track) => filters.moods.includes(track.mood));
    }

    // Apply use case filter (if tracks had useCase field, would filter here)
    // Note: Mock tracks don't have useCase, but filter is ready for real data
    // if (filters.useCases.length > 0) {
    //   result = result.filter((track) => 
    //     track.useCase && filters.useCases.includes(track.useCase)
    //   );
    // }

    // Apply era filter (if tracks had era field, would filter here)
    // Note: Mock tracks don't have era, but filter is ready for real data
    // if (filters.eras.length > 0) {
    //   result = result.filter((track) => 
    //     track.era && filters.eras.includes(track.era)
    //   );
    // }

    // Apply license type filter (if tracks had licenseType field, would filter here)
    // Note: Mock tracks don't have licenseType, but filter is ready for real data
    // if (filters.licenseTypes.length > 0) {
    //   result = result.filter((track) => 
    //     track.licenseType && filters.licenseTypes.includes(track.licenseType)
    //   );
    // }

    // Apply price filter
    result = result.filter(
      (track) =>
        track.price >= filters.priceRange[0] &&
        track.price <= filters.priceRange[1]
    );

    // Apply duration filter
    result = result.filter(
      (track) =>
        track.duration >= filters.durationRange[0] &&
        track.duration <= filters.durationRange[1]
    );

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
      default:
        result.sort((a, b) => b.plays - a.plays);
    }

    return result;
  }, [filters, searchQuery, sortBy]);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-4"
            >
              Musik <span className="gradient-text">entdecken</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Tausende professionelle Tracks - lizenziert und sofort verfügbar
              für deine Projekte.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Suche nach Titel, Künstler, Genre..."
                className="pl-12 h-14 text-lg bg-card/80 backdrop-blur border-border/50 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <MusicFilterSheet
              filters={filters}
              onFilterChange={setFilters}
              onReset={resetFilters}
              resultCount={filteredTracks.length}
            />
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {filteredTracks.length} Tracks
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Sortieren" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-border rounded-lg p-1">
              <Button
                size="icon"
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                className="w-8 h-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant={viewMode === "list" ? "secondary" : "ghost"}
                className="w-8 h-8"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex gap-8">
          {/* Desktop Filter Panel */}
          <MusicFilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onReset={resetFilters}
            resultCount={filteredTracks.length}
          />

          {/* Track Grid/List */}
          <div className="flex-1">
            {filteredTracks.length === 0 ? (
              <div className="text-center py-16">
                <MusicIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Keine Tracks gefunden
                </h3>
                <p className="text-muted-foreground mb-4">
                  Versuche andere Filter oder Suchbegriffe
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  Filter zurücksetzen
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredTracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      isPlaying={playingTrackId === track.id}
                      onPlayToggle={() =>
                        setPlayingTrackId(
                          playingTrackId === track.id ? null : track.id
                        )
                      }
                      onAddToCart={() => handleAddToCart(track.id)}
                      viewMode="grid"
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredTracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      isPlaying={playingTrackId === track.id}
                      onPlayToggle={() =>
                        setPlayingTrackId(
                          playingTrackId === track.id ? null : track.id
                        )
                      }
                      onAddToCart={() => handleAddToCart(track.id)}
                      viewMode="list"
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Load More */}
            {filteredTracks.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Mehr laden
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

