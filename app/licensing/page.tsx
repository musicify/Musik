"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  X,
  HelpCircle,
  FileText,
  Shield,
  ArrowRight,
  Sparkles,
  Music,
  Building,
  User,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const licenses = [
  {
    name: "Personal",
    icon: User,
    price: "ab €29",
    description: "Für private, nicht-kommerzielle Projekte",
    color: "green",
    useCases: ["Private Videos", "Hobbyprojekte", "Familienvideos", "Schulprojekte"],
  },
  {
    name: "Commercial",
    icon: Building,
    price: "ab €49",
    description: "Für YouTube, Social Media & kleine Kampagnen",
    color: "primary",
    useCases: ["YouTube (monetarisiert)", "Podcasts", "Social Media Ads", "Kleine Werbekampagnen"],
  },
  {
    name: "Enterprise",
    icon: Shield,
    price: "ab €199",
    description: "Für unbegrenzte kommerzielle Nutzung",
    color: "purple",
    useCases: ["TV & Film", "Große Werbekampagnen", "Kino", "Unbegrenzte Reichweite"],
  },
  {
    name: "Exclusive",
    icon: Lock,
    price: "auf Anfrage",
    description: "Exklusivrechte am Track",
    color: "amber",
    useCases: ["Full Buyout", "Exklusive Nutzung", "Stems inklusive", "Alle Rechte übertragen"],
  },
];

const comparisonData = [
  { feature: "Private Nutzung", personal: true, commercial: true, enterprise: true, exclusive: true },
  { feature: "YouTube (monetarisiert)", personal: false, commercial: true, enterprise: true, exclusive: true },
  { feature: "Social Media Ads", personal: false, commercial: true, enterprise: true, exclusive: true },
  { feature: "Podcasts", personal: false, commercial: true, enterprise: true, exclusive: true },
  { feature: "Reichweite bis 100K", personal: true, commercial: true, enterprise: true, exclusive: true },
  { feature: "Unbegrenzte Reichweite", personal: false, commercial: false, enterprise: true, exclusive: true },
  { feature: "TV & Film", personal: false, commercial: false, enterprise: true, exclusive: true },
  { feature: "Werbekampagnen (groß)", personal: false, commercial: false, enterprise: true, exclusive: true },
  { feature: "Streams inklusive", personal: false, commercial: false, enterprise: true, exclusive: true },
  { feature: "Stems inklusive", personal: false, commercial: false, enterprise: false, exclusive: true },
  { feature: "Exklusivrechte", personal: false, commercial: false, enterprise: false, exclusive: true },
  { feature: "Track wird entfernt", personal: false, commercial: false, enterprise: false, exclusive: true },
];

const faqs = [
  {
    question: "Was ist der Unterschied zwischen den Lizenzen?",
    answer:
      "Die Lizenzen unterscheiden sich hauptsächlich in der erlaubten Reichweite und dem Verwendungszweck. Personal ist nur für private Projekte, Commercial für kleinere kommerzielle Nutzung bis 100K Reichweite, Enterprise für unbegrenzte kommerzielle Nutzung, und Exclusive überträgt alle Rechte exklusiv an dich.",
  },
  {
    question: "Kann ich eine Lizenz upgraden?",
    answer:
      "Ja! Du kannst jederzeit von einer niedrigeren auf eine höhere Lizenz upgraden. Du zahlst dann nur die Differenz zum ursprünglichen Kaufpreis. Kontaktiere uns einfach über das Support-Formular.",
  },
  {
    question: "Muss ich den Komponisten nennen (Credit)?",
    answer:
      "Bei Personal und Commercial Lizenzen ist eine Credit-Nennung erwünscht, aber nicht zwingend erforderlich. Bei Enterprise und Exclusive Lizenzen ist keine Nennung notwendig.",
  },
  {
    question: "Kann ich die Musik bearbeiten?",
    answer:
      "Ja, du darfst die Musik für dein Projekt anpassen (kürzen, loopen, etc.). Bei Exclusive Lizenzen erhältst du zusätzlich die Stems für maximale Flexibilität.",
  },
  {
    question: "Wie lange gilt die Lizenz?",
    answer:
      "Alle Lizenzen gelten zeitlich unbegrenzt (perpetual). Einmal gekauft, kannst du den Track für immer im lizenzierten Rahmen nutzen.",
  },
  {
    question: "Was passiert bei einer Exclusive Lizenz mit dem Track?",
    answer:
      "Bei einer Exclusive Lizenz wird der Track aus dem Katalog entfernt und kann nicht mehr von anderen Nutzern erworben werden. Du bist dann der einzige Lizenznehmer.",
  },
];

export default function LicensingPage() {
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
              Lizenzierung
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6">
              Klare Lizenzen für <span className="gradient-text">jeden Bedarf</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Transparente Lizenzmodelle ohne versteckte Kosten. Wähle die
              passende Lizenz für dein Projekt.
            </p>
          </motion.div>
        </div>
      </section>

      {/* License Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {licenses.map((license, index) => (
              <motion.div
                key={license.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card/50 border-border/50 h-full">
                  <CardHeader className="text-center pb-4">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <license.icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="font-serif text-2xl">
                      {license.name}
                    </CardTitle>
                    <p className="text-3xl font-serif text-primary">
                      {license.price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {license.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {license.useCases.map((useCase) => (
                        <li
                          key={useCase}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {useCase}
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

      {/* Comparison Table */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Vergleich
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl mb-4">
              Lizenz-Vergleich im Detail
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Eine detaillierte Übersicht aller Nutzungsrechte je Lizenztyp.
            </p>
          </div>

          <Card className="bg-background/50 border-border/50 overflow-hidden max-w-5xl mx-auto overflow-x-auto">
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
                {comparisonData.map((row) => (
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

      {/* License Certificate */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-4">
                Rechtssicherheit
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl mb-6">
                Lizenzzertifikat inklusive
              </h2>
              <p className="text-muted-foreground mb-6">
                Bei jedem Kauf erhältst du ein offizielles Lizenzzertifikat als
                PDF. Dieses Dokument bestätigt deine Nutzungsrechte und enthält
                alle wichtigen Informationen:
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Eindeutige Lizenznummer",
                  "Track-Informationen und Komponist",
                  "Lizenztyp und Nutzungsrechte",
                  "Kaufdatum und Gültigkeit",
                  "Käuferinformationen",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/marketplace">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Music className="w-5 h-5 mr-2" />
                  Zum Marktplatz
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card/50 border-border/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-8 h-8 text-primary" />
                    <span className="font-serif text-xl">Musicify</span>
                  </div>
                  <Badge>Lizenzzertifikat</Badge>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Lizenz-Nr.</span>
                    <span className="font-mono">LIC-2024-XXXXX</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Track</span>
                    <span>Urban Dreams</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Komponist</span>
                    <span>Max Müller</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Lizenztyp</span>
                    <Badge variant="outline">Commercial</Badge>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Gültig bis</span>
                    <span>Unbegrenzt</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
                  <Shield className="w-6 h-6 text-green-500" />
                  <span className="text-xs text-muted-foreground">
                    Rechtsgültig nach deutschem Recht
                  </span>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <HelpCircle className="w-3 h-3 mr-1" />
                FAQ
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl">
                Häufige Fragen zur Lizenzierung
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
                <Button variant="outline">
                  Kontakt aufnehmen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

