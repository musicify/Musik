"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Clock,
  HelpCircle,
  FileText,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const contactInfo = [
  {
    icon: Mail,
    label: "E-Mail",
    value: "hello@musicify.de",
    href: "mailto:hello@musicify.de",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "+49 30 123 456 789",
    href: "tel:+4930123456789",
  },
  {
    icon: MapPin,
    label: "Adresse",
    value: "Musterstraße 123, 10115 Berlin",
    href: null,
  },
  {
    icon: Clock,
    label: "Support-Zeiten",
    value: "Mo-Fr, 9:00-18:00 Uhr",
    href: null,
  },
];

const topics = [
  { value: "general", label: "Allgemeine Anfrage" },
  { value: "licensing", label: "Lizenzierung" },
  { value: "technical", label: "Technischer Support" },
  { value: "director", label: "Komponist werden" },
  { value: "billing", label: "Abrechnung & Zahlung" },
  { value: "other", label: "Sonstiges" },
];

const faqs = [
  {
    question: "Wie funktioniert die Lizenzierung?",
    answer:
      "Wir bieten verschiedene Lizenztypen an: Personal für private Nutzung, Commercial für kommerzielle Projekte mit begrenzter Reichweite, Enterprise für unbegrenzte kommerzielle Nutzung und Exclusive für den vollständigen Rechtekauf. Jede Lizenz hat klare Nutzungsbedingungen, die du beim Kauf einsehen kannst.",
  },
  {
    question: "Kann ich einen Track vor dem Kauf anhören?",
    answer:
      "Ja! Alle Tracks in unserem Katalog haben eine vollständige Vorschau mit Wasserzeichen. So kannst du sicherstellen, dass der Track zu deinem Projekt passt, bevor du ihn kaufst.",
  },
  {
    question: "Wie funktioniert Custom Music?",
    answer:
      "Bei Custom Music beschreibst du dein Projekt und wählst einen oder mehrere Komponisten aus. Diese erhalten deine Anfrage und können dir ein Angebot unterbreiten. Nach Annahme des Angebots beginnt die Produktion, inklusive Revisionen bis zur finalen Abnahme.",
  },
  {
    question: "Wie werde ich Komponist auf der Plattform?",
    answer:
      "Um Komponist zu werden, registriere dich und reiche dein Portfolio mit mindestens 3-5 Sample-Tracks ein. Unser Team prüft deine Bewerbung innerhalb von 48 Stunden. Nach erfolgreicher Verifizierung kannst du Tracks hochladen und Aufträge annehmen.",
  },
  {
    question: "Welche Zahlungsmethoden werden akzeptiert?",
    answer:
      "Wir akzeptieren Kreditkarten (Visa, Mastercard, American Express), PayPal und Klarna. Alle Zahlungen werden sicher über verschlüsselte Verbindungen abgewickelt.",
  },
  {
    question: "Kann ich eine Rechnung erhalten?",
    answer:
      "Ja, nach jedem Kauf erhältst du automatisch eine Rechnung per E-Mail. Alle Rechnungen findest du auch in deinem Dashboard unter 'Rechnungen'.",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

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
              <MessageSquare className="w-3 h-3 mr-1" />
              Kontakt
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6">
              Wie können wir <span className="gradient-text">helfen</span>?
            </h1>
            <p className="text-lg text-muted-foreground">
              Hast du Fragen zu unserer Plattform, Lizenzierung oder einem
              laufenden Projekt? Wir sind für dich da.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-background/50 border-border/50 h-full">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-medium">{info.value}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">
                    Nachricht senden
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Send className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">
                        Nachricht gesendet!
                      </h3>
                      <p className="text-muted-foreground">
                        Wir werden uns innerhalb von 24 Stunden bei dir melden.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            placeholder="Dein Name"
                            className="mt-1 bg-background"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">E-Mail *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="deine@email.de"
                            className="mt-1 bg-background"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Thema *</Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Thema auswählen" />
                          </SelectTrigger>
                          <SelectContent>
                            {topics.map((topic) => (
                              <SelectItem key={topic.value} value={topic.value}>
                                {topic.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subject">Betreff *</Label>
                        <Input
                          id="subject"
                          placeholder="Worum geht es?"
                          className="mt-1 bg-background"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Nachricht *</Label>
                        <Textarea
                          id="message"
                          placeholder="Beschreibe dein Anliegen..."
                          className="mt-1 bg-background"
                          rows={5}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                            Wird gesendet...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Nachricht senden
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl">Häufige Fragen</h2>
              </div>

              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
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

              <Card className="mt-8 bg-primary/10 border-primary/20">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Mehr Fragen?</p>
                    <p className="text-sm text-muted-foreground">
                      Besuche unser ausführliches{" "}
                      <a href="/help" className="text-primary hover:underline">
                        Hilfe-Center
                      </a>{" "}
                      für weitere Informationen.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="aspect-[21/9] rounded-2xl bg-secondary/50 flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Musicify GmbH · Musterstraße 123 · 10115 Berlin
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

