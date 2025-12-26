"use client";

import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Image,
  Mail,
  ExternalLink,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pressReleases = [
  {
    title: "Musicify erreicht 10.000 Tracks im Katalog",
    date: "2024-01-20",
    excerpt:
      "Die Musik-Lizenzierungsplattform erreicht einen wichtigen Meilenstein mit über 10.000 lizenzierbaren Tracks.",
  },
  {
    title: "Musicify schließt Seed-Finanzierung ab",
    date: "2024-01-05",
    excerpt:
      "Die Berliner Plattform sichert sich €2 Millionen für die Expansion und Produktentwicklung.",
  },
  {
    title: "Launch von Custom Music Feature",
    date: "2023-12-15",
    excerpt:
      "Neues Feature ermöglicht Kunden, individuelle Musik direkt von Komponisten zu beauftragen.",
  },
  {
    title: "Musicify startet in Deutschland",
    date: "2023-10-01",
    excerpt:
      "Die neue Plattform für Musik-Lizenzierung und Custom Music geht an den Start.",
  },
];

const mediaCoverage = [
  {
    publication: "Gründerszene",
    title: "Musicify: Das Spotify für Stockmusik",
    date: "2024-01-22",
    url: "#",
  },
  {
    publication: "t3n",
    title: "Wie ein Berliner Startup die Musikbranche aufmischt",
    date: "2024-01-15",
    url: "#",
  },
  {
    publication: "MusikWoche",
    title: "Interview: Faire Vergütung für Komponisten",
    date: "2024-01-08",
    url: "#",
  },
];

const stats = [
  { value: "10K+", label: "Tracks" },
  { value: "50+", label: "Komponisten" },
  { value: "5K+", label: "Kunden" },
  { value: "€2M", label: "Funding" },
];

const brandAssets = [
  {
    name: "Logo Pack",
    description: "Logo in verschiedenen Formaten (SVG, PNG, EPS)",
    icon: Image,
  },
  {
    name: "Brand Guidelines",
    description: "Richtlinien zur Verwendung unserer Marke",
    icon: FileText,
  },
  {
    name: "Produktbilder",
    description: "Screenshots und Mockups der Plattform",
    icon: Image,
  },
  {
    name: "Gründerfotos",
    description: "Hochauflösende Fotos des Gründerteams",
    icon: Image,
  },
];

export default function PressPage() {
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
              Presse
            </Badge>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl mb-6">
              Presse & <span className="gradient-text">Medien</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Pressemitteilungen, Medienkontakt und Ressourcen für Journalisten.
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Mail className="w-5 h-5 mr-2" />
              Pressekontakt
            </Button>
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

      {/* Company Description */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl mb-6">Über Musicify</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted-foreground mb-4">
                Musicify ist eine Berliner Plattform für Musik-Lizenzierung und
                Custom Music, die 2023 gegründet wurde. Die Plattform verbindet
                talentierte Komponisten mit Content Creators, Agenturen und
                Unternehmen, die hochwertige Musik für ihre Projekte suchen.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Mit einem kuratierten Katalog von über 10.000 Tracks und einem
                innovativen Custom Music Feature ermöglicht Musicify eine
                transparente und faire Lizenzierung für alle Beteiligten.
                Komponisten erhalten 85% des Verkaufspreises – einer der höchsten
                Anteile in der Branche.
              </p>
              <p className="text-lg text-muted-foreground">
                Das Unternehmen hat eine Seed-Finanzierung von €2 Millionen
                abgeschlossen und plant die Expansion in weitere europäische
                Märkte.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Aktuelles
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl">
              Pressemitteilungen
            </h2>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {pressReleases.map((release, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-background/50 border-border/50 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(release.date).toLocaleDateString("de-DE", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                        <h3 className="font-serif text-xl mb-2 group-hover:text-primary transition-colors">
                          {release.title}
                        </h3>
                        <p className="text-muted-foreground">{release.excerpt}</p>
                      </div>
                      <Button variant="outline" className="md:flex-shrink-0">
                        Lesen
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              In den Medien
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl">
              Medienberichte
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {mediaCoverage.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <Card className="bg-card/50 border-border/50 h-full group cursor-pointer">
                    <CardContent className="p-6">
                      <p className="text-sm text-primary mb-2">
                        {article.publication}
                      </p>
                      <h3 className="font-medium mb-3 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          {new Date(article.date).toLocaleDateString("de-DE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Downloads
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl mb-4">
              Markenressourcen
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Logos, Bilder und Materialien für redaktionelle Zwecke.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {brandAssets.map((asset, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-background/50 border-border/50 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <asset.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{asset.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {asset.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 mx-auto text-primary mb-4" />
              <h2 className="font-serif text-3xl mb-4">Pressekontakt</h2>
              <p className="text-muted-foreground mb-6">
                Für Presseanfragen, Interviews oder weitere Informationen wenden
                Sie sich bitte an unser Kommunikationsteam.
              </p>
              <div className="space-y-2 mb-6">
                <p className="font-medium">Lisa Müller</p>
                <p className="text-muted-foreground">Head of Communications</p>
                <a
                  href="mailto:presse@musicify.de"
                  className="text-primary hover:underline"
                >
                  presse@musicify.de
                </a>
              </div>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Mail className="w-5 h-5 mr-2" />
                E-Mail schreiben
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

