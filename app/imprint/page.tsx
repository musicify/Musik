"use client";

import { motion } from "framer-motion";
import { Building, Sparkles, Mail, Phone, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function ImprintPage() {
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
              <Building className="w-3 h-3 mr-1" />
              Rechtliches
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6">
              <span className="gradient-text">Impressum</span>
            </h1>
            <p className="text-muted-foreground">
              Angaben gemäß § 5 TMG
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Company Info */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-8">
                <h2 className="font-serif text-2xl mb-6">Anbieter</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xl font-medium">Musicify GmbH</p>
                    <p className="text-muted-foreground">
                      Musterstraße 123<br />
                      10115 Berlin<br />
                      Deutschland
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <a
                        href="mailto:hello@musicify.de"
                        className="text-primary hover:underline"
                      >
                        hello@musicify.de
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <a
                        href="tel:+4930123456789"
                        className="text-primary hover:underline"
                      >
                        +49 30 123 456 789
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      <a
                        href="https://www.musicify.de"
                        className="text-primary hover:underline"
                      >
                        www.musicify.de
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Representatives */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-8">
                <h2 className="font-serif text-2xl mb-6">Vertretungsberechtigte</h2>
                <p>
                  <strong>Geschäftsführer:</strong> Max Schmidt, Lisa Müller
                </p>
              </CardContent>
            </Card>

            {/* Registration */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-8">
                <h2 className="font-serif text-2xl mb-6">Registereintrag</h2>
                <div className="space-y-2">
                  <p>
                    <strong>Registergericht:</strong> Amtsgericht Charlottenburg
                  </p>
                  <p>
                    <strong>Registernummer:</strong> HRB 123456 B
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* VAT */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-8">
                <h2 className="font-serif text-2xl mb-6">Umsatzsteuer</h2>
                <div className="space-y-2">
                  <p>
                    <strong>USt-IdNr.:</strong> DE123456789
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Umsatzsteuer-Identifikationsnummer gemäß § 27a
                    Umsatzsteuergesetz
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Responsible for Content */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-8">
                <h2 className="font-serif text-2xl mb-6">
                  Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
                </h2>
                <p>
                  Max Schmidt<br />
                  Musicify GmbH<br />
                  Musterstraße 123<br />
                  10115 Berlin
                </p>
              </CardContent>
            </Card>

            {/* Dispute Resolution */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-8">
                <h2 className="font-serif text-2xl mb-6">Streitschlichtung</h2>
                <p className="mb-4">
                  Die Europäische Kommission stellt eine Plattform zur
                  Online-Streitbeilegung (OS) bereit:{" "}
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://ec.europa.eu/consumers/odr
                  </a>
                </p>
                <p>
                  Wir sind nicht bereit oder verpflichtet, an
                  Streitbeilegungsverfahren vor einer
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </CardContent>
            </Card>

            {/* Liability */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-8 prose prose-invert max-w-none">
                <h2 className="font-serif text-2xl mb-6">Haftungsausschluss</h2>

                <h3>Haftung für Inhalte</h3>
                <p>
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
                  Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                  verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                  Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                  gespeicherte fremde Informationen zu überwachen oder nach
                  Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                  hinweisen.
                </p>
                <p>
                  Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
                  Informationen nach den allgemeinen Gesetzen bleiben hiervon
                  unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
                  Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
                  möglich. Bei Bekanntwerden von entsprechenden
                  Rechtsverletzungen werden wir diese Inhalte umgehend
                  entfernen.
                </p>

                <h3>Haftung für Links</h3>
                <p>
                  Unser Angebot enthält Links zu externen Websites Dritter, auf
                  deren Inhalte wir keinen Einfluss haben. Deshalb können wir
                  für diese fremden Inhalte auch keine Gewähr übernehmen. Für
                  die Inhalte der verlinkten Seiten ist stets der jeweilige
                  Anbieter oder Betreiber der Seiten verantwortlich. Die
                  verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
                  mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren
                  zum Zeitpunkt der Verlinkung nicht erkennbar.
                </p>

                <h3>Urheberrecht</h3>
                <p>
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                  diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                  Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                  Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen
                  der schriftlichen Zustimmung des jeweiligen Autors bzw.
                  Erstellers. Downloads und Kopien dieser Seite sind nur für den
                  privaten, nicht kommerziellen Gebrauch gestattet.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

