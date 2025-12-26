"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Send,
  Clock,
  HelpCircle,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactMethods = [
  {
    icon: Mail,
    title: "E-Mail",
    value: "support@musicify.de",
    description: "Antwort innerhalb von 24h",
  },
  {
    icon: Phone,
    title: "Telefon",
    value: "+49 30 12345678",
    description: "Mo-Fr 9-18 Uhr",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    value: "Im Dashboard",
    description: "Schnelle Hilfe in Echtzeit",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">
              <HelpCircle className="w-3 h-3 mr-1" />
              Hilfe & Support
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6">
              Wir sind für dich da
            </h1>
            <p className="text-lg text-muted-foreground">
              Hast du Fragen oder brauchst Unterstützung? Unser Team hilft dir
              gerne weiter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card border-border/50 h-full text-center card-hover">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <method.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{method.title}</h3>
                    <p className="text-primary font-medium mb-1">{method.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Kontaktformular</CardTitle>
                  <CardDescription>
                    Fülle das Formular aus und wir melden uns schnellstmöglich.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Nachricht gesendet!
                      </h3>
                      <p className="text-muted-foreground">
                        Wir haben deine Anfrage erhalten und melden uns
                        schnellstmöglich bei dir.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Vorname</Label>
                          <Input id="firstName" required />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Nachname</Label>
                          <Input id="lastName" required />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">E-Mail</Label>
                        <Input id="email" type="email" required />
                      </div>
                      <div>
                        <Label htmlFor="topic">Thema</Label>
                        <Select required>
                          <SelectTrigger id="topic">
                            <SelectValue placeholder="Wähle ein Thema" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">
                              Allgemeine Anfrage
                            </SelectItem>
                            <SelectItem value="licensing">
                              Lizenzierung
                            </SelectItem>
                            <SelectItem value="technical">
                              Technischer Support
                            </SelectItem>
                            <SelectItem value="billing">
                              Zahlung & Rechnung
                            </SelectItem>
                            <SelectItem value="partnership">
                              Partnerschaft
                            </SelectItem>
                            <SelectItem value="other">Sonstiges</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="message">Nachricht</Label>
                        <Textarea
                          id="message"
                          rows={5}
                          placeholder="Wie können wir dir helfen?"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
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

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="bg-card border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    Unternehmen
                  </h3>
                  <div className="space-y-3 text-muted-foreground">
                    <p className="font-medium text-foreground">
                      Musicify GmbH
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      Musterstraße 123
                      <br />
                      10115 Berlin
                      <br />
                      Deutschland
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      hello@musicify.de
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      +49 30 12345678
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Support-Zeiten
                  </h3>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Montag - Freitag</span>
                      <span className="text-foreground">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Samstag</span>
                      <span className="text-foreground">10:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sonntag</span>
                      <span className="text-foreground">Geschlossen</span>
                    </div>
                    <p className="text-sm pt-2">
                      Alle Zeiten in MEZ/MESZ (Berlin)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Schnelle Hilfe gesucht?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    In unseren FAQs findest du Antworten auf die häufigsten
                    Fragen.
                  </p>
                  <Button variant="outline" asChild>
                    <a href="/pricing#faq">Zu den FAQs</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

