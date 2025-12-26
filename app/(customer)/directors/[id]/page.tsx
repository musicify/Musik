"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Star,
  Award,
  Check,
  Clock,
  Music,
  Users,
  ChevronRight,
  MessageSquare,
  Globe,
  Mail,
  Calendar,
  Briefcase,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Mock director data
const mockDirector = {
  id: "dir1",
  name: "Max Müller",
  email: "max@musicify.de",
  avatar: null,
  avatarGradient: "from-violet-500 to-purple-600",
  badge: "PREMIUM" as const,
  bio: "Ich bin ein leidenschaftlicher Komponist und Produzent mit über 10 Jahren Erfahrung in der Musikproduktion. Meine Spezialgebiete sind Electronic Music und Cinematic Soundtracks. Ich arbeite eng mit meinen Kunden zusammen, um ihre Vision zum Leben zu erwecken.",
  specialization: ["Electronic", "Cinematic", "Ambient"],
  priceRangeMin: 200,
  priceRangeMax: 800,
  website: "https://maxmuller.music",
  languages: ["Deutsch", "Englisch"],
  experience: "10+ Jahre in der Musikproduktion, Zusammenarbeit mit internationalen Marken und Agenturen.",
  equipment: "Ableton Live, Logic Pro X, Native Instruments Komplete, diverse Hardware-Synthesizer",
  // Stats
  rating: 4.9,
  reviewCount: 47,
  responseTime: 4,
  completionRate: 98,
  avgDeliveryTime: 5,
  totalProjects: 127,
  memberSince: "Januar 2022",
};

// Mock portfolio tracks
const portfolioTracks = [
  {
    id: "1",
    title: "Neon Dreams",
    genre: "Electronic",
    mood: "Energetic",
    duration: 204,
    price: 49,
    plays: 12540,
    coverGradient: "from-purple-500 to-pink-500",
  },
  {
    id: "5",
    title: "Digital Pulse",
    genre: "Electronic",
    mood: "Energetic",
    duration: 215,
    price: 55,
    plays: 9800,
    coverGradient: "from-violet-500 to-indigo-600",
  },
  {
    id: "9",
    title: "Cyber Wave",
    genre: "Electronic",
    mood: "Dark",
    duration: 245,
    price: 65,
    plays: 7650,
    coverGradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "10",
    title: "Sunset Memories",
    genre: "Cinematic",
    mood: "Nostalgic",
    duration: 312,
    price: 79,
    plays: 5430,
    coverGradient: "from-orange-500 to-pink-500",
  },
];

// Mock reviews
const reviews = [
  {
    id: "1",
    customer: "Anna K.",
    rating: 5,
    comment:
      "Max hat meine Vision perfekt umgesetzt. Die Kommunikation war super und die Musik ist genau das, was ich gesucht habe!",
    project: "Corporate Video",
    date: "vor 2 Wochen",
  },
  {
    id: "2",
    customer: "Michael S.",
    rating: 5,
    comment:
      "Professionelle Arbeit, schnelle Lieferung. Werde definitiv wieder mit Max zusammenarbeiten.",
    project: "Gaming Soundtrack",
    date: "vor 1 Monat",
  },
  {
    id: "3",
    customer: "Lisa M.",
    rating: 4,
    comment:
      "Sehr zufrieden mit dem Ergebnis. Die Revision wurde schnell umgesetzt.",
    project: "YouTube Intro",
    date: "vor 2 Monaten",
  },
];

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "text-amber-400 fill-amber-400"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

export default function DirectorProfilePage() {
  const params = useParams();
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

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
            href="/directors"
            className="hover:text-foreground transition-colors"
          >
            Komponisten
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{mockDirector.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr,350px] gap-8">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-card/50 border-border/50 overflow-hidden">
                {/* Cover */}
                <div className="h-32 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />
                <CardContent className="p-6 -mt-12">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    {/* Avatar */}
                    <Avatar className="w-24 h-24 border-4 border-background">
                      <AvatarImage src={mockDirector.avatar || undefined} />
                      <AvatarFallback
                        className={`bg-gradient-to-br ${mockDirector.avatarGradient} text-white text-3xl font-serif`}
                      >
                        {mockDirector.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="font-serif text-3xl">{mockDirector.name}</h1>
                        <Badge className="badge-premium">
                          <Award className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          {mockDirector.rating} ({mockDirector.reviewCount}{" "}
                          Bewertungen)
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          ~{mockDirector.responseTime}h Antwortzeit
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {mockDirector.totalProjects} Projekte
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {mockDirector.specialization.map((spec) => (
                          <Badge key={spec} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Tabs defaultValue="portfolio">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="about">Über mich</TabsTrigger>
                  <TabsTrigger value="reviews">
                    Bewertungen ({mockDirector.reviewCount})
                  </TabsTrigger>
                </TabsList>

                {/* Portfolio Tab */}
                <TabsContent value="portfolio" className="mt-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {portfolioTracks.map((track) => (
                      <Card
                        key={track.id}
                        className="bg-card border-border/50 overflow-hidden group"
                      >
                        <CardContent className="p-0">
                          <div
                            className={`relative aspect-video bg-gradient-to-br ${track.coverGradient}`}
                          >
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                className="w-12 h-12 rounded-full bg-white text-black hover:bg-white/90"
                                onClick={() =>
                                  setPlayingTrackId(
                                    playingTrackId === track.id
                                      ? null
                                      : track.id
                                  )
                                }
                              >
                                {playingTrackId === track.id ? (
                                  <Pause className="w-5 h-5" />
                                ) : (
                                  <Play className="w-5 h-5 ml-0.5" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <Link
                                  href={`/track/${track.id}`}
                                  className="font-medium hover:text-primary transition-colors"
                                >
                                  {track.title}
                                </Link>
                                <p className="text-sm text-muted-foreground">
                                  {track.genre} · {track.mood}
                                </p>
                              </div>
                              <Badge variant="outline">
                                {formatDuration(track.duration)}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                {track.plays.toLocaleString()} Plays
                              </span>
                              <span className="font-semibold text-primary">
                                €{track.price}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* About Tab */}
                <TabsContent value="about" className="mt-6">
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2">Über mich</h3>
                        <p className="text-muted-foreground">{mockDirector.bio}</p>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-2">Erfahrung</h3>
                        <p className="text-muted-foreground">
                          {mockDirector.experience}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-2">Equipment & Software</h3>
                        <p className="text-muted-foreground">
                          {mockDirector.equipment}
                        </p>
                      </div>
                      <Separator />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Languages className="w-4 h-4" />
                            Sprachen
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {mockDirector.languages.map((lang) => (
                              <Badge key={lang} variant="secondary">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Mitglied seit
                          </h3>
                          <p className="text-muted-foreground">
                            {mockDirector.memberSince}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card
                        key={review.id}
                        className="bg-card/50 border-border/50"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-secondary">
                                  {review.customer.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{review.customer}</p>
                                <p className="text-xs text-muted-foreground">
                                  {review.project} · {review.date}
                                </p>
                              </div>
                            </div>
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {review.comment}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hire Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card border-border/50 sticky top-24">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    Auftrag anfragen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Range */}
                  <div className="text-center py-4 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground mb-1">
                      Preisrahmen
                    </p>
                    <p className="text-2xl font-serif">
                      €{mockDirector.priceRangeMin} - €{mockDirector.priceRangeMax}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      pro Projekt
                    </p>
                  </div>

                  {/* CTA */}
                  <Link href={`/custom-music?director=${mockDirector.id}`}>
                    <Button className="w-full h-12 bg-primary hover:bg-primary/90">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Auftrag starten
                    </Button>
                  </Link>

                  <Separator />

                  {/* Stats */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Antwortzeit
                      </span>
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />~{mockDirector.responseTime}h
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Lieferzeit
                      </span>
                      <span className="text-sm font-medium">
                        ~{mockDirector.avgDeliveryTime} Tage
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Abschlussrate
                      </span>
                      <span className="text-sm font-medium text-green-500">
                        {mockDirector.completionRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Bewertung
                      </span>
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {mockDirector.rating}
                      </span>
                    </div>
                  </div>

                  {mockDirector.website && (
                    <>
                      <Separator />
                      <a
                        href={mockDirector.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Website besuchen
                      </a>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

