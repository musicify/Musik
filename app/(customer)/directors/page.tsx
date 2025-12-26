"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  Award,
  Check,
  Clock,
  Briefcase,
  ChevronRight,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENRES } from "@/lib/constants";

// Mock directors data
const mockDirectors = [
  {
    id: "dir1",
    name: "Max Müller",
    bio: "Spezialist für Electronic und Cinematic Music mit über 10 Jahren Erfahrung.",
    specialization: ["Electronic", "Cinematic", "Ambient"],
    priceRangeMin: 200,
    priceRangeMax: 800,
    badge: "PREMIUM" as const,
    rating: 4.9,
    reviewCount: 47,
    responseTime: 4,
    totalProjects: 127,
    avatarGradient: "from-violet-500 to-purple-600",
  },
  {
    id: "dir2",
    name: "Sarah Schmidt",
    bio: "Komponistin für orchestrale Filmmusik und emotionale Soundtracks.",
    specialization: ["Orchestral", "Film", "Classical"],
    priceRangeMin: 350,
    priceRangeMax: 1200,
    badge: "TOP_SELLER" as const,
    rating: 4.8,
    reviewCount: 89,
    responseTime: 6,
    totalProjects: 89,
    avatarGradient: "from-amber-500 to-yellow-500",
  },
  {
    id: "dir3",
    name: "Tom Weber",
    bio: "Urban Music Producer mit Fokus auf Hip-Hop, Pop und R&B.",
    specialization: ["Hip-Hop", "Pop", "R&B"],
    priceRangeMin: 150,
    priceRangeMax: 500,
    badge: "VERIFIED" as const,
    rating: 4.7,
    reviewCount: 64,
    responseTime: 8,
    totalProjects: 64,
    avatarGradient: "from-cyan-500 to-teal-500",
  },
  {
    id: "dir4",
    name: "Lisa Braun",
    bio: "Ambient und Electronic Producer für entspannte, atmosphärische Klänge.",
    specialization: ["Ambient", "Electronic", "Chill"],
    priceRangeMin: 180,
    priceRangeMax: 600,
    badge: "VERIFIED" as const,
    rating: 4.6,
    reviewCount: 42,
    responseTime: 12,
    totalProjects: 42,
    avatarGradient: "from-rose-500 to-pink-500",
  },
  {
    id: "dir5",
    name: "Chris Night",
    bio: "Experimenteller Künstler für Dark Ambient und atmosphärische Texturen.",
    specialization: ["Ambient", "Experimental", "Dark"],
    priceRangeMin: 200,
    priceRangeMax: 700,
    badge: "VERIFIED" as const,
    rating: 4.5,
    reviewCount: 28,
    responseTime: 10,
    totalProjects: 28,
    avatarGradient: "from-gray-600 to-gray-800",
  },
  {
    id: "dir6",
    name: "Emma Sound",
    bio: "Pop und R&B Producerin mit modernem, radiofreundlichem Sound.",
    specialization: ["Pop", "R&B", "Dance"],
    priceRangeMin: 250,
    priceRangeMax: 800,
    badge: "TOP_SELLER" as const,
    rating: 4.8,
    reviewCount: 72,
    responseTime: 5,
    totalProjects: 72,
    avatarGradient: "from-pink-500 to-orange-400",
  },
];

function DirectorCard({ director }: { director: (typeof mockDirectors)[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link href={`/directors/${director.id}`}>
        <Card className="bg-card border-border/50 hover:border-border transition-all card-hover">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <Avatar className="w-16 h-16">
                <AvatarFallback
                  className={`bg-gradient-to-br ${director.avatarGradient} text-white text-2xl font-serif`}
                >
                  {director.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{director.name}</h3>
                  <Badge
                    className={
                      director.badge === "PREMIUM"
                        ? "badge-premium"
                        : director.badge === "TOP_SELLER"
                        ? "badge-top-seller"
                        : "badge-verified"
                    }
                  >
                    {director.badge === "PREMIUM" && (
                      <Award className="w-3 h-3 mr-1" />
                    )}
                    {director.badge === "TOP_SELLER" && (
                      <Star className="w-3 h-3 mr-1" />
                    )}
                    {director.badge === "VERIFIED" && (
                      <Check className="w-3 h-3 mr-1" />
                    )}
                    {director.badge.replace("_", " ")}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {director.bio}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {director.specialization.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {director.rating} ({director.reviewCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />~{director.responseTime}h
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {director.totalProjects}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-sm text-muted-foreground">ab</p>
                <p className="text-xl font-serif text-primary">
                  €{director.priceRangeMin}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function DirectorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState("rating");

  // Filter and sort directors
  const filteredDirectors = mockDirectors
    .filter((director) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !director.name.toLowerCase().includes(query) &&
          !director.bio.toLowerCase().includes(query) &&
          !director.specialization.some((s) => s.toLowerCase().includes(query))
        ) {
          return false;
        }
      }
      if (selectedGenre !== "all") {
        if (!director.specialization.includes(selectedGenre)) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "projects":
          return b.totalProjects - a.totalProjects;
        case "price_asc":
          return a.priceRangeMin - b.priceRangeMin;
        case "price_desc":
          return b.priceRangeMin - a.priceRangeMin;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge variant="secondary" className="mb-4">
                <Users className="w-3 h-3 mr-1" />
                {mockDirectors.length} Komponisten
              </Badge>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-4">
                Unsere <span className="gradient-text">Komponisten</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Finde den perfekten Künstler für dein Projekt. Alle unsere
                Komponisten sind verifiziert und liefern professionelle Qualität.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Suche nach Name, Genre oder Stil..."
                  className="pl-12 h-14 text-lg bg-card/80 backdrop-blur border-border/50 focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-[160px]">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Genres</SelectItem>
                {GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {filteredDirectors.length} Ergebnisse
            </span>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sortieren" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Beste Bewertung</SelectItem>
              <SelectItem value="projects">Meiste Projekte</SelectItem>
              <SelectItem value="price_asc">Preis aufsteigend</SelectItem>
              <SelectItem value="price_desc">Preis absteigend</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Directors Grid */}
        {filteredDirectors.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Keine Komponisten gefunden
            </h3>
            <p className="text-muted-foreground mb-4">
              Versuche andere Filter oder Suchbegriffe
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("all");
              }}
            >
              Filter zurücksetzen
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredDirectors.map((director, index) => (
              <motion.div
                key={director.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DirectorCard director={director} />
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 text-center"
        >
          <Card className="bg-card/50 border-border/50 p-8 md:p-12">
            <h2 className="font-serif text-2xl md:text-3xl mb-4">
              Du bist Komponist?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Werde Teil unserer Community und verdiene Geld mit deiner Musik.
              Verkaufe deine Tracks auf dem Marktplatz oder nimm individuelle
              Aufträge an.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Jetzt als Komponist registrieren
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}

