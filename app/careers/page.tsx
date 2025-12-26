"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Euro,
  Heart,
  Zap,
  Globe,
  Users,
  Coffee,
  Laptop,
  Sparkles,
  ArrowRight,
  Music,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  {
    icon: Euro,
    title: "Wettbewerbsfähiges Gehalt",
    description: "Faire Vergütung und transparente Gehaltsstrukturen",
  },
  {
    icon: Laptop,
    title: "Remote-First",
    description: "Arbeite von überall – wir sind ein verteiltes Team",
  },
  {
    icon: Clock,
    title: "Flexible Arbeitszeiten",
    description: "Gestalte deinen Tag nach deinem Rhythmus",
  },
  {
    icon: Heart,
    title: "30 Tage Urlaub",
    description: "Plus Sonderurlaub für besondere Anlässe",
  },
  {
    icon: Zap,
    title: "Weiterbildungsbudget",
    description: "€2.000/Jahr für deine persönliche Entwicklung",
  },
  {
    icon: Coffee,
    title: "Team-Events",
    description: "Regelmäßige Offsites und Team-Aktivitäten",
  },
];

const openPositions = [
  {
    title: "Senior Full-Stack Developer",
    department: "Engineering",
    location: "Remote / Berlin",
    type: "Vollzeit",
    description:
      "Du entwickelst neue Features für unsere Plattform und arbeitest an skalierbaren Lösungen für tausende Nutzer.",
  },
  {
    title: "Product Designer (UI/UX)",
    department: "Design",
    location: "Remote / Berlin",
    type: "Vollzeit",
    description:
      "Gestalte intuitive Nutzererlebnisse für Komponisten und Kunden auf unserer Musikplattform.",
  },
  {
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Vollzeit",
    description:
      "Erstelle überzeugende Inhalte und baue unsere Community aus Musikliebhabern und Kreativen auf.",
  },
  {
    title: "Customer Success Manager",
    department: "Support",
    location: "Berlin",
    type: "Vollzeit",
    description:
      "Betreue unsere Enterprise-Kunden und hilf ihnen, das Beste aus Musicify herauszuholen.",
  },
  {
    title: "Music Curator",
    department: "Content",
    location: "Remote",
    type: "Teilzeit",
    description:
      "Kuratiere unseren Katalog, erstelle Playlists und entdecke neue Talente für die Plattform.",
  },
];

const values = [
  {
    icon: Music,
    title: "Musik ist unser Antrieb",
    description: "Wir lieben Musik und arbeiten daran, sie für alle zugänglich zu machen.",
  },
  {
    icon: Users,
    title: "Creator First",
    description: "Künstler stehen im Mittelpunkt all unserer Entscheidungen.",
  },
  {
    icon: Globe,
    title: "Think Global",
    description: "Wir bauen Produkte für eine weltweite Community.",
  },
  {
    icon: Zap,
    title: "Move Fast",
    description: "Schnelle Iteration und kontinuierliche Verbesserung.",
  },
];

export default function CareersPage() {
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
              Karriere
            </Badge>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl mb-6">
              Gestalte die Zukunft der <span className="gradient-text">Musik</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Wir suchen leidenschaftliche Menschen, die mit uns die Art und Weise
              verändern wollen, wie Musik lizenziert und gehandelt wird.
            </p>
            <a href="#positions">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg"
              >
                Offene Stellen ansehen
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: "15+", label: "Teammitglieder" },
              { value: "8", label: "Länder" },
              { value: "2023", label: "Gegründet" },
              { value: "€2M+", label: "Funding" },
            ].map((stat, index) => (
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

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Unsere Werte
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl mb-4">
              Was uns verbindet
            </h2>
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
                <Card className="bg-card/50 border-border/50 h-full card-hover">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
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

      {/* Benefits */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Benefits
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl mb-4">
              Mehr als nur ein Job
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Wir bieten ein Umfeld, in dem du dein Bestes geben kannst.
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
                <div className="flex items-start gap-4 p-6 rounded-xl bg-background/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Offene Stellen
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl mb-4">
              Werde Teil des Teams
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Finde die passende Stelle und bewirb dich noch heute.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {openPositions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{position.department}</Badge>
                          <Badge variant="secondary">{position.type}</Badge>
                        </div>
                        <h3 className="font-serif text-xl mb-2">{position.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {position.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {position.location}
                          </div>
                        </div>
                      </div>
                      <Button className="md:flex-shrink-0">
                        Jetzt bewerben
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Spontaneous Application */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 max-w-4xl mx-auto">
              <CardContent className="p-8 text-center">
                <Building className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="font-serif text-2xl mb-4">
                  Keine passende Stelle dabei?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Wir sind immer auf der Suche nach Talenten. Schick uns deine
                  Initiativbewerbung an{" "}
                  <a
                    href="mailto:jobs@musicify.de"
                    className="text-primary hover:underline"
                  >
                    jobs@musicify.de
                  </a>
                </p>
                <Button variant="outline" size="lg">
                  Initiativbewerbung senden
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

