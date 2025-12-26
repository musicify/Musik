"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Music,
  Users,
  Shield,
  Zap,
  Heart,
  Award,
  Globe,
  Target,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { value: "10K+", label: "Tracks" },
  { value: "50+", label: "Komponisten" },
  { value: "5K+", label: "Kunden" },
  { value: "99%", label: "Zufriedenheit" },
];

const values = [
  {
    icon: Heart,
    title: "Leidenschaft für Musik",
    description:
      "Wir glauben, dass großartige Musik die Kraft hat, Emotionen zu wecken und Geschichten zu erzählen.",
  },
  {
    icon: Shield,
    title: "Transparenz & Fairness",
    description:
      "Klare Lizenzmodelle und faire Konditionen für Künstler und Kunden gleichermaßen.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "Wir entwickeln unsere Plattform kontinuierlich weiter, um das beste Erlebnis zu bieten.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Eine Gemeinschaft aus talentierten Komponisten und kreativen Machern.",
  },
];

const team = [
  {
    name: "Max Schmidt",
    role: "Gründer & CEO",
    bio: "Musikproduzent mit 15 Jahren Erfahrung",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Lisa Müller",
    role: "Head of Music",
    bio: "Ehemalige A&R Managerin bei Universal",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    name: "Tom Weber",
    role: "CTO",
    bio: "Tech-Veteran aus der Startup-Szene",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    name: "Sarah Klein",
    role: "Head of Community",
    bio: "Vernetzt Künstler und Kreative",
    gradient: "from-amber-500 to-orange-600",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="absolute inset-0 pattern-dots opacity-20" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              Über Musicify
            </Badge>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl mb-6">
              Musik, die <span className="gradient-text">verbindet</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Wir bringen talentierte Komponisten und kreative Macher zusammen,
              um einzigartige Soundtracks für jedes Projekt zu schaffen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl sm:text-5xl font-serif text-primary mb-2">
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
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-4">
                Unsere Mission
              </Badge>
              <h2 className="font-serif text-4xl sm:text-5xl mb-6">
                Die Zukunft der Musiklizenzierung
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Wir haben Musicify gegründet, weil wir selbst erlebt haben, wie
                kompliziert und undurchsichtig die Welt der Musiklizenzierung
                sein kann. Unsere Vision ist eine Plattform, die es einfach
                macht, die perfekte Musik zu finden – oder maßgeschneidert
                produzieren zu lassen.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Für Kreative bedeutet das: Zugang zu einem kuratierten Katalog
                hochwertiger Tracks mit transparenten Lizenzen. Für Komponisten:
                Eine faire Plattform, um ihre Musik zu verkaufen und direkt mit
                Kunden zusammenzuarbeiten.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>Gegründet 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span>Berlin, Deutschland</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 flex items-center justify-center">
                <Music className="w-32 h-32 text-primary/50" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border border-border/50">
                <Award className="w-10 h-10 text-primary mb-2" />
                <p className="font-semibold">Verifizierte Qualität</p>
                <p className="text-sm text-muted-foreground">
                  Jeder Komponist wird geprüft
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Unsere Werte
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl mb-4">
              Was uns antreibt
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Diese Werte leiten uns bei allem, was wir tun – von der
              Produktentwicklung bis zum Kundenservice.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-background/50 border-border/50 h-full card-hover">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
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
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Das Team
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl mb-4">
              Die Menschen hinter Musicify
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ein leidenschaftliches Team aus Musik-Enthusiasten und
              Tech-Experten.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card/50 border-border/50 overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-3xl font-serif mb-4`}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-primary text-sm mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-4xl sm:text-5xl mb-6">
              Bereit loszulegen?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Entdecke unseren Katalog oder werde Teil unserer Community als
              Komponist.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/marketplace">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg"
                >
                  <Music className="w-5 h-5 mr-2" />
                  Musik entdecken
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Kontakt aufnehmen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
