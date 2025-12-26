"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  HelpCircle,
  ShoppingCart,
  Music,
  Download,
  CreditCard,
  User,
  FileText,
  MessageSquare,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const categories = [
  {
    icon: ShoppingCart,
    title: "Kauf & Lizenzierung",
    description: "Lizenzen, Preise und Kaufprozess",
    articles: 12,
    href: "/help/licensing",
  },
  {
    icon: Music,
    title: "Custom Music",
    description: "Individuelle Musikproduktion beauftragen",
    articles: 8,
    href: "/help/custom-music",
  },
  {
    icon: Download,
    title: "Downloads",
    description: "Dateiformate, Downloads und Nutzung",
    articles: 6,
    href: "/help/downloads",
  },
  {
    icon: CreditCard,
    title: "Zahlung & Rechnung",
    description: "Zahlungsmethoden und Rechnungen",
    articles: 10,
    href: "/help/payments",
  },
  {
    icon: User,
    title: "Konto & Profil",
    description: "Account-Verwaltung und Einstellungen",
    articles: 7,
    href: "/help/account",
  },
  {
    icon: FileText,
    title: "Für Komponisten",
    description: "Upload, Vergütung und Aufträge",
    articles: 15,
    href: "/help/artists",
  },
];

const popularArticles = [
  {
    title: "Welche Lizenz brauche ich?",
    category: "Lizenzierung",
    href: "/help/licensing/which-license",
  },
  {
    title: "Wie funktioniert Custom Music?",
    category: "Custom Music",
    href: "/help/custom-music/how-it-works",
  },
  {
    title: "Kann ich einen Track vor dem Kauf anhören?",
    category: "Kauf",
    href: "/help/licensing/preview",
  },
  {
    title: "Wie erhalte ich meine Rechnung?",
    category: "Zahlung",
    href: "/help/payments/invoice",
  },
  {
    title: "Wie werde ich Komponist auf Musicify?",
    category: "Für Komponisten",
    href: "/help/artists/become-composer",
  },
  {
    title: "Was passiert bei einer Exclusive Lizenz?",
    category: "Lizenzierung",
    href: "/help/licensing/exclusive",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
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
              Hilfe-Center
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6">
              Wie können wir <span className="gradient-text">helfen</span>?
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Finde Antworten auf deine Fragen oder kontaktiere unser
              Support-Team.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Suche nach Artikeln..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-card/50 border-border/50"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl">Themenbereiche</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={category.href}>
                  <Card className="bg-card/50 border-border/50 h-full group cursor-pointer card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <category.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                            {category.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {category.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {category.articles} Artikel
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Beliebt
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl">
              Häufig gestellte Fragen
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-4">
              {popularArticles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={article.href}>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-background transition-colors group">
                      <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {article.category}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/faq">
                <Button variant="outline">
                  Alle FAQ ansehen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 max-w-3xl mx-auto">
            <CardContent className="p-8 sm:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <MessageSquare className="w-12 h-12 text-primary mb-4" />
                  <h2 className="font-serif text-2xl sm:text-3xl mb-4">
                    Keine Antwort gefunden?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Unser Support-Team hilft dir gerne weiter. Wir antworten in
                    der Regel innerhalb von 24 Stunden.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/contact">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Mail className="w-4 h-4 mr-2" />
                        Kontakt aufnehmen
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                    <HelpCircle className="w-16 h-16 text-primary/50" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

