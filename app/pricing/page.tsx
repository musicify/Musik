"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Music,
  Building,
  Crown,
  Star,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const licenses = [
  {
    name: "Personal",
    description: "Für private Projekte ohne kommerzielle Nutzung",
    price: "ab €29",
    icon: Music,
    color: "from-green-500 to-emerald-500",
    popular: false,
    features: [
      { text: "Persönliche Nutzung", included: true },
      { text: "Social Media (privat)", included: true },
      { text: "Hochzeit/Events", included: true },
      { text: "YouTube (ohne Monetarisierung)", included: true },
      { text: "Kommerzielle Nutzung", included: false },
      { text: "Werbung/Marketing", included: false },
      { text: "Broadcast/TV", included: false },
      { text: "Exklusivrechte", included: false },
    ],
  },
  {
    name: "Commercial",
    description: "Für Business und kommerzielle Projekte",
    price: "ab €79",
    icon: Building,
    color: "from-blue-500 to-indigo-500",
    popular: true,
    features: [
      { text: "Persönliche Nutzung", included: true },
      { text: "Social Media (monetarisiert)", included: true },
      { text: "YouTube (monetarisiert)", included: true },
      { text: "Werbung/Marketing", included: true },
      { text: "Unternehmensvideos", included: true },
      { text: "Podcasts", included: true },
      { text: "Broadcast/TV", included: false },
      { text: "Exklusivrechte", included: false },
    ],
  },
  {
    name: "Enterprise",
    description: "Für große Unternehmen und Broadcasts",
    price: "ab €199",
    icon: Crown,
    color: "from-purple-500 to-violet-500",
    popular: false,
    features: [
      { text: "Alle Commercial-Features", included: true },
      { text: "TV/Film/Kino", included: true },
      { text: "Nationale Werbung", included: true },
      { text: "Internationale Nutzung", included: true },
      { text: "Mehrfache Projekte", included: true },
      { text: "Team-Lizenz", included: true },
      { text: "Prioritäts-Support", included: true },
      { text: "Exklusivrechte", included: false },
    ],
  },
  {
    name: "Exclusive",
    description: "Exklusivrechte - nur für dich",
    price: "ab €499",
    icon: Star,
    color: "from-amber-500 to-orange-500",
    popular: false,
    features: [
      { text: "Alle Enterprise-Features", included: true },
      { text: "Exklusive Nutzungsrechte", included: true },
      { text: "Track wird delisted", included: true },
      { text: "Stems/Projektdateien", included: true },
      { text: "Bearbeitungsrechte", included: true },
      { text: "Weiterverkaufsrechte", included: true },
      { text: "Unbegrenzte Laufzeit", included: true },
      { text: "Buyout-Option", included: true },
    ],
  },
];

const faqs = [
  {
    question: "Welche Lizenz brauche ich für YouTube?",
    answer:
      "Für private YouTube-Videos ohne Monetarisierung reicht die Personal-Lizenz. Sobald du Geld mit deinen Videos verdienst (z.B. durch Werbung oder Sponsoring), benötigst du die Commercial-Lizenz.",
  },
  {
    question: "Kann ich die Musik nach dem Kauf bearbeiten?",
    answer:
      "Mit der Personal- und Commercial-Lizenz darfst du die Länge anpassen und die Musik an dein Projekt anpassen. Stems und umfangreiche Bearbeitungsrechte erhältst du nur mit der Exclusive-Lizenz.",
  },
  {
    question: "Wie lange ist die Lizenz gültig?",
    answer:
      "Alle Lizenzen sind zeitlich unbegrenzt für das spezifische Projekt, für das sie erworben wurden. Du kannst die Musik dauerhaft nutzen.",
  },
  {
    question: "Was passiert bei einem Copyright-Claim?",
    answer:
      "Wir stellen dir eine Lizenzbescheinigung aus, mit der du jeden Copyright-Claim auf YouTube und anderen Plattformen schnell klären kannst. Unser Support hilft dir dabei.",
  },
  {
    question: "Kann ich eine Lizenz upgraden?",
    answer:
      "Ja! Du zahlst nur die Differenz zum höheren Lizenzmodell. Kontaktiere uns einfach mit deiner Bestellnummer.",
  },
  {
    question: "Gibt es Rabatte für mehrere Tracks?",
    answer:
      "Ja! Ab 3 Tracks erhältst du 10% Rabatt, ab 5 Tracks 15% und ab 10 Tracks 20%. Für größere Volumenlizenzierungen kontaktiere uns direkt.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">
              Transparente Preise
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6">
              Faire Lizenzen für{" "}
              <span className="gradient-text">jedes Projekt</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Wähle das passende Lizenzmodell für dein Projekt. Keine versteckten
              Kosten, klare Nutzungsbedingungen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* License Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {licenses.map((license, index) => (
              <motion.div
                key={license.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`bg-card border-border/50 h-full relative ${
                    license.popular ? "border-primary" : ""
                  }`}
                >
                  {license.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary">Beliebt</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${license.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <license.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{license.name}</CardTitle>
                    <CardDescription>{license.description}</CardDescription>
                    <p className="text-3xl font-serif mt-4">{license.price}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {license.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                        )}
                        <span
                          className={
                            feature.included ? "" : "text-muted-foreground/50"
                          }
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                    <Link href="/marketplace" className="block pt-4">
                      <Button
                        className={`w-full ${
                          license.popular
                            ? "bg-primary hover:bg-primary/90"
                            : ""
                        }`}
                        variant={license.popular ? "default" : "outline"}
                      >
                        Musik entdecken
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Music Section */}
      <section className="py-16 bg-card/50 border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge variant="secondary" className="mb-4">
                Custom Music
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl mb-6">
                Maßgeschneiderte Musik für dein Projekt
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Lass dir von unseren verifizierten Komponisten einzigartige Musik
                erstellen. Preise variieren je nach Umfang und Anforderungen.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <Card className="bg-card border-border/50">
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-serif gradient-text mb-2">
                      ab €150
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Kurze Jingles & Intros
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border/50">
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-serif gradient-text mb-2">
                      ab €350
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Komplette Songs
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border/50">
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-serif gradient-text mb-2">
                      ab €800
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Soundtracks & Alben
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Link href="/custom-music">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Auftrag erstellen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">
              <HelpCircle className="w-3 h-3 mr-1" />
              FAQ
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl">
              Häufig gestellte Fragen
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="border border-border/50 rounded-lg px-6 bg-card"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">
              Noch Fragen? Wir helfen dir gerne weiter.
            </p>
            <Link href="/contact">
              <Button variant="outline">Kontakt aufnehmen</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

