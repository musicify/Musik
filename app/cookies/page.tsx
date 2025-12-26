"use client";

import { motion } from "framer-motion";
import { Cookie, Sparkles, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const cookieTypes = [
  {
    category: "Notwendige Cookies",
    description:
      "Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden.",
    cookies: [
      {
        name: "__clerk_session",
        purpose: "Authentifizierung und Session-Management",
        duration: "Session",
        provider: "Clerk",
      },
      {
        name: "__csrf_token",
        purpose: "Schutz vor Cross-Site Request Forgery",
        duration: "Session",
        provider: "Musicify",
      },
      {
        name: "cookie_consent",
        purpose: "Speichert Ihre Cookie-Präferenzen",
        duration: "1 Jahr",
        provider: "Musicify",
      },
    ],
  },
  {
    category: "Funktionale Cookies",
    description:
      "Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.",
    cookies: [
      {
        name: "theme_preference",
        purpose: "Speichert Ihre bevorzugte Theme-Einstellung (Hell/Dunkel)",
        duration: "1 Jahr",
        provider: "Musicify",
      },
      {
        name: "audio_volume",
        purpose: "Speichert Ihre Lautstärke-Einstellung",
        duration: "1 Jahr",
        provider: "Musicify",
      },
      {
        name: "recent_searches",
        purpose: "Speichert Ihre letzten Suchanfragen",
        duration: "30 Tage",
        provider: "Musicify",
      },
    ],
  },
  {
    category: "Analyse-Cookies",
    description:
      "Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.",
    cookies: [
      {
        name: "_ga",
        purpose: "Google Analytics - Unterscheidung von Nutzern",
        duration: "2 Jahre",
        provider: "Google",
      },
      {
        name: "_gid",
        purpose: "Google Analytics - Unterscheidung von Nutzern",
        duration: "24 Stunden",
        provider: "Google",
      },
      {
        name: "_gat",
        purpose: "Google Analytics - Drosselung der Anfragerate",
        duration: "1 Minute",
        provider: "Google",
      },
    ],
  },
  {
    category: "Marketing-Cookies",
    description:
      "Diese Cookies werden verwendet, um Werbung relevanter für Sie zu gestalten.",
    cookies: [
      {
        name: "_fbp",
        purpose: "Facebook Pixel - Tracking von Websitebesuchen",
        duration: "3 Monate",
        provider: "Meta",
      },
    ],
  },
];

export default function CookiesPage() {
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
              <Cookie className="w-3 h-3 mr-1" />
              Rechtliches
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6">
              <span className="gradient-text">Cookie</span>-Richtlinie
            </h1>
            <p className="text-muted-foreground">
              Zuletzt aktualisiert: 1. Januar 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Introduction */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-8 prose prose-invert max-w-none">
                <h2>Was sind Cookies?</h2>
                <p>
                  Cookies sind kleine Textdateien, die auf Ihrem Gerät
                  gespeichert werden, wenn Sie unsere Website besuchen. Sie
                  helfen uns dabei, die Website funktionsfähig zu halten, Ihre
                  Präferenzen zu speichern und zu verstehen, wie Sie unsere
                  Website nutzen.
                </p>

                <h2>Wie nutzen wir Cookies?</h2>
                <p>Wir verwenden Cookies für verschiedene Zwecke:</p>
                <ul>
                  <li>
                    <strong>Notwendige Cookies:</strong> Für grundlegende
                    Funktionen wie Anmeldung und Sicherheit
                  </li>
                  <li>
                    <strong>Funktionale Cookies:</strong> Um Ihre Einstellungen
                    zu speichern
                  </li>
                  <li>
                    <strong>Analyse-Cookies:</strong> Um die Nutzung unserer
                    Website zu verstehen
                  </li>
                  <li>
                    <strong>Marketing-Cookies:</strong> Um relevante Werbung
                    anzuzeigen
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Cookie Settings */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl mb-2">
                    Cookie-Einstellungen anpassen
                  </h3>
                  <p className="text-muted-foreground">
                    Verwalten Sie Ihre Cookie-Präferenzen jederzeit.
                  </p>
                </div>
                <Button className="bg-primary text-primary-foreground">
                  <Settings className="w-4 h-4 mr-2" />
                  Einstellungen öffnen
                </Button>
              </CardContent>
            </Card>

            {/* Cookie Types */}
            {cookieTypes.map((type, index) => (
              <Card key={index} className="bg-card/50 border-border/50">
                <CardContent className="p-8">
                  <h2 className="font-serif text-2xl mb-2">{type.category}</h2>
                  <p className="text-muted-foreground mb-6">{type.description}</p>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cookie-Name</TableHead>
                          <TableHead>Zweck</TableHead>
                          <TableHead>Dauer</TableHead>
                          <TableHead>Anbieter</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {type.cookies.map((cookie, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono text-sm">
                              {cookie.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {cookie.purpose}
                            </TableCell>
                            <TableCell>{cookie.duration}</TableCell>
                            <TableCell>{cookie.provider}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Managing Cookies */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-8 prose prose-invert max-w-none">
                <h2>Cookies verwalten</h2>
                <p>
                  Sie können Cookies über Ihre Browsereinstellungen verwalten.
                  Die meisten Browser ermöglichen es Ihnen:
                </p>
                <ul>
                  <li>Alle Cookies zu blockieren</li>
                  <li>Nur Cookies von Drittanbietern zu blockieren</li>
                  <li>Cookies zu löschen, wenn Sie den Browser schließen</li>
                  <li>
                    "Private Browsing" / "Inkognito"-Modi zu verwenden, die
                    keine Cookies speichern
                  </li>
                </ul>
                <p>
                  Beachten Sie, dass das Blockieren von Cookies die
                  Funktionalität unserer Website beeinträchtigen kann.
                </p>

                <h3>Browser-Anleitungen</h3>
                <ul>
                  <li>
                    <a
                      href="https://support.google.com/chrome/answer/95647"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.mozilla.org/de/kb/cookies-erlauben-und-ablehnen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.apple.com/de-de/guide/safari/sfri11471/mac"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Safari
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.microsoft.com/de-de/microsoft-edge/cookies-l%C3%B6schen-63947406-40ac-c3b8-57b9-2a946a29ae09"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Microsoft Edge
                    </a>
                  </li>
                </ul>

                <h2>Änderungen an dieser Richtlinie</h2>
                <p>
                  Wir können diese Cookie-Richtlinie von Zeit zu Zeit
                  aktualisieren. Änderungen werden auf dieser Seite
                  veröffentlicht. Wir empfehlen Ihnen, diese Seite regelmäßig
                  zu besuchen, um über Änderungen informiert zu bleiben.
                </p>

                <h2>Kontakt</h2>
                <p>
                  Bei Fragen zu dieser Cookie-Richtlinie wenden Sie sich bitte
                  an:
                </p>
                <p>
                  Musicify GmbH<br />
                  Musterstraße 123<br />
                  10115 Berlin<br />
                  E-Mail: datenschutz@musicify.de
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

