"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  ShoppingCart,
  Heart,
  Share2,
  Download,
  Clock,
  Music,
  Tag,
  Calendar,
  User,
  Star,
  Award,
  Check,
  ChevronRight,
  Info,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WaveformPlayer } from "@/components/music/waveform-player";
import { LICENSE_TYPES } from "@/lib/constants";

// Mock track data
const mockTrack = {
  id: "1",
  title: "Neon Dreams",
  description:
    "Ein energetischer Electronic-Track mit pulsierenden Synthesizern und treibenden Beats. Perfekt für dynamische Werbespots, Gaming-Content oder Tech-Präsentationen. Der Track baut sich langsam auf und explodiert in einem kraftvollen Drop.",
  artist: "Max Müller",
  artistId: "dir1",
  artistBio:
    "Max Müller ist ein preisgekrönter Komponist mit über 10 Jahren Erfahrung in der Musikproduktion. Spezialisiert auf Electronic und Cinematic Music.",
  artistBadge: "PREMIUM" as const,
  artistProjects: 127,
  artistRating: 4.9,
  genre: "Electronic",
  subgenre: "Synthwave",
  mood: "Energetic",
  useCase: "Werbung",
  era: "Modern",
  duration: 204,
  bpm: 128,
  key: "A Minor",
  structure: "Full Track",
  tags: ["Electronic", "Energetic", "Synth", "Modern", "Werbung", "Dynamic"],
  audioUrl: "/audio/preview.mp3", // Mock URL
  coverGradient: "from-purple-500 to-pink-500",
  pricePersonal: 29,
  priceCommercial: 49,
  priceEnterprise: 199,
  priceExclusive: 990,
  playCount: 12540,
  purchaseCount: 234,
  createdAt: "2024-01-15",
  isNew: true,
};

// Mock similar tracks
const similarTracks = [
  {
    id: "5",
    title: "Digital Pulse",
    artist: "Max Müller",
    genre: "Electronic",
    price: 55,
    duration: 215,
    coverGradient: "from-violet-500 to-indigo-600",
  },
  {
    id: "3",
    title: "Urban Flow",
    artist: "Tom Weber",
    genre: "Hip-Hop",
    price: 39,
    duration: 178,
    coverGradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "8",
    title: "Summer Vibes",
    artist: "Lisa Braun",
    genre: "Pop",
    price: 49,
    duration: 198,
    coverGradient: "from-pink-400 to-purple-500",
  },
];

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function LicenseTable({
  selectedLicense,
  onSelect,
}: {
  selectedLicense: string;
  onSelect: (license: string) => void;
}) {
  const licenses = [
    {
      type: "PERSONAL",
      name: "Personal",
      icon: "🎵",
      price: mockTrack.pricePersonal,
      description: "Für private Projekte",
      features: [
        "Private Nutzung",
        "Hobbyprojekte",
        "Social Media (nicht monetarisiert)",
      ],
      popular: false,
    },
    {
      type: "COMMERCIAL",
      name: "Commercial",
      icon: "🎬",
      price: mockTrack.priceCommercial,
      description: "Für kommerzielle Projekte",
      features: [
        "YouTube monetarisiert",
        "Social Media Ads",
        "Bis 100K Reichweite",
      ],
      popular: true,
    },
    {
      type: "ENTERPRISE",
      name: "Enterprise",
      icon: "🏢",
      price: mockTrack.priceEnterprise,
      description: "Für große Kampagnen",
      features: ["Unbegrenzte Reichweite", "TV & Radio", "Weltweite Nutzung"],
      popular: false,
    },
    {
      type: "EXCLUSIVE",
      name: "Exclusive",
      icon: "🔒",
      price: mockTrack.priceExclusive,
      description: "Exklusivrechte",
      features: [
        "Alle Rechte übertragen",
        "Track wird entfernt",
        "Einzigartige Nutzung",
      ],
      popular: false,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {licenses.map((license) => (
        <Card
          key={license.type}
          className={`cursor-pointer transition-all relative ${
            selectedLicense === license.type
              ? "border-primary shadow-glow-sm"
              : "border-border/50 hover:border-border"
          }`}
          onClick={() => onSelect(license.type)}
        >
          {license.popular && (
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">
                Beliebt
              </Badge>
            </div>
          )}
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{license.icon}</span>
              {selectedLicense === license.type && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </div>
            <h4 className="font-semibold mb-1">{license.name}</h4>
            <p className="text-2xl font-serif mb-2">€{license.price}</p>
            <p className="text-xs text-muted-foreground mb-3">
              {license.description}
            </p>
            <ul className="space-y-1.5">
              {license.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Check className="w-3 h-3 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function TrackDetailPage() {
  const params = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState("COMMERCIAL");

  const selectedLicenseData = LICENSE_TYPES.find(
    (l) => l.type === selectedLicense
  );
  const currentPrice =
    selectedLicense === "PERSONAL"
      ? mockTrack.pricePersonal
      : selectedLicense === "COMMERCIAL"
      ? mockTrack.priceCommercial
      : selectedLicense === "ENTERPRISE"
      ? mockTrack.priceEnterprise
      : mockTrack.priceExclusive;

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href="/marketplace"
            className="hover:text-foreground transition-colors"
          >
            Musik kaufen
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{mockTrack.title}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Left Column - Track Info */}
          <div className="space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row gap-6"
            >
              {/* Cover */}
              <div
                className={`relative w-full md:w-64 aspect-square rounded-2xl bg-gradient-to-br ${mockTrack.coverGradient} flex-shrink-0 shadow-2xl`}
              >
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors rounded-2xl"
                >
                  {isPlaying ? (
                    <Pause className="w-16 h-16 text-white" />
                  ) : (
                    <Play className="w-16 h-16 text-white ml-2" />
                  )}
                </button>
                {mockTrack.isNew && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">
                      Neu
                    </Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-serif text-3xl md:text-4xl mb-2">
                      {mockTrack.title}
                    </h1>
                    <Link
                      href={`/directors/${mockTrack.artistId}`}
                      className="inline-flex items-center gap-2 text-lg text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {mockTrack.artist}
                      {mockTrack.artistBadge === "PREMIUM" && (
                        <Badge className="badge-premium">
                          <Award className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setIsLiked(!isLiked)}
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                isLiked ? "fill-red-500 text-red-500" : ""
                              }`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Merken</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="outline">
                            <Share2 className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Teilen</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary">{mockTrack.genre}</Badge>
                  <Badge variant="secondary">{mockTrack.mood}</Badge>
                  <Badge variant="secondary">{mockTrack.useCase}</Badge>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatDuration(mockTrack.duration)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Music className="w-4 h-4" />
                    {mockTrack.bpm} BPM
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    {mockTrack.key}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Headphones className="w-4 h-4" />
                    {mockTrack.playCount.toLocaleString()} Plays
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Audio Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <WaveformPlayer
                audioUrl={mockTrack.audioUrl}
                title={mockTrack.title}
                artist={mockTrack.artist}
              />
            </motion.div>

            {/* License Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-serif text-2xl mb-4">Lizenz wählen</h2>
              <LicenseTable
                selectedLicense={selectedLicense}
                onSelect={setSelectedLicense}
              />
              <div className="mt-4">
                <Link
                  href="/licensing"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <Info className="w-4 h-4" />
                  Mehr über Lizenzmodelle erfahren
                </Link>
              </div>
            </motion.div>

            {/* Tabs - Description, Details, Artist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Tabs defaultValue="description">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="description">Beschreibung</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="artist">Künstler</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-4">
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {mockTrack.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {mockTrack.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="mt-4">
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-6">
                      <dl className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="text-muted-foreground">Genre</dt>
                          <dd className="font-medium">{mockTrack.genre}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Subgenre</dt>
                          <dd className="font-medium">{mockTrack.subgenre}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Stimmung</dt>
                          <dd className="font-medium">{mockTrack.mood}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Verwendung</dt>
                          <dd className="font-medium">{mockTrack.useCase}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">BPM</dt>
                          <dd className="font-medium">{mockTrack.bpm}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Tonart</dt>
                          <dd className="font-medium">{mockTrack.key}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Struktur</dt>
                          <dd className="font-medium">{mockTrack.structure}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Epoche</dt>
                          <dd className="font-medium">{mockTrack.era}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="artist" className="mt-4">
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-serif">
                          {mockTrack.artist.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">
                              {mockTrack.artist}
                            </h3>
                            <Badge className="badge-premium">
                              <Award className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              {mockTrack.artistRating}
                            </span>
                            <span>{mockTrack.artistProjects} Projekte</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {mockTrack.artistBio}
                          </p>
                          <Link href={`/directors/${mockTrack.artistId}`}>
                            <Button variant="outline" size="sm">
                              Profil ansehen
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Similar Tracks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-2xl">Ähnliche Tracks</h2>
                <Link href="/marketplace">
                  <Button variant="ghost" size="sm">
                    Alle ansehen
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {similarTracks.map((track) => (
                  <Link key={track.id} href={`/track/${track.id}`}>
                    <Card className="bg-card border-border/50 overflow-hidden card-hover">
                      <CardContent className="p-0">
                        <div
                          className={`aspect-square bg-gradient-to-br ${track.coverGradient}`}
                        />
                        <div className="p-3">
                          <h4 className="font-medium truncate">{track.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {track.artist}
                          </p>
                          <div className="flex items-center justify-between mt-2 text-sm">
                            <span className="text-muted-foreground">
                              {formatDuration(track.duration)}
                            </span>
                            <span className="font-semibold text-primary">
                              €{track.price}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:sticky lg:top-24 h-fit">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card border-border/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Kaufen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Selected License */}
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Lizenz
                      </span>
                      <Select
                        value={selectedLicense}
                        onValueChange={setSelectedLicense}
                      >
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERSONAL">🎵 Personal</SelectItem>
                          <SelectItem value="COMMERCIAL">
                            🎬 Commercial
                          </SelectItem>
                          <SelectItem value="ENTERPRISE">
                            🏢 Enterprise
                          </SelectItem>
                          <SelectItem value="EXCLUSIVE">
                            🔒 Exclusive
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedLicenseData?.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-center py-4">
                    <span className="text-4xl font-serif">€{currentPrice}</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      inkl. MwSt.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      In den Warenkorb
                    </Button>
                    <Button variant="outline" className="w-full h-12">
                      <Download className="w-5 h-5 mr-2" />
                      Vorschau herunterladen
                    </Button>
                  </div>

                  <Separator />

                  {/* License Features */}
                  <div>
                    <h4 className="font-medium mb-3">Inklusive:</h4>
                    <ul className="space-y-2">
                      {selectedLicenseData?.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      Sichere Zahlung
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      Sofort-Download
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

