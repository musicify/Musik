"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  Award,
  Check,
  ChevronRight,
  Music,
  Clock,
  Users,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mock directors data
const directors = [
  {
    id: "dir1",
    name: "Max Müller",
    bio: "Spezialisiert auf Electronic und Cinematic Music mit über 10 Jahren Erfahrung in der Musikproduktion.",
    specialization: ["Electronic", "Cinematic", "Synthwave"],
    priceRange: "ab €200",
    badge: "PREMIUM",
    rating: 4.9,
    reviews: 47,
    projects: 127,
    responseTime: "< 2h",
    completionRate: 98,
    avatarGradient: "from-violet-500 to-purple-600",
    tracks: 47,
    featured: true,
  },
  {
    id: "dir2",
    name: "Sarah Schmidt",
    bio: "Komponistin für Film und Werbung. Studierte klassische Komposition an der UdK Berlin.",
    specialization: ["Orchestral", "Film", "Ambient"],
    priceRange: "ab €350",
    badge: "TOP_SELLER",
    rating: 4.8,
    reviews: 89,
    projects: 89,
    responseTime: "< 4h",
    completionRate: 96,
    avatarGradient: "from-amber-500 to-yellow-500",
    tracks: 32,
    featured: true,
  },
  {
    id: "dir3",
    name: "Tom Weber",
    bio: "Hip-Hop und Pop Producer aus Hamburg. Arbeitet mit Labels wie Universal und Sony.",
    specialization: ["Hip-Hop", "Pop", "R&B"],
    priceRange: "ab €150",
    badge: "VERIFIED",
    rating: 4.7,
    reviews: 64,
    projects: 64,
    responseTime: "< 6h",
    completionRate: 94,
    avatarGradient: "from-cyan-500 to-teal-500",
    tracks: 28,
    featured: false,
  },
  {
    id: "dir4",
    name: "Lisa Braun",
    bio: "Ambient und Meditation Music Spezialistin. Perfekt für entspannende und atmosphärische Projekte.",
    specialization: ["Ambient", "Meditation", "Nature Sounds"],
    priceRange: "ab €120",
    badge: "VERIFIED",
    rating: 4.9,
    reviews: 41,
    projects: 41,
    responseTime: "< 8h",
    completionRate: 99,
    avatarGradient: "from-rose-500 to-orange-400",
    tracks: 56,
    featured: false,
  },
  {
    id: "dir5",
    name: "Chris Night",
    bio: "Dark Ambient und Industrial Producer. Spezialisiert auf atmosphärische, düstere Soundscapes.",
    specialization: ["Dark Ambient", "Industrial", "Experimental"],
    priceRange: "ab €180",
    badge: null,
    rating: 4.6,
    reviews: 23,
    projects: 23,
    responseTime: "< 12h",
    completionRate: 92,
    avatarGradient: "from-gray-600 to-gray-800",
    tracks: 19,
    featured: false,
  },
  {
    id: "dir6",
    name: "Nina Hofmann",
    bio: "Corporate und Werbemusik Expertin. Über 500 produzierte Werbespots für große Marken.",
    specialization: ["Corporate", "Advertising", "Jingles"],
    priceRange: "ab €250",
    badge: "PREMIUM",
    rating: 4.8,
    reviews: 156,
    projects: 156,
    responseTime: "< 3h",
    completionRate: 97,
    avatarGradient: "from-emerald-500 to-teal-600",
    tracks: 78,
    featured: true,
  },
];

const specializations = [
  "Electronic",
  "Cinematic",
  "Hip-Hop",
  "Pop",
  "Orchestral",
  "Ambient",
  "Rock",
  "Corporate",
  "Film",
  "Advertising",
];

const sortOptions = [
  { value: "rating", label: "Beste Bewertung" },
  { value: "projects", label: "Meiste Projekte" },
  { value: "price_asc", label: "Preis aufsteigend" },
  { value: "price_desc", label: "Preis absteigend" },
  { value: "response", label: "Schnellste Antwort" },
];

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

function DirectorCard({ director }: { director: (typeof directors)[0] }) {
  return (
    <Link href={`/directors/${director.id}`}>
      <Card className="bg-card border-border/50 overflow-hidden card-hover h-full">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback
                className={`bg-gradient-to-br ${director.avatarGradient} text-white text-xl font-serif`}
              >
                {director.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{director.name}</h3>
                <BadgeIcon badge={director.badge} />
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {director.rating}
                </span>
                <span className="text-muted-foreground">
                  ({director.reviews} Bewertungen)
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {director.bio}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {director.specialization.slice(0, 3).map((spec) => (
              <Badge key={spec} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-t border-border/50">
            <div className="text-center">
              <p className="font-semibold">{director.projects}</p>
              <p className="text-xs text-muted-foreground">Projekte</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{director.responseTime}</p>
              <p className="text-xs text-muted-foreground">Antwort</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{director.completionRate}%</p>
              <p className="text-xs text-muted-foreground">Erfolg</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <span className="text-primary font-semibold">
              {director.priceRange}
            </span>
            <Button size="sm" variant="secondary">
              Profil ansehen
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function FilterSidebar({
  selectedSpecs,
  setSelectedSpecs,
}: {
  selectedSpecs: string[];
  setSelectedSpecs: (specs: string[]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Spezialisierung</h3>
        <div className="space-y-3">
          {specializations.map((spec) => (
            <label key={spec} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedSpecs.includes(spec)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSpecs([...selectedSpecs, spec]);
                  } else {
                    setSelectedSpecs(selectedSpecs.filter((s) => s !== spec));
                  }
                }}
              />
              <span className="text-sm">{spec}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Badge</h3>
        <div className="space-y-3">
          {["PREMIUM", "TOP_SELLER", "VERIFIED"].map((badge) => (
            <label key={badge} className="flex items-center gap-3 cursor-pointer">
              <Checkbox />
              <span className="text-sm">{badge.replace("_", " ")}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DirectorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);

  // Filter directors
  const filteredDirectors = directors.filter((director) => {
    const matchesSearch =
      director.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      director.specialization.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesSpecs =
      selectedSpecs.length === 0 ||
      director.specialization.some((s) => selectedSpecs.includes(s));
    return matchesSearch && matchesSpecs;
  });

  // Sort directors
  const sortedDirectors = [...filteredDirectors].sort((a, b) => {
    switch (sortBy) {
      case "projects":
        return b.projects - a.projects;
      case "price_asc":
        return (
          parseInt(a.priceRange.replace(/\D/g, "")) -
          parseInt(b.priceRange.replace(/\D/g, ""))
        );
      case "price_desc":
        return (
          parseInt(b.priceRange.replace(/\D/g, "")) -
          parseInt(a.priceRange.replace(/\D/g, ""))
        );
      case "response":
        return (
          parseInt(a.responseTime.replace(/\D/g, "")) -
          parseInt(b.responseTime.replace(/\D/g, ""))
        );
      case "rating":
      default:
        return b.rating - a.rating;
    }
  });

  // Featured directors
  const featuredDirectors = sortedDirectors.filter((d) => d.featured);

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
              Unsere <span className="gradient-text">Komponisten</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Finde den perfekten Künstler für dein Projekt. Alle Komponisten
              sind verifiziert und liefern professionelle Qualität.
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
                placeholder="Suche nach Name oder Spezialisierung..."
                className="pl-12 h-14 text-lg bg-card/80 backdrop-blur border-border/50 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Directors */}
      {featuredDirectors.length > 0 && searchQuery === "" && (
        <section className="py-12 bg-card/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-2xl">Featured Komponisten</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDirectors.map((director) => (
                <DirectorCard key={director.id} director={director} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Directors */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filter</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar
                      selectedSpecs={selectedSpecs}
                      setSelectedSpecs={setSelectedSpecs}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              <span className="text-muted-foreground">
                {sortedDirectors.length} Komponisten
              </span>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
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
          </div>

          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <Card className="bg-card/50 border-border/50 sticky top-24">
                <CardContent className="p-6">
                  <FilterSidebar
                    selectedSpecs={selectedSpecs}
                    setSelectedSpecs={setSelectedSpecs}
                  />
                </CardContent>
              </Card>
            </aside>

            {/* Directors Grid */}
            <div className="flex-1">
              {sortedDirectors.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
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
                      setSelectedSpecs([]);
                    }}
                  >
                    Filter zurücksetzen
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedDirectors.map((director) => (
                    <motion.div
                      key={director.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <DirectorCard director={director} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
