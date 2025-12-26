"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Music,
  Euro,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Upload,
  BarChart3,
  Wallet,
  Globe,
  Heart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  {
    icon: Euro,
    title: "Faire Vergütung",
    description: "85% des Verkaufspreises gehen direkt an dich. Keine versteckten Gebühren.",
  },
  {
    icon: Globe,
    title: "Globale Reichweite",
    description: "Erreiche Kunden weltweit – von Content Creators bis zu großen Unternehmen.",
  },
  {
    icon: Shield,
    title: "Rechtssicherheit",
    description: "Klare Lizenzverträge schützen deine Arbeit und deine Rechte.",
  },
  {
    icon: Zap,
    title: "Einfacher Upload",
    description: "Lade deine Tracks in Minuten hoch – wir kümmern uns um den Rest.",
  },
  {
    icon: BarChart3,
    title: "Detaillierte Analytics",
    description: "Verfolge Verkäufe, Streams und Einnahmen in Echtzeit.",
  },
  {
    icon: Users,
    title: "Custom Music Aufträge",
    description: "Erhalte individuelle Aufträge von Kunden für maßgeschneiderte Musik.",
  },
];

const stats = [
  { value: "85%", label: "Vergütung für Künstler" },
  { value: "€125K+", label: "Monatliche Auszahlungen" },
  { value: "50+", label: "Aktive Komponisten" },
  { value: "5K+", label: "Zufriedene Kunden" },
];

const howItWorks = [
  {
    step: "01",
    title: "Bewerben",
    description: "Reiche dein Portfolio mit 3-5 Sample-Tracks ein. Zeige uns dein Talent!",
  },
  {
    step: "02",
    title: "Verifizierung",
    description: "Unser Team prüft deine Bewerbung innerhalb von 48 Stunden.",
  },
  {
    step: "03",
    title: "Tracks hochladen",
    description: "Nach der Freigabe kannst du unbegrenzt Tracks in den Katalog laden.",
  },
  {
    step: "04",
    title: "Verdienen",
    description: "Bei jedem Verkauf erhältst du automatisch 85% des Nettopreises.",
  },
];

const requirements = [
  "Hochwertige Audioqualität (WAV, 24-bit, 48kHz+)",
  "Original-Kompositionen – keine Samples ohne Lizenz",
  "Professionelle Produktion und Mixing",
  "Mindestens 3 Portfolio-Tracks zum Start",
  "Vollständige Metadaten (Genre, BPM, Mood, Tags)",
];

const testimonials = [
  {
    quote: "Musicify hat meine Karriere verändert. Die Plattform macht es unglaublich einfach, Musik zu verkaufen und direkt mit Kunden zusammenzuarbeiten.",
    name: "Max Müller",
    role: "Komponist seit 2023",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    quote: "Die Custom Music Aufträge sind ein Game-Changer. Ich verdiene mehr als jemals zuvor und arbeite an spannenden Projekten.",
    name: "Sarah Schmidt",
    role: "Komponistin seit 2023",
    gradient: "from-pink-500 to-rose-600",
  },
];

export default function ForArtistsPage() {
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
              Für Künstler
            </Badge>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl mb-6">
              Teile deine Musik mit der <span className="gradient-text">Welt</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Werde Teil unserer Community aus talentierten Komponisten.
              Verkaufe deine Tracks, erhalte Custom Music Aufträge und verdiene
              faire 85% an jedem Verkauf.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Jetzt bewerben
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline">
                  So funktioniert's
                </Button>
              </Link>
            </div>
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

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Vorteile
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl mb-4">
              Warum Musicify?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Wir haben die Plattform gebaut, die wir uns als Künstler selbst
              gewünscht hätten.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card/50 border-border/50 h-full card-hover">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Der Weg
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl mb-4">
              So wirst du Komponist
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              In nur vier Schritten zur erfolgreichen Musikkarriere auf Musicify.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-serif text-primary/20 mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-8 -right-4 w-8 h-8 text-primary/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-4">
                Anforderungen
              </Badge>
              <h2 className="font-serif text-4xl sm:text-5xl mb-6">
                Was wir erwarten
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Qualität steht bei uns an erster Stelle. Deshalb haben wir einige
                Grundvoraussetzungen für unsere Komponisten.
              </p>
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Wallet className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-4xl font-serif">85%</p>
                      <p className="text-muted-foreground">Für dich</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Bei jedem Verkauf erhältst du 85% des Nettopreises – einer der
                    höchsten Anteile in der Branche. Auszahlung erfolgt monatlich
                    ab einem Minimum von €50.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Track-Verkauf (€49)</span>
                      <span className="font-medium text-green-500">+€41,65 für dich</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Custom Music (€500)</span>
                      <span className="font-medium text-green-500">+€425 für dich</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exclusive License (€1.000)</span>
                      <span className="font-medium text-green-500">+€850 für dich</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Heart className="w-3 h-3 mr-1" />
              Von Künstlern für Künstler
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl">
              Was unsere Komponisten sagen
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
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
                          className="w-4 h-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                    <p className="text-lg mb-6">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-medium`}
                      >
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-4xl sm:text-5xl mb-6">
              Bereit durchzustarten?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Werde Teil unserer wachsenden Community aus talentierten Komponisten
              und starte noch heute deine Musikkarriere.
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg"
              >
                <Music className="w-5 h-5 mr-2" />
                Jetzt bewerben
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

