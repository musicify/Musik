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
  Sparkles,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    id: "general",
    icon: HelpCircle,
    label: "Allgemein",
    faqs: [
      {
        question: "Was ist Musicify?",
        answer:
          "Musicify ist eine Plattform für Musik-Lizenzierung und Custom Music. Wir verbinden Content Creators, Agenturen und Unternehmen mit talentierten Komponisten. Du kannst entweder fertige Tracks aus unserem kuratierten Katalog lizenzieren oder individuelle Musik beauftragen.",
      },
      {
        question: "Für wen ist Musicify geeignet?",
        answer:
          "Musicify ist für alle gedacht, die hochwertige Musik für ihre Projekte suchen – von YouTubern und Podcastern bis zu Werbeagenturen und Filmproduktionen. Außerdem ist die Plattform für Komponisten, die ihre Musik verkaufen oder Custom Music Aufträge annehmen möchten.",
      },
      {
        question: "Ist Musicify kostenlos?",
        answer:
          "Die Nutzung der Plattform und das Anhören von Tracks ist kostenlos. Kosten entstehen erst, wenn du einen Track lizenzierst oder einen Custom Music Auftrag beauftragst.",
      },
    ],
  },
  {
    id: "licensing",
    icon: FileText,
    label: "Lizenzierung",
    faqs: [
      {
        question: "Welche Lizenz brauche ich?",
        answer:
          "Das hängt von deinem Projekt ab: Personal für private Projekte ohne Monetarisierung, Commercial für YouTube, Podcasts und kleinere Werbung (bis 100K Reichweite), Enterprise für TV, Film und unbegrenzte Reichweite, und Exclusive wenn du alle Rechte exklusiv erwerben möchtest.",
      },
      {
        question: "Kann ich die Lizenz später upgraden?",
        answer:
          "Ja! Du kannst jederzeit von einer niedrigeren auf eine höhere Lizenz upgraden. Kontaktiere uns einfach über das Support-Formular, und du zahlst nur die Differenz zum ursprünglichen Kaufpreis.",
      },
      {
        question: "Wie lange gilt meine Lizenz?",
        answer:
          "Alle Lizenzen sind zeitlich unbegrenzt gültig (perpetual license). Einmal gekauft, kannst du den Track für immer im lizenzierten Rahmen nutzen.",
      },
      {
        question: "Muss ich den Komponisten nennen?",
        answer:
          "Bei Personal und Commercial Lizenzen ist eine Credit-Nennung erwünscht, aber nicht zwingend erforderlich. Bei Enterprise und Exclusive Lizenzen ist keine Nennung notwendig.",
      },
    ],
  },
  {
    id: "custom",
    icon: Music,
    label: "Custom Music",
    faqs: [
      {
        question: "Wie funktioniert Custom Music?",
        answer:
          "Du beschreibst dein Projekt und deine Anforderungen, wählst einen oder mehrere Komponisten aus, und erhältst individuelle Angebote. Nach Annahme eines Angebots beginnt die Produktion. Du erhältst Entwürfe, kannst Feedback geben, und nach Abnahme des finalen Tracks erfolgt die Lieferung.",
      },
      {
        question: "Wie viel kostet Custom Music?",
        answer:
          "Die Preise variieren je nach Länge, Komplexität und Komponist. Einfache Jingles starten bei ca. €100, Standard-Tracks bei €300-800, Premium-Produktionen bei €800-2.000. Für größere Projekte sind individuelle Preise auf Anfrage möglich.",
      },
      {
        question: "Wie viele Revisionen sind inklusive?",
        answer:
          "Standardmäßig sind 2-3 Revisionen im Preis enthalten. Die genaue Anzahl wird im Angebot des Komponisten festgelegt. Zusätzliche Revisionen können gegen Aufpreis vereinbart werden.",
      },
      {
        question: "Wie lange dauert eine Custom Music Produktion?",
        answer:
          "Die Produktionszeit hängt von der Komplexität ab. Einfache Jingles können in 3-5 Tagen fertig sein, aufwändigere Produktionen dauern 2-4 Wochen. Die genaue Lieferzeit wird im Angebot angegeben.",
      },
    ],
  },
  {
    id: "download",
    icon: Download,
    label: "Downloads",
    faqs: [
      {
        question: "In welchen Formaten kann ich Tracks herunterladen?",
        answer:
          "Alle Tracks sind in hochauflösenden Formaten verfügbar: WAV (24-bit, 48kHz) für maximale Qualität und MP3 (320kbps) für kleinere Dateien. Bei Exclusive Lizenzen erhältst du zusätzlich die Stems (Einzelspuren).",
      },
      {
        question: "Wie oft kann ich einen gekauften Track herunterladen?",
        answer:
          "Unbegrenzt! Du kannst jeden gekauften Track so oft herunterladen, wie du möchtest. Alle deine Käufe findest du dauerhaft in deinem Dashboard unter 'Downloads'.",
      },
      {
        question: "Kann ich Tracks vor dem Kauf anhören?",
        answer:
          "Ja! Alle Tracks haben eine vollständige Vorschau mit Wasserzeichen. So kannst du sicherstellen, dass der Track zu deinem Projekt passt, bevor du ihn kaufst.",
      },
    ],
  },
  {
    id: "payment",
    icon: CreditCard,
    label: "Zahlung",
    faqs: [
      {
        question: "Welche Zahlungsmethoden werden akzeptiert?",
        answer:
          "Wir akzeptieren Kreditkarten (Visa, Mastercard, American Express), PayPal und Klarna. Alle Zahlungen werden sicher über verschlüsselte Verbindungen abgewickelt.",
      },
      {
        question: "Erhalte ich eine Rechnung?",
        answer:
          "Ja, nach jedem Kauf erhältst du automatisch eine Rechnung per E-Mail. Alle Rechnungen findest du auch in deinem Dashboard unter 'Rechnungen' und kannst sie jederzeit als PDF herunterladen.",
      },
      {
        question: "Kann ich auf Rechnung kaufen?",
        answer:
          "Für Unternehmen bieten wir Kauf auf Rechnung an. Kontaktiere uns für die Einrichtung eines Unternehmenskontos mit dieser Zahlungsoption.",
      },
    ],
  },
  {
    id: "account",
    icon: User,
    label: "Konto",
    faqs: [
      {
        question: "Wie erstelle ich ein Konto?",
        answer:
          "Klicke auf 'Registrieren' und gib deine E-Mail-Adresse ein. Du kannst dich auch mit Google oder Apple anmelden. Ein Konto ist für Käufe erforderlich, aber du kannst Tracks auch ohne Konto anhören.",
      },
      {
        question: "Wie kann ich mein Konto löschen?",
        answer:
          "Du kannst dein Konto in den Einstellungen unter 'Konto löschen' selbst löschen oder uns kontaktieren. Beachte, dass du danach keinen Zugriff mehr auf gekaufte Tracks hast.",
      },
      {
        question: "Wie werde ich Komponist auf Musicify?",
        answer:
          "Registriere dich und reiche dein Portfolio mit mindestens 3-5 Sample-Tracks ein. Unser Team prüft deine Bewerbung innerhalb von 48 Stunden. Nach erfolgreicher Verifizierung kannst du Tracks hochladen und Aufträge annehmen.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("general");

  // Filter FAQs based on search
  const filteredCategories = searchQuery
    ? faqCategories.map((cat) => ({
        ...cat,
        faqs: cat.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((cat) => cat.faqs.length > 0)
    : faqCategories;

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
              FAQ
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6">
              Häufig gestellte <span className="gradient-text">Fragen</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Finde schnell Antworten auf die wichtigsten Fragen zu Musicify.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="FAQ durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card/50 border-border/50"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {searchQuery ? (
            // Search Results
            <div className="max-w-3xl mx-auto">
              <p className="text-muted-foreground mb-6">
                {filteredCategories.reduce((acc, cat) => acc + cat.faqs.length, 0)} Ergebnisse für "{searchQuery}"
              </p>
              {filteredCategories.map((category) => (
                <div key={category.id} className="mb-8">
                  <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <category.icon className="w-5 h-5 text-primary" />
                    {category.label}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.id}-${index}`}
                        className="bg-card/50 border border-border/50 rounded-lg px-4"
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
                </div>
              ))}
            </div>
          ) : (
            // Category Tabs
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent mb-8">
                {faqCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <category.icon className="w-4 h-4 mr-2" />
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {faqCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                  >
                    <Accordion type="single" collapsible className="space-y-2">
                      {category.faqs.map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`item-${index}`}
                          className="bg-card/50 border border-border/50 rounded-lg px-4"
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
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <HelpCircle className="w-12 h-12 mx-auto text-primary mb-4" />
              <h2 className="font-serif text-2xl sm:text-3xl mb-4">
                Keine Antwort gefunden?
              </h2>
              <p className="text-muted-foreground mb-6">
                Unser Support-Team hilft dir gerne weiter. Wir antworten in der
                Regel innerhalb von 24 Stunden.
              </p>
              <Link href="/contact">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Mail className="w-4 h-4 mr-2" />
                  Kontakt aufnehmen
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

