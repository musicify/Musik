"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Star,
  Award,
  Check,
  ChevronRight,
  Music,
  Clock,
  MessageSquare,
  Calendar,
  Zap,
  Shield,
  Heart,
  Share2,
  Mail,
  Globe,
  Instagram,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Mock director data
const director = {
  id: "dir1",
  name: "Max Müller",
  bio: "Spezialisiert auf Electronic und Cinematic Music mit über 10 Jahren Erfahrung in der Musikproduktion. Ich arbeite mit Künstlern, Filmemachern und Marken zusammen, um einzigartige Soundtracks zu kreieren, die Geschichten erzählen und Emotionen wecken.",
  fullBio: `Meine musikalische Reise begann vor über 15 Jahren, als ich meine ersten Beats auf einem alten Computer produzierte. Seitdem hat sich mein Stil kontinuierlich weiterentwickelt, geprägt durch Einflüsse aus der elektronischen Musikszene Berlins und der epischen Filmmusik Hollywoods.

Ich habe für zahlreiche internationale Marken gearbeitet, darunter BMW, Adidas und Red Bull. Meine Musik wurde in Werbekampagnen, Dokumentarfilmen und Videospielen eingesetzt.

Was mich antreibt, ist die Möglichkeit, mit meiner Musik Geschichten zu erzählen und Menschen zu berühren. Jedes Projekt ist einzigartig, und ich arbeite eng mit meinen Kunden zusammen, um ihre Vision zum Leben zu erwecken.`,
  specialization: ["Electronic", "Cinematic", "Synthwave", "Ambient"],
  priceRange: { min: 200, max: 2500 },
  badge: "PREMIUM",
  rating: 4.9,
  reviews: 47,
  projects: 127,
  responseTime: "< 2h",
  completionRate: 98,
  memberSince: "2021",
  avatarGradient: "from-violet-500 to-purple-600",
  location: "Berlin, Deutschland",
  languages: ["Deutsch", "Englisch"],
  equipment: ["Ableton Live", "Native Instruments", "U-He Synths", "Spitfire Audio"],
  social: {
    website: "https://maxmuller.de",
    instagram: "@maxmuller_music",
  },
  stats: {
    avgDeliveryTime: 5,
    revisionRate: 12,
    repeatClients: 68,
  },
};

// Mock portfolio tracks
const portfolioTracks = [
  {
    id: "1",
    title: "Neon Dreams",
    genre: "Electronic",
    duration: 204,
    price: 49,
    plays: 12540,
    coverGradient: "from-purple-500 to-pink-500",
    isNew: true,
  },
  {
    id: "5",
    title: "Digital Pulse",
    genre: "Synthwave",
    duration: 215,
    price: 55,
    plays: 9800,
    coverGradient: "from-violet-500 to-indigo-600",
    isNew: false,
  },
  {
    id: "9",
    title: "Midnight Run",
    genre: "Cinematic",
    duration: 287,
    price: 79,
    plays: 6720,
    coverGradient: "from-blue-500 to-cyan-600",
    isNew: false,
  },
  {
    id: "10",
    title: "Electric Horizons",
    genre: "Electronic",
    duration: 234,
    price: 59,
    plays: 8340,
    coverGradient: "from-amber-500 to-orange-600",
    isNew: true,
  },
];

// Mock reviews
const reviews = [
  {
    id: "1",
    author: "Anna K.",
    rating: 5,
    date: "2024-01-15",
    project: "Werbevideo Soundtrack",
    comment:
      "Max hat unsere Erwartungen übertroffen! Die Musik passte perfekt zu unserem Werbespot und wurde pünktlich geliefert. Sehr professionelle Kommunikation.",
  },
  {
    id: "2",
    author: "Michael S.",
    rating: 5,
    date: "2024-01-10",
    project: "Corporate Film",
    comment:
      "Hervorragende Zusammenarbeit! Max hat unsere Vision sofort verstanden und einen atemberaubenden Soundtrack kreiert. Werden definitiv wieder mit ihm arbeiten.",
  },
  {
    id: "3",
    author: "Lisa M.",
    rating: 4,
    date: "2023-12-28",
    project: "YouTube Intro",
    comment:
      "Sehr gute Qualität und schnelle Kommunikation. Eine kleine Revision war nötig, aber das Endergebnis ist fantastisch.",
  },
];

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function BadgeIcon({ badge }: { badge: string | null }) {
  if (!badge) return null;

  const badgeConfig = {
    PREMIUM: { icon: Award, className: "badge-premium", label: "Premium Komponist" },
    TOP_SELLER: { icon: Star, className: "badge-top-seller", label: "Top Seller" },
    VERIFIED: { icon: Check, className: "badge-verified", label: "Verifiziert" },
  };

  const config = badgeConfig[badge as keyof typeof badgeConfig];
  if (!config) return null;

  return (
    <Badge className={`${config.className} text-sm`}>
      <config.icon className="w-3.5 h-3.5 mr-1" />
      {config.label}
    </Badge>
  );
}

export default function DirectorDetailPage() {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("portfolio");

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="absolute inset-0 pattern-dots opacity-20" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/directors" className="hover:text-foreground">
              Komponisten
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{director.name}</span>
          </nav>

          <div className="grid lg:grid-cols-[300px,1fr] gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-card/80 backdrop-blur border-border/50 sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <Avatar className="w-28 h-28 mx-auto mb-4">
                      <AvatarFallback
                        className={`bg-gradient-to-br ${director.avatarGradient} text-white text-4xl font-serif`}
                      >
                        {director.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="font-serif text-2xl mb-2">{director.name}</h1>
                    <BadgeIcon badge={director.badge} />
                    <p className="text-sm text-muted-foreground mt-2">
                      {director.location}
                    </p>
                  </div>

                  <div className="flex justify-center gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-serif">{director.rating}</p>
                      <div className="flex items-center gap-0.5 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(director.rating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {director.reviews} Bewertungen
                      </p>
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <div className="text-center">
                      <p className="text-2xl font-serif">{director.projects}</p>
                      <p className="text-xs text-muted-foreground">Projekte</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Antwortzeit
                      </span>
                      <span className="font-medium text-green-500">
                        {director.responseTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Erfolgsrate
                      </span>
                      <span className="font-medium">{director.completionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Mitglied seit
                      </span>
                      <span>{director.memberSince}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link href="/custom-music">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Auftrag erstellen
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Nachricht senden
                    </Button>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3 mt-6 pt-6 border-t border-border/50">
                    {director.social.website && (
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={director.social.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {director.social.instagram && (
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={`https://instagram.com/${director.social.instagram.replace(
                            "@",
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Price Range */}
              <Card className="bg-card/50 border-border/50 mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Preisrahmen</p>
                      <p className="text-3xl font-serif">
                        €{director.priceRange.min} – €{director.priceRange.max}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {director.specialization.map((spec) => (
                        <Badge key={spec} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bio */}
              <Card className="bg-card/50 border-border/50 mb-6">
                <CardHeader>
                  <CardTitle className="font-serif">Über mich</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {director.fullBio}
                  </p>
                  <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Sprachen</h4>
                      <div className="flex gap-2">
                        {director.languages.map((lang) => (
                          <Badge key={lang} variant="outline">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Equipment & Software</h4>
                      <div className="flex flex-wrap gap-2">
                        {director.equipment.map((item) => (
                          <Badge key={item} variant="outline">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start mb-6 bg-card/50">
                  <TabsTrigger value="portfolio">
                    Portfolio ({portfolioTracks.length})
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    Bewertungen ({reviews.length})
                  </TabsTrigger>
                  <TabsTrigger value="stats">Statistiken</TabsTrigger>
                </TabsList>

                {/* Portfolio Tab */}
                <TabsContent value="portfolio">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {portfolioTracks.map((track) => (
                      <Card
                        key={track.id}
                        className="bg-card border-border/50 overflow-hidden card-hover"
                      >
                        <CardContent className="p-0">
                          <div className="flex gap-4 p-4">
                            <div
                              className={`relative w-20 h-20 rounded-lg bg-gradient-to-br ${track.coverGradient} flex-shrink-0`}
                            >
                              <button
                                onClick={() =>
                                  setPlayingTrackId(
                                    playingTrackId === track.id ? null : track.id
                                  )
                                }
                                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg"
                              >
                                {playingTrackId === track.id ? (
                                  <Pause className="w-6 h-6 text-white" />
                                ) : (
                                  <Play className="w-6 h-6 text-white ml-0.5" />
                                )}
                              </button>
                              {track.isNew && (
                                <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs">
                                  Neu
                                </Badge>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/track/${track.id}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {track.title}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                {track.genre}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {formatDuration(track.duration)}
                                </span>
                                <span>{track.plays.toLocaleString()} plays</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <span className="font-semibold text-primary">
                                ab €{track.price}
                              </span>
                              <Button size="sm" variant="secondary">
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews">
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id} className="bg-card/50 border-border/50">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-medium">{review.author}</p>
                              <p className="text-sm text-muted-foreground">
                                {review.project}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString("de-DE")}
                              </span>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Stats Tab */}
                <TabsContent value="stats">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Card className="bg-card/50 border-border/50">
                      <CardContent className="p-6 text-center">
                        <p className="text-4xl font-serif mb-2">
                          {director.stats.avgDeliveryTime}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tage Ø Lieferzeit
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50">
                      <CardContent className="p-6 text-center">
                        <p className="text-4xl font-serif mb-2">
                          {director.stats.revisionRate}%
                        </p>
                        <p className="text-sm text-muted-foreground">Revisionsrate</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50">
                      <CardContent className="p-6 text-center">
                        <p className="text-4xl font-serif mb-2">
                          {director.stats.repeatClients}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Wiederkehrende Kunden
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
