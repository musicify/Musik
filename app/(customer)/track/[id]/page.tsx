"use client";

import { useState } from "react";
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
  Calendar,
  Music,
  Star,
  Award,
  Check,
  ChevronRight,
  Info,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock track data
const track = {
  id: "1",
  title: "Neon Dreams",
  description:
    "Ein energetischer Electronic-Track mit pulsierenden Synthesizern und treibenden Beats. Perfekt für dynamische Werbevideos, Gaming-Content oder Tech-Präsentationen. Der Track baut sich langsam auf und erreicht einen kraftvollen Drop nach 1:20.",
  artist: {
    id: "dir1",
    name: "Max Müller",
    badge: "PREMIUM",
    avatarGradient: "from-violet-500 to-purple-600",
    tracks: 47,
    rating: 4.9,
  },
  genre: "Electronic",
  subgenre: "Synthwave",
  mood: "Energetic",
  style: "Modern",
  useCase: "Advertising, Gaming, Tech",
  structure: "Intro - Build - Drop - Breakdown - Drop - Outro",
  era: "Contemporary",
  tempo: 128,
  key: "A Minor",
  duration: 204,
  releaseDate: "2024-01-15",
  plays: 12540,
  coverGradient: "from-purple-500 to-pink-500",
  isNew: true,
  licenses: [
    {
      type: "PERSONAL",
      name: "Personal",
      icon: "🎵",
      price: 29,
      description: "Für private Projekte",
      features: [
        "Private Nutzung",
        "Hobbyprojekte",
        "Keine kommerzielle Verwendung",
        "Wasserzeichen-freier Download",
      ],
      restrictions: ["Keine monetarisierten Inhalte", "Keine Werbekampagnen"],
    },
    {
      type: "COMMERCIAL",
      name: "Commercial",
      icon: "🎬",
      price: 49,
      description: "Für kommerzielle Projekte",
      features: [
        "YouTube, Social Media",
        "Kleine Werbekampagnen",
        "Bis 100K Reichweite",
        "WAV + MP3 Download",
        "Lizenz-Zertifikat",
      ],
      restrictions: ["Keine TV/Kino-Nutzung", "Begrenzte Reichweite"],
      popular: true,
    },
    {
      type: "ENTERPRISE",
      name: "Enterprise",
      icon: "🏢",
      price: 199,
      description: "Für große Kampagnen",
      features: [
        "Unbegrenzte Reichweite",
        "TV & Film",
        "Große Werbekampagnen",
        "Alle Dateiformate",
        "Prioritäts-Support",
      ],
      restrictions: [],
    },
    {
      type: "EXCLUSIVE",
      name: "Exclusive",
      icon: "🔒",
      price: 999,
      description: "Exklusivrechte",
      features: [
        "Alle Rechte übertragen",
        "Track wird entfernt",
        "Einzigartige Nutzung",
        "Stems inklusive",
        "Full Buyout",
      ],
      restrictions: [],
    },
  ],
};

// Similar tracks mock
const similarTracks = [
  {
    id: "5",
    title: "Digital Pulse",
    artist: "Max Müller",
    genre: "Electronic",
    duration: 215,
    price: 55,
    coverGradient: "from-violet-500 to-indigo-600",
  },
  {
    id: "6",
    title: "Cyber Rush",
    artist: "Tom Weber",
    genre: "Electronic",
    duration: 198,
    price: 45,
    coverGradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "7",
    title: "Future Motion",
    artist: "Lisa Braun",
    genre: "Synthwave",
    duration: 226,
    price: 59,
    coverGradient: "from-pink-500 to-rose-600",
  },
];

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function TrackDetailPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState("COMMERCIAL");

  const currentLicense = track.licenses.find((l) => l.type === selectedLicense);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section with Track Info */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="absolute inset-0 pattern-dots opacity-20" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/marketplace" className="hover:text-foreground">
              Marktplatz
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/marketplace?genre=${track.genre}`}
              className="hover:text-foreground"
            >
              {track.genre}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{track.title}</span>
          </nav>

          <div className="grid lg:grid-cols-[400px,1fr] gap-12">
            {/* Cover & Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className={`relative aspect-square rounded-2xl bg-gradient-to-br ${track.coverGradient} shadow-2xl overflow-hidden`}
              >
                {/* Play Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xl">
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-black" />
                    ) : (
                      <Play className="w-8 h-8 text-black ml-1" />
                    )}
                  </div>
                </button>

                {/* Equalizer Animation */}
                {isPlaying && (
                  <div className="absolute bottom-6 left-6 flex items-end gap-1 h-8">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-white rounded-full animate-equalizer"
                        style={{
                          animationDelay: `${i * 0.15}s`,
                          height: "100%",
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {track.isNew && (
                    <Badge className="bg-primary text-primary-foreground">
                      Neu
                    </Badge>
                  )}
                </div>
              </div>

              {/* Waveform Placeholder */}
              <div className="mt-4 h-16 bg-card rounded-lg flex items-center justify-center border border-border/50">
                <div className="flex items-end gap-0.5 h-10">
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary/30 rounded-full"
                      style={{
                        height: `${20 + Math.random() * 80}%`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Track Stats */}
              <div className="mt-4 flex items-center justify-around py-4 bg-card rounded-lg border border-border/50">
                <div className="text-center">
                  <p className="text-2xl font-serif">{track.plays.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Plays</p>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <p className="text-2xl font-serif">{track.tempo}</p>
                  <p className="text-xs text-muted-foreground">BPM</p>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <p className="text-2xl font-serif">{track.key}</p>
                  <p className="text-xs text-muted-foreground">Tonart</p>
                </div>
              </div>
            </motion.div>

            {/* Track Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary">{track.genre}</Badge>
                  <Badge variant="outline">{track.mood}</Badge>
                </div>
                <h1 className="font-serif text-4xl lg:text-5xl mb-2">
                  {track.title}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(track.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(track.releaseDate)}
                  </span>
                </div>
              </div>

              {/* Artist Card */}
              <Link href={`/directors/${track.artist.id}`}>
                <Card className="bg-card/50 border-border/50 hover:border-border transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarFallback
                        className={`bg-gradient-to-br ${track.artist.avatarGradient} text-white text-lg font-serif`}
                      >
                        {track.artist.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{track.artist.name}</p>
                        <Badge className="badge-premium">
                          <Award className="w-3 h-3 mr-1" />
                          {track.artist.badge}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          {track.artist.rating}
                        </span>
                        <span>{track.artist.tracks} Tracks</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {track.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{track.subgenre}</Badge>
                <Badge variant="outline">{track.style}</Badge>
                {track.useCase.split(", ").map((use) => (
                  <Badge key={use} variant="outline">
                    {use}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* License Selection & Purchase */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl mb-8">Lizenz wählen</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {track.licenses.map((license) => (
              <Card
                key={license.type}
                className={`cursor-pointer transition-all ${
                  selectedLicense === license.type
                    ? "border-primary shadow-glow-sm"
                    : "border-border/50 hover:border-border"
                }`}
                onClick={() => setSelectedLicense(license.type)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{license.icon}</span>
                    {license.popular && (
                      <Badge className="bg-primary text-primary-foreground">
                        Beliebt
                      </Badge>
                    )}
                    {selectedLicense === license.type && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{license.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {license.description}
                  </p>
                  <p className="text-2xl font-serif">€{license.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected License Details */}
          {currentLicense && (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-[1fr,auto] gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{currentLicense.icon}</span>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {currentLicense.name} Lizenz
                        </h3>
                        <p className="text-muted-foreground">
                          {currentLicense.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          Inklusive
                        </h4>
                        <ul className="space-y-2">
                          {currentLicense.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <Check className="w-3.5 h-3.5 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {currentLicense.restrictions.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-amber-500" />
                            Einschränkungen
                          </h4>
                          <ul className="space-y-2">
                            {currentLicense.restrictions.map((restriction) => (
                              <li
                                key={restriction}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                {restriction}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                      <p className="text-4xl font-serif mb-1">
                        €{currentLicense.price}
                      </p>
                      <p className="text-sm text-muted-foreground">inkl. MwSt.</p>
                    </div>
                    <div className="space-y-2">
                      <Button
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg w-full"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        In den Warenkorb
                      </Button>
                      <p className="text-xs text-center text-muted-foreground flex items-center gap-1 justify-center">
                        <Shield className="w-3 h-3" />
                        Sichere Zahlung
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* License Comparison Table */}
      <section className="py-12 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl mb-8">Lizenz-Vergleich</h2>
          <Card className="border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Feature</TableHead>
                  <TableHead className="text-center">Personal</TableHead>
                  <TableHead className="text-center bg-primary/5">Commercial</TableHead>
                  <TableHead className="text-center">Enterprise</TableHead>
                  <TableHead className="text-center">Exclusive</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Preis</TableCell>
                  <TableCell className="text-center">€29</TableCell>
                  <TableCell className="text-center bg-primary/5 font-semibold">€49</TableCell>
                  <TableCell className="text-center">€199</TableCell>
                  <TableCell className="text-center">€999</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Private Nutzung</TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 mx-auto text-green-500" /></TableCell>
                  <TableCell className="text-center bg-primary/5"><Check className="w-4 h-4 mx-auto text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 mx-auto text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 mx-auto text-green-500" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Social Media</TableCell>
                  <TableCell className="text-center">—</TableCell>
                  <TableCell className="text-center bg-primary/5"><Check className="w-4 h-4 mx-auto text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 mx-auto text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 mx-auto text-green-500" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Werbekampagnen</TableCell>
                  <TableCell className="text-center">—</TableCell>
                  <TableCell className="text-center bg-primary/5">Klein</TableCell>
                  <TableCell className="text-center">Unbegrenzt</TableCell>
                  <TableCell className="text-center">Unbegrenzt</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">TV & Film</TableCell>
                  <TableCell className="text-center">—</TableCell>
                  <TableCell className="text-center bg-primary/5">—</TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 mx-auto text-green-500" /></TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 mx-auto text-green-500" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Reichweite</TableCell>
                  <TableCell className="text-center">Privat</TableCell>
                  <TableCell className="text-center bg-primary/5">100K</TableCell>
                  <TableCell className="text-center">Unbegrenzt</TableCell>
                  <TableCell className="text-center">Unbegrenzt</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Exklusiv</TableCell>
                  <TableCell className="text-center">—</TableCell>
                  <TableCell className="text-center bg-primary/5">—</TableCell>
                  <TableCell className="text-center">—</TableCell>
                  <TableCell className="text-center"><Check className="w-4 h-4 mx-auto text-green-500" /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>
      </section>

      {/* Similar Tracks */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl">Ähnliche Tracks</h2>
            <Link href="/marketplace">
              <Button variant="ghost">
                Mehr entdecken
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarTracks.map((similarTrack) => (
              <Link key={similarTrack.id} href={`/track/${similarTrack.id}`}>
                <Card className="bg-card border-border/50 overflow-hidden card-hover">
                  <CardContent className="p-0">
                    <div
                      className={`aspect-video bg-gradient-to-br ${similarTrack.coverGradient}`}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{similarTrack.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {similarTrack.artist}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(similarTrack.duration)}
                        </div>
                        <span className="font-semibold text-primary">
                          ab €{similarTrack.price}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
