"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  X,
  HelpCircle,
  Music,
  Mic2,
  ArrowRight,
  Sparkles,
  Star,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const marketplaceLicenses = [
  {
    name: "Personal",
    icon: "🎵",
    price: "ab €29",
    description: "Für private, nicht-kommerzielle Projekte",
    features: [
      { text: "Private Nutzung", included: true },
      { text: "Hobbyprojekte", included: true },
      { text: "Keine Monetarisierung", included: true },
      { text: "Wasserzeichen-freier Download", included: true },
      { text: "Kommerzielle Nutzung", included: false },
      { text: "Werbekampagnen", included: false },
    ],
    color: "green",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    name: "Commercial",
    icon: "🎬",
    price: "ab €49",
    description: "Für YouTube, Social Media & kleine Kampagnen",
    features: [
      { text: "Alles aus Personal", included: true },
      { text: "YouTube & Social Media", included: true },
      { text: "Monetarisierung erlaubt", included: true },
      { text: "Kleine Werbekampagnen", included: true },
      { text: "Bis 100K Reichweite", included: true },
      { text: "TV & Film", included: false },
    ],
    popular: true,
    color: "primary",
    gradient: "from-primary/20 to-accent/20",
  },
  {
    name: "Enterprise",
    icon: "🏢",
    price: "ab €199",
    description: "Für unbegrenzte kommerzielle Nutzung",
    features: [
      { text: "Alles aus Commercial", included: true },
      { text: "Unbegrenzte Reichweite", included: true },
      { text: "TV, Film & Kino", included: true },
      { text: "Große Werbekampagnen", included: true },
      { text: "Alle Dateiformate", included: true },
      { text: "Prioritäts-Support", included: true },
    ],
    color: "purple",
    gradient: "from-purple-500/20 to-violet-500/20",
  },
  {
    name: "Exclusive",
    icon: "🔒",
    price: "auf Anfrage",
    description: "Exklusivrechte am Track",
    features: [
      { text: "Alle Rechte übertragen", included: true },
      { text: "Track wird entfernt", included: true },
      { text: "Einzigartige Nutzung", included: true },
      { text: "Stems inklusive", included: true },
      { text: "Full Buyout", included: true },
      { text: "Rechtliche Übertragung", included: true },
    ],
    color: "amber",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
];

const customMusicPricing = [
  {
    range: "€100 - €300",
    description: "Kurze Jingles & Intros",
    examples: ["Podcast Intros", "YouTube Intros", "Notification Sounds"],
    duration: "10-30 Sekunden",
  },
  {
    range: "€300 - €800",
    description: "Standard Tracks",
    examples: ["Background Music", "Social Media Content", "Präsentationen"],
    duration: "1-3 Minuten",
  },
  {
    range: "€800 - €2.000",
    description: "Premium Produktionen",
    examples: ["Werbemusik", "Corporate Videos", "App Soundtracks"],
    duration: "2-5 Minuten",
  },
  {
    range: "€2.000+",
    description: "Große Projekte",
    examples: ["Film Scores", "TV Serien", "Games"],
    duration: "5+ Minuten / Multiple Tracks",
  },
];

const faqs = [
  {
    question: "Was ist der Unterschied zwischen den Lizenzen?",
    answer:
      "Die Lizenzen unterscheiden sich hauptsächlich in der erlaubten Reichweite und dem Verwendungszweck. Personal ist nur für private Projekte, Commercial für kleinere kommerzielle Nutzung bis 100K Reichweite, Enterprise für unbegrenzte kommerzielle Nutzung, und Exclusive überträgt alle Rechte an dich.",
  },
  {
    question: "Kann ich eine Lizenz upgraden?",
    answer:
      "Ja! Du kannst jederzeit von einer niedrigeren auf eine höhere Lizenz upgraden. Du zahlst dann nur die Differenz zum ursprünglichen Kaufpreis.",
  },
  {
    question: "Sind Revisionen bei Custom Music inklusive?",
    answer:
      "Ja, standardmäßig sind 2-3 Revisionen im Preis enthalten. Zusätzliche Revisionen können gegen einen Aufpreis vereinbart werden. Die genaue Anzahl wird im Angebot des Komponisten festgelegt.",
  },
  {
    question: "Wie lange dauert eine Custom Music Produktion?",
    answer:
      "Die Produktionszeit hängt von der Komplexität des Projekts ab. Einfache Jingles können in 3-5 Tagen fertig sein, aufwändigere Produktionen dauern 2-4 Wochen. Die genaue Lieferzeit wird im Angebot des Komponisten angegeben.",
  },
  {
    question: "Was passiert bei einer Exclusive Lizenz?",
    answer:
      "Bei einer Exclusive Lizenz werden alle Rechte am Track an dich übertragen. Der Track wird aus dem Marktplatz entfernt und kann von niemandem sonst mehr erworben werden. Du erhältst auch die Stems (Einzelspuren).",
  },
];

export default function PricingPage() {
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
              Preise & Lizenzen
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6">
              Faire Preise für <span className="gradient-text">jeden Bedarf</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Transparente Lizenzmodelle für den Marktplatz und flexible Preise
              für individuelle Musikproduktion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="marketplace" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="marketplace" className="gap-2">
                <Music className="w-4 h-4" />
                Marktplatz
              </TabsTrigger>
              <TabsTrigger value="custom" className="gap-2">
                <Mic2 className="w-4 h-4" />
                Custom Music
              </TabsTrigger>
            </TabsList>

            {/* Marketplace Licenses */}
            <TabsContent value="marketplace">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {marketplaceLicenses.map((license, index) => (
                  <motion.div
                    key={license.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {license.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <Badge className="bg-primary text-primary-foreground">
                          <Star className="w-3 h-3 mr-1" />
                          Beliebt
                        </Badge>
                      </div>
                    )}
                    <Card
                      className={`h-full bg-gradient-to-br ${license.gradient} border-border/50 ${
                        license.popular ? "border-primary/50 shadow-glow-sm" : ""
                      }`}
                    >
                      <CardHeader className="text-center">
                        <span className="text-4xl mb-2">{license.icon}</span>
                        <CardTitle className="font-serif text-2xl">
                          {license.name}
                        </CardTitle>
                        <p className="text-3xl font-serif mt-2">{license.price}</p>
                        <p className="text-sm text-muted-foreground">
                          {license.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {license.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
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
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link href="/marketplace">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg"
                  >
                    <Music className="w-5 h-5 mr-2" />
                    Zum Marktplatz
                  </Button>
                </Link>
              </div>
            </TabsContent>

            {/* Custom Music Pricing */}
            <TabsContent value="custom">
              <div className="max-w-4xl mx-auto">
                <div className="grid sm:grid-cols-2 gap-6 mb-12">
                  {customMusicPricing.map((tier, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-card/50 border-border/50 h-full">
                        <CardContent className="p-6">
                          <p className="text-2xl font-serif text-primary mb-2">
                            {tier.range}
                          </p>
                          <p className="font-medium mb-1">{tier.description}</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Typische Länge: {tier.duration}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {tier.examples.map((example) => (
                              <Badge key={example} variant="secondary">
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="font-serif text-2xl mb-4">
                          Individuelle Preisgestaltung
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Die tatsächlichen Preise hängen von verschiedenen Faktoren
                          ab: Länge, Komplexität, gewünschte Lizenz und der
                          Erfahrung des Komponisten. Du erhältst individuelle
                          Angebote von den Komponisten deiner Wahl.
                        </p>
                        <ul className="space-y-2">
                          {[
                            "Kostenlose Anfragen",
                            "Vergleiche mehrere Angebote",
                            "2-3 Revisionen inklusive",
                            "Sichere Zahlungsabwicklung",
                          ].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-center">
                        <Link href="/custom-music">
                          <Button
                            size="lg"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg"
                          >
                            <Mic2 className="w-5 h-5 mr-2" />
                            Auftrag starten
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* License Comparison Table */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl mb-4">
              Lizenz-Vergleich im Detail
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Eine detaillierte Übersicht aller Nutzungsrechte je Lizenztyp.
            </p>
          </div>

          <Card className="bg-background/50 border-border/50 overflow-hidden max-w-5xl mx-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Nutzungsrecht</TableHead>
                  <TableHead className="text-center">Personal</TableHead>
                  <TableHead className="text-center bg-primary/5">Commercial</TableHead>
                  <TableHead className="text-center">Enterprise</TableHead>
                  <TableHead className="text-center">Exclusive</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { feature: "Private Nutzung", personal: true, commercial: true, enterprise: true, exclusive: true },
                  { feature: "YouTube (monetarisiert)", personal: false, commercial: true, enterprise: true, exclusive: true },
                  { feature: "Social Media Ads", personal: false, commercial: true, enterprise: true, exclusive: true },
                  { feature: "Podcasts", personal: false, commercial: true, enterprise: true, exclusive: true },
                  { feature: "TV & Film", personal: false, commercial: false, enterprise: true, exclusive: true },
                  { feature: "Werbekampagnen (groß)", personal: false, commercial: false, enterprise: true, exclusive: true },
                  { feature: "Unbegrenzte Reichweite", personal: false, commercial: false, enterprise: true, exclusive: true },
                  { feature: "Stems inklusive", personal: false, commercial: false, enterprise: false, exclusive: true },
                  { feature: "Exklusivrechte", personal: false, commercial: false, enterprise: false, exclusive: true },
                ].map((row) => (
                  <TableRow key={row.feature}>
                    <TableCell className="font-medium">{row.feature}</TableCell>
                    <TableCell className="text-center">
                      {row.personal ? (
                        <Check className="w-4 h-4 mx-auto text-green-500" />
                      ) : (
                        <X className="w-4 h-4 mx-auto text-muted-foreground/30" />
                      )}
                    </TableCell>
                    <TableCell className="text-center bg-primary/5">
                      {row.commercial ? (
                        <Check className="w-4 h-4 mx-auto text-green-500" />
                      ) : (
                        <X className="w-4 h-4 mx-auto text-muted-foreground/30" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.enterprise ? (
                        <Check className="w-4 h-4 mx-auto text-green-500" />
                      ) : (
                        <X className="w-4 h-4 mx-auto text-muted-foreground/30" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.exclusive ? (
                        <Check className="w-4 h-4 mx-auto text-green-500" />
                      ) : (
                        <X className="w-4 h-4 mx-auto text-muted-foreground/30" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Sichere Lizenzen",
                description: "Rechtssichere Lizenzzertifikate für jeden Kauf",
              },
              {
                icon: Zap,
                title: "Sofort verfügbar",
                description: "Direkter Download nach erfolgreicher Zahlung",
              },
              {
                icon: HelpCircle,
                title: "Support inklusive",
                description: "Bei Fragen zur Lizenzierung sind wir für dich da",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl mb-4">
                Häufige Fragen zu Preisen & Lizenzen
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-background/50 border border-border/50 rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Weitere Fragen? Wir helfen gerne!
              </p>
              <Link href="/contact">
                <Button variant="outline">Kontakt aufnehmen</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
