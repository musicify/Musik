"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
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
              <Shield className="w-3 h-3 mr-1" />
              Rechtliches
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6">
              <span className="gradient-text">Datenschutz</span>erklärung
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
          <Card className="bg-card/50 border-border/50 max-w-4xl mx-auto">
            <CardContent className="p-8 sm:p-12 prose prose-invert max-w-none">
              <h2>1. Verantwortlicher</h2>
              <p>
                Verantwortlicher für die Datenverarbeitung auf dieser Website ist:
              </p>
              <p>
                Musicify GmbH<br />
                Musterstraße 123<br />
                10115 Berlin<br />
                E-Mail: datenschutz@musicify.de
              </p>

              <h2>2. Erhobene Daten</h2>
              <h3>2.1 Bei Nutzung der Website</h3>
              <p>
                Beim Besuch unserer Website werden automatisch folgende Daten
                erhoben:
              </p>
              <ul>
                <li>IP-Adresse</li>
                <li>Datum und Uhrzeit der Anfrage</li>
                <li>Browsertyp und -version</li>
                <li>Verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
              </ul>
              <p>
                Diese Daten werden benötigt, um die Website technisch
                bereitzustellen und die Sicherheit zu gewährleisten (Art. 6 Abs.
                1 lit. f DSGVO).
              </p>

              <h3>2.2 Bei Registrierung</h3>
              <p>Bei der Erstellung eines Kontos erheben wir:</p>
              <ul>
                <li>Name</li>
                <li>E-Mail-Adresse</li>
                <li>Passwort (verschlüsselt)</li>
                <li>Profilbild (optional)</li>
              </ul>
              <p>
                Die Verarbeitung erfolgt zur Vertragserfüllung (Art. 6 Abs. 1
                lit. b DSGVO).
              </p>

              <h3>2.3 Bei Bestellungen</h3>
              <p>Für die Abwicklung von Bestellungen benötigen wir zusätzlich:</p>
              <ul>
                <li>Rechnungsadresse</li>
                <li>Zahlungsinformationen</li>
                <li>Firmenname (bei Unternehmenskunden)</li>
                <li>USt-IdNr. (bei Unternehmenskunden)</li>
              </ul>

              <h2>3. Cookies</h2>
              <p>
                Wir verwenden Cookies und ähnliche Technologien. Details finden
                Sie in unserer{" "}
                <a href="/cookies" className="text-primary hover:underline">
                  Cookie-Richtlinie
                </a>
                .
              </p>

              <h3>3.1 Notwendige Cookies</h3>
              <p>
                Diese Cookies sind für den Betrieb der Website erforderlich
                (Session-Cookies, Sicherheits-Cookies).
              </p>

              <h3>3.2 Analyse-Cookies</h3>
              <p>
                Mit Ihrer Einwilligung nutzen wir Analyse-Cookies, um die
                Nutzung unserer Website zu verstehen und zu verbessern.
              </p>

              <h2>4. Drittanbieter</h2>
              <h3>4.1 Zahlungsdienstleister</h3>
              <p>
                Für die Zahlungsabwicklung arbeiten wir mit folgenden
                Dienstleistern zusammen:
              </p>
              <ul>
                <li>Stripe, Inc. (Kreditkartenzahlungen)</li>
                <li>PayPal (Europe) S.à r.l. et Cie, S.C.A.</li>
                <li>Klarna Bank AB</li>
              </ul>
              <p>
                Die Datenverarbeitung erfolgt zur Vertragserfüllung (Art. 6 Abs.
                1 lit. b DSGVO).
              </p>

              <h3>4.2 Hosting</h3>
              <p>
                Unsere Website wird bei Vercel Inc. in den USA gehostet. Mit
                Vercel besteht ein Auftragsverarbeitungsvertrag nach Art. 28
                DSGVO.
              </p>

              <h3>4.3 Authentifizierung</h3>
              <p>
                Für die Benutzeranmeldung nutzen wir Clerk Dev, Inc. Die
                Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b
                DSGVO.
              </p>

              <h2>5. Ihre Rechte</h2>
              <p>Sie haben folgende Rechte bezüglich Ihrer Daten:</p>
              <ul>
                <li>
                  <strong>Auskunft (Art. 15 DSGVO):</strong> Recht auf Auskunft
                  über Ihre gespeicherten Daten
                </li>
                <li>
                  <strong>Berichtigung (Art. 16 DSGVO):</strong> Recht auf
                  Korrektur unrichtiger Daten
                </li>
                <li>
                  <strong>Löschung (Art. 17 DSGVO):</strong> Recht auf Löschung
                  Ihrer Daten
                </li>
                <li>
                  <strong>Einschränkung (Art. 18 DSGVO):</strong> Recht auf
                  Einschränkung der Verarbeitung
                </li>
                <li>
                  <strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Recht
                  auf Erhalt Ihrer Daten in einem übertragbaren Format
                </li>
                <li>
                  <strong>Widerspruch (Art. 21 DSGVO):</strong> Recht auf
                  Widerspruch gegen die Verarbeitung
                </li>
              </ul>
              <p>
                Zur Ausübung Ihrer Rechte kontaktieren Sie uns unter:
                datenschutz@musicify.de
              </p>

              <h2>6. Beschwerderecht</h2>
              <p>
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
                zu beschweren. Die für uns zuständige Aufsichtsbehörde ist:
              </p>
              <p>
                Berliner Beauftragte für Datenschutz und Informationsfreiheit<br />
                Alt-Moabit 59-61<br />
                10555 Berlin
              </p>

              <h2>7. Datensicherheit</h2>
              <p>
                Wir setzen technische und organisatorische Sicherheitsmaßnahmen
                ein, um Ihre Daten zu schützen, darunter:
              </p>
              <ul>
                <li>SSL/TLS-Verschlüsselung</li>
                <li>Verschlüsselte Speicherung von Passwörtern</li>
                <li>Regelmäßige Sicherheitsupdates</li>
                <li>Zugriffsbeschränkungen</li>
              </ul>

              <h2>8. Speicherdauer</h2>
              <p>
                Wir speichern Ihre Daten nur so lange, wie es für die jeweiligen
                Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen
                bestehen.
              </p>
              <ul>
                <li>Kontodaten: Bis zur Löschung des Kontos</li>
                <li>
                  Rechnungsdaten: 10 Jahre (gesetzliche Aufbewahrungspflicht)
                </li>
                <li>Server-Logs: 7 Tage</li>
              </ul>

              <h2>9. Änderungen</h2>
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um
                sie an geänderte Rechtslagen oder bei Änderungen unserer
                Dienste anzupassen. Die aktuelle Version ist stets auf dieser
                Seite verfügbar.
              </p>

              <h2>10. Kontakt</h2>
              <p>
                Bei Fragen zum Datenschutz wenden Sie sich bitte an:
              </p>
              <p>
                Musicify GmbH<br />
                Datenschutzbeauftragter<br />
                Musterstraße 123<br />
                10115 Berlin<br />
                E-Mail: datenschutz@musicify.de
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

