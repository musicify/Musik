"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  ArrowRight,
  Headphones,
  Mic2,
  Shield,
  Zap,
  Star,
  ChevronRight,
  Music,
  Users,
  Award,
  Clock,
  Check,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useCallback } from "react";
import { useCart } from "@/hooks/use-cart";

// Animation variants
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Mock data for featured tracks
const featuredTracks = [
  {
    id: "1",
    title: "Neon Dreams",
    artist: "Max Müller",
    genre: "Electronic",
    mood: "Energetic",
    duration: "3:24",
    price: 49,
    coverGradient: "from-purple-500 to-pink-500",
  },
  {
    id: "2",
    title: "Epic Horizon",
    artist: "Sarah Schmidt",
    genre: "Cinematic",
    mood: "Inspiring",
    duration: "4:12",
    price: 79,
    coverGradient: "from-amber-500 to-orange-600",
  },
  {
    id: "3",
    title: "Urban Flow",
    artist: "Tom Weber",
    genre: "Hip-Hop",
    mood: "Cool",
    duration: "2:58",
    price: 39,
    coverGradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "4",
    title: "Sunset Waves",
    artist: "Lisa Braun",
    genre: "Ambient",
    mood: "Relaxed",
    duration: "5:30",
    price: 59,
    coverGradient: "from-rose-500 to-orange-400",
  },
];

// Mock data for featured directors
const featuredDirectors = [
  {
    id: "1",
    name: "Max Müller",
    specialization: ["Electronic", "Cinematic"],
    priceRange: "ab €200",
    badge: "PREMIUM",
    rating: 4.9,
    projects: 127,
    avatarGradient: "from-violet-500 to-purple-600",
  },
  {
    id: "2",
    name: "Sarah Schmidt",
    specialization: ["Orchestral", "Film"],
    priceRange: "ab €350",
    badge: "TOP_SELLER",
    rating: 4.8,
    projects: 89,
    avatarGradient: "from-amber-500 to-yellow-500",
  },
  {
    id: "3",
    name: "Tom Weber",
    specialization: ["Hip-Hop", "Pop"],
    priceRange: "ab €150",
    badge: "VERIFIED",
    rating: 4.7,
    projects: 64,
    avatarGradient: "from-cyan-500 to-teal-500",
  },
];

const features = [
  {
    icon: Headphones,
    title: "Sofort nutzbare Musik",
    description:
      "Tausende professionelle Tracks - lizenziert und sofort verfügbar für deine Projekte.",
    color: "text-cyan-400",
  },
  {
    icon: Mic2,
    title: "Custom Music",
    description:
      "Lass dir maßgeschneiderte Musik von professionellen Komponisten produzieren.",
    color: "text-amber-400",
  },
  {
    icon: Shield,
    title: "Sichere Lizenzen",
    description:
      "Klare Lizenzmodelle für jeden Verwendungszweck - von privat bis Enterprise.",
    color: "text-emerald-400",
  },
  {
    icon: Zap,
    title: "Schnelle Lieferung",
    description:
      "Sofortiger Download für Marktplatz-Musik, schnelle Produktion für Custom Music.",
    color: "text-violet-400",
  },
];

const stats = [
  { value: "10K+", label: "Tracks" },
  { value: "50+", label: "Komponisten" },
  { value: "5K+", label: "Kunden" },
  { value: "99%", label: "Zufriedenheit" },
];

export default function HomePage() {
  const router = useRouter();
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const { addToCart } = useCart();

  const handleAddToCart = useCallback((trackId: string) => {
    addToCart(trackId, "COMMERCIAL");
  }, [addToCart]);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background - pointer-events-none to allow clicks through */}
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        
        {/* Animated circles - pointer-events-none to allow clicks through */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-slow animation-delay-500 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-1.5 text-sm font-medium border border-border/50"
              >
                <span className="mr-2">🎵</span>
                Über 10.000 lizenzierte Tracks
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-6"
            >
              Musik, die{" "}
              <span className="relative">
                <span className="gradient-text">begeistert</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M2 6C50 2 100 2 198 6"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Entdecke lizenzierte Musik oder lass dir individuelle Soundtracks
              von professionellen Komponisten produzieren.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => router.push("/marketplace")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 h-14 shadow-glow hover:shadow-glow-lg transition-all"
              >
                <Headphones className="w-5 h-5 mr-2" />
                Musik entdecken
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/custom-music")}
                className="text-lg px-8 h-14 border-border hover:bg-secondary transition-all"
              >
                <Mic2 className="w-5 h-5 mr-2" />
                Musik auf Bestellung
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl sm:text-4xl font-serif text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-50" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Warum Musicify
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl mb-4">
              Alles was du brauchst
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Von sofort verfügbaren Tracks bis zur individuellen Produktion -
              wir haben die richtige Lösung für dein Projekt.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-background/50 border-border/50 h-full card-hover">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 ${feature.color}`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tracks Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge variant="secondary" className="mb-4">
                Neu im Katalog
              </Badge>
              <h2 className="font-serif text-4xl sm:text-5xl">
                Beliebte Tracks
              </h2>
            </div>
            <Link href="/marketplace">
              <Button variant="ghost" className="hidden sm:flex items-center gap-2">
                Alle Tracks
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group bg-card border-border/50 overflow-hidden card-hover">
                  <CardContent className="p-0">
                    {/* Cover */}
                    <div
                      className={`relative aspect-square bg-gradient-to-br ${track.coverGradient}`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                        <Button
                          size="icon"
                          className="w-14 h-14 rounded-full bg-white text-black hover:bg-white/90"
                          onClick={() =>
                            setPlayingTrack(
                              playingTrack === track.id ? null : track.id
                            )
                          }
                        >
                          {playingTrack === track.id ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6 ml-1" />
                          )}
                        </Button>
                      </div>
                      {/* Equalizer animation when playing */}
                      {playingTrack === track.id && (
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
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold truncate">
                            {track.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {track.artist}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {track.genre}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {track.duration}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">
                            €{track.price}
                          </span>
                          <Button size="sm" variant="secondary" onClick={() => handleAddToCart(track.id)}>
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/marketplace">
              <Button variant="outline">
                Alle Tracks ansehen
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How Custom Music Works Section */}
      <section className="py-24 bg-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                Custom Music
              </Badge>
              <h2 className="font-serif text-4xl sm:text-5xl mb-6">
                Deine Vision, unser Sound
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                In nur wenigen Schritten zur maßgeschneiderten Musik für dein
                Projekt. Arbeite direkt mit professionellen Komponisten zusammen.
              </p>

              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: "Beschreibe dein Projekt",
                    description:
                      "Genre, Stimmung, Verwendungszweck - teile uns deine Vision mit.",
                  },
                  {
                    step: "02",
                    title: "Wähle deinen Komponisten",
                    description:
                      "Finde den perfekten Künstler aus unserem verifizierten Netzwerk.",
                  },
                  {
                    step: "03",
                    title: "Erhalte Angebote",
                    description:
                      "Vergleiche Preise und Produktionszeiten verschiedener Künstler.",
                  },
                  {
                    step: "04",
                    title: "Genieße deine Musik",
                    description:
                      "Inklusive Revisionen und sicherer Lizenzierung.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary font-serif text-lg flex items-center justify-center flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link href="/custom-music">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Auftrag starten
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Featured Directors */}
            <div className="space-y-4">
              {featuredDirectors.map((director, index) => (
                <motion.div
                  key={director.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Card className="bg-background/50 border-border/50 card-hover">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${director.avatarGradient} flex items-center justify-center text-white text-xl font-serif`}
                        >
                          {director.name.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">
                              {director.name}
                            </h3>
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
                          <p className="text-sm text-muted-foreground">
                            {director.specialization.join(" · ")}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              {director.rating}
                            </span>
                            <span className="text-muted-foreground">
                              {director.projects} Projekte
                            </span>
                            <span className="text-primary font-medium">
                              {director.priceRange}
                            </span>
                          </div>
                        </div>

                        {/* Action */}
                        <Link href={`/directors/${director.id}`}>
                          <Button variant="secondary" size="sm">
                            Profil
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <div className="text-center pt-4">
                <Link href="/directors">
                  <Button variant="ghost">
                    Alle Komponisten ansehen
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* License Types Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Lizenzierung
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl mb-4">
              Für jeden Zweck die richtige Lizenz
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transparente Preise und klare Nutzungsrechte - wähle die Lizenz, die
              zu deinem Projekt passt.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Personal",
                icon: "🎵",
                price: "ab €29",
                description: "Für private Projekte",
                features: [
                  "Private Nutzung",
                  "Hobbyprojekte",
                  "Keine kommerzielle Verwendung",
                ],
                color: "license-personal",
              },
              {
                name: "Commercial",
                icon: "🎬",
                price: "ab €49",
                description: "Für kommerzielle Projekte",
                features: [
                  "YouTube, Social Media",
                  "Kleine Werbekampagnen",
                  "Bis 100K Reichweite",
                ],
                color: "license-commercial",
                popular: true,
              },
              {
                name: "Enterprise",
                icon: "🏢",
                price: "ab €199",
                description: "Für große Kampagnen",
                features: [
                  "Unbegrenzte Reichweite",
                  "TV & Film",
                  "Große Werbekampagnen",
                ],
                color: "license-enterprise",
              },
              {
                name: "Exclusive",
                icon: "🔒",
                price: "auf Anfrage",
                description: "Exklusivrechte",
                features: [
                  "Alle Rechte übertragen",
                  "Track wird entfernt",
                  "Einzigartige Nutzung",
                ],
                color: "license-exclusive",
              },
            ].map((license, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {license.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground">
                      Beliebt
                    </Badge>
                  </div>
                )}
                <Card
                  className={`h-full bg-card border-border/50 ${
                    license.popular ? "border-primary/50 shadow-glow-sm" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="text-3xl mb-3">{license.icon}</div>
                    <h3 className={`text-xl font-semibold mb-1 ${license.color}`}>
                      {license.name}
                    </h3>
                    <p className="text-2xl font-serif mb-2">{license.price}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {license.description}
                    </p>
                    <ul className="space-y-2">
                      {license.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Kundenstimmen
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl mb-4">
              Was unsere Kunden sagen
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Die Qualität der Musik ist herausragend. Innerhalb weniger Tage hatte ich den perfekten Soundtrack für mein Werbevideo.",
                author: "Anna K.",
                role: "Marketing Manager",
                company: "TechStart GmbH",
              },
              {
                quote:
                  "Der Custom Music Prozess war unglaublich smooth. Max hat meine Vision perfekt umgesetzt - inkl. aller Revisionen.",
                author: "Michael S.",
                role: "Filmmaker",
                company: "Freelance",
              },
              {
                quote:
                  "Endlich eine Plattform mit fairen Preisen und transparenten Lizenzen. Nutze Musicify für all meine YouTube-Projekte.",
                author: "Lisa M.",
                role: "Content Creator",
                company: "500K Subscribers",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-background/50 border-border/50 h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                    <blockquote className="text-foreground mb-6">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                        {testimonial.company && ` · ${testimonial.company}`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6"
            >
              Bereit für deinen <span className="gradient-text">Sound</span>?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground mb-10"
            >
              Starte jetzt und finde die perfekte Musik für dein nächstes Projekt.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => router.push("/register")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 h-14 shadow-glow hover:shadow-glow-lg transition-all"
              >
                Kostenlos registrieren
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/marketplace")}
                className="text-lg px-8 h-14 border-border hover:bg-secondary"
              >
                Katalog durchstöbern
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
