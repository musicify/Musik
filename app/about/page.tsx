"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Music,
  Users,
  Shield,
  Award,
  Heart,
  Globe,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { value: "10,000+", label: "Musik-Tracks" },
  { value: "500+", label: "Verifizierte Komponisten" },
  { value: "50,000+", label: "Zufriedene Kunden" },
  { value: "99%", label: "Kundenzufriedenheit" },
];

const values = [
  {
    icon: Music,
    title: "Qualität",
    description:
      "Nur professionell produzierte Musik von verifizierten Komponisten.",
  },
  {
    icon: Shield,
    title: "Sicherheit",
    description:
      "Sichere Zahlungen, klare Lizenzverträge und Datenschutz nach DSGVO.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Eine lebendige Gemeinschaft aus Kreativen, Komponisten und Kunden.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "Modernste Technologie für nahtlose Workflows und beste User Experience.",
  },
];

const team = [
  {
    name: "Anna Meier",
    role: "CEO & Gründerin",
    bio: "15+ Jahre in der Musikindustrie",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Thomas Schmidt",
    role: "CTO",
    bio: "Ex-Spotify, Musik-Tech-Enthusiast",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    name: "Lisa Weber",
    role: "Head of Music",
    bio: "Grammy-nominierte Produzentin",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    name: "Max Fischer",
    role: "Head of Product",
    bio: "UX-Experte mit Musik-Background",
    gradient: "from-rose-500 to-pink-500",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">
              <Heart className="w-3 h-3 mr-1 text-red-500" />
              Unsere Geschichte
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6">
              Musik, die <span className="gradient-text">Geschichten</span> erzählt
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Musicify wurde 2020 gegründet, um die Lücke zwischen talentierten
              Komponisten und Menschen, die einzigartige Musik brauchen, zu
              schließen. Heute sind wir die führende Plattform für lizenzierte und
              maßgeschneiderte Musik.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border/50 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl lg:text-5xl font-serif gradient-text mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badge variant="secondary" className="mb-4">
                <Globe className="w-3 h-3 mr-1" />
                Unsere Mission
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl mb-6">
                Musik für jeden Moment zugänglich machen
              </h2>
              <p className="text-muted-foreground mb-6">
                Wir glauben, dass jedes Projekt – ob großer Kinofilm oder kleiner
                YouTube-Kanal – Zugang zu professioneller Musik verdient. Unser Ziel
                ist es, den Prozess der Musikbeschaffung so einfach und transparent
                wie möglich zu gestalten.
              </p>
              <ul className="space-y-3">
                {[
                  "Faire Preise für alle Projektgrößen",
                  "Transparente Lizenzmodelle",
                  "Direkter Kontakt zu Komponisten",
                  "Schnelle und unkomplizierte Abwicklung",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-border/50 flex items-center justify-center">
                <Music className="w-32 h-32 text-primary/50" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-xl">
                <Award className="w-16 h-16 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card/50 border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">
              Unsere Werte
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl">
              Was uns antreibt
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card border-border/50 h-full card-hover">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">
              <Users className="w-3 h-3 mr-1" />
              Unser Team
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl mb-4">
              Die Menschen hinter Musicify
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ein leidenschaftliches Team aus Musik-Liebhabern, Tech-Experten und
              Kreativen.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card border-border/50 card-hover">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-4 text-white text-2xl font-serif`}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-sm text-primary mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card/50 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-serif text-3xl sm:text-4xl mb-4">
              Bereit für großartige Musik?
            </h2>
            <p className="text-muted-foreground mb-8">
              Entdecke tausende Tracks oder lass dir deine perfekte Musik
              komponieren.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/marketplace">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Musik entdecken
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg">
                  Als Komponist registrieren
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

