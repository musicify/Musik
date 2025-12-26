"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
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
              <FileText className="w-3 h-3 mr-1" />
              Rechtliches
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6">
              Allgemeine <span className="gradient-text">Geschäftsbedingungen</span>
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
              <h2>1. Geltungsbereich</h2>
              <p>
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle
                Geschäftsbeziehungen zwischen der Musicify GmbH (nachfolgend
                "Musicify", "wir" oder "uns") und unseren Kunden (nachfolgend
                "Kunde" oder "Sie") über die Plattform www.musicify.de.
              </p>
              <p>
                Musicify ist eine Plattform für Musik-Lizenzierung und Custom
                Music Aufträge. Die Plattform verbindet Komponisten (nachfolgend
                "Komponisten" oder "Künstler") mit Kunden, die Musik für ihre
                Projekte suchen.
              </p>

              <h2>2. Vertragsschluss</h2>
              <h3>2.1 Angebot und Annahme</h3>
              <p>
                Die Darstellung von Tracks und Dienstleistungen auf unserer
                Plattform stellt kein verbindliches Angebot dar, sondern eine
                Aufforderung zur Abgabe eines Angebots. Durch Anklicken des
                Buttons "Kaufen" oder "Kostenpflichtig bestellen" geben Sie ein
                verbindliches Angebot zum Kauf ab.
              </p>
              <h3>2.2 Vertragsbestätigung</h3>
              <p>
                Der Vertrag kommt zustande, sobald wir Ihre Bestellung durch eine
                Bestätigungsmail annehmen oder die Lieferung der Ware bzw.
                Dienstleistung erfolgt.
              </p>

              <h2>3. Lizenzierung von Musik</h2>
              <h3>3.1 Lizenztypen</h3>
              <p>Wir bieten folgende Lizenztypen an:</p>
              <ul>
                <li>
                  <strong>Personal License:</strong> Für private,
                  nicht-kommerzielle Nutzung
                </li>
                <li>
                  <strong>Commercial License:</strong> Für kommerzielle Nutzung
                  mit begrenzter Reichweite (bis 100.000 Views/Impressions)
                </li>
                <li>
                  <strong>Enterprise License:</strong> Für unbegrenzte
                  kommerzielle Nutzung
                </li>
                <li>
                  <strong>Exclusive License:</strong> Für exklusive Nutzungsrechte
                  (Track wird aus dem Katalog entfernt)
                </li>
              </ul>

              <h3>3.2 Nutzungsrechte</h3>
              <p>
                Mit dem Kauf einer Lizenz erwerben Sie das nicht-übertragbare
                Recht, die Musik im Rahmen der gewählten Lizenz zu nutzen. Die
                genauen Nutzungsrechte sind im jeweiligen Lizenzzertifikat
                festgelegt.
              </p>

              <h3>3.3 Einschränkungen</h3>
              <p>Es ist nicht gestattet:</p>
              <ul>
                <li>Die Musik ohne Lizenz zu nutzen</li>
                <li>Die Lizenz an Dritte zu übertragen oder unterzulizenzieren</li>
                <li>Die Musik als eigenständiges Produkt weiterzuverkaufen</li>
                <li>
                  Die Musik in einer Weise zu nutzen, die gegen geltendes Recht
                  verstößt
                </li>
              </ul>

              <h2>4. Custom Music</h2>
              <h3>4.1 Auftragserteilung</h3>
              <p>
                Bei Custom Music Aufträgen beschreiben Sie Ihre Anforderungen und
                erhalten Angebote von Komponisten. Mit der Annahme eines Angebots
                erteilen Sie einen verbindlichen Auftrag.
              </p>

              <h3>4.2 Produktion und Abnahme</h3>
              <p>
                Der Komponist produziert die Musik nach Ihren Vorgaben. Sie haben
                das Recht auf eine vereinbarte Anzahl von Revisionen. Die
                Abnahme erfolgt durch ausdrückliche Bestätigung oder durch
                Schweigen innerhalb von 7 Tagen nach Lieferung.
              </p>

              <h3>4.3 Rechte an Custom Music</h3>
              <p>
                Die Nutzungsrechte an Custom Music werden durch die gewählte
                Lizenz bestimmt. Ohne anderweitige Vereinbarung behält der
                Komponist das Urheberrecht.
              </p>

              <h2>5. Preise und Zahlung</h2>
              <h3>5.1 Preise</h3>
              <p>
                Alle angegebenen Preise sind Endpreise inklusive der gesetzlichen
                Mehrwertsteuer. Der Gesamtpreis wird vor Abschluss der Bestellung
                angezeigt.
              </p>

              <h3>5.2 Zahlungsmethoden</h3>
              <p>
                Wir akzeptieren folgende Zahlungsmethoden: Kreditkarte (Visa,
                Mastercard, American Express), PayPal und Klarna.
              </p>

              <h3>5.3 Fälligkeit</h3>
              <p>
                Der Kaufpreis ist sofort bei Vertragsschluss fällig. Bei Custom
                Music Aufträgen kann eine Anzahlung vereinbart werden.
              </p>

              <h2>6. Widerrufsrecht</h2>
              <p>
                Bei digitalen Inhalten erlischt das Widerrufsrecht mit Beginn
                der Ausführung des Vertrags, wenn Sie ausdrücklich zugestimmt
                haben, dass wir mit der Ausführung vor Ablauf der Widerrufsfrist
                beginnen, und Sie Ihre Kenntnis davon bestätigt haben, dass Sie
                durch Ihre Zustimmung mit Beginn der Ausführung Ihr
                Widerrufsrecht verlieren.
              </p>

              <h2>7. Gewährleistung und Haftung</h2>
              <h3>7.1 Gewährleistung</h3>
              <p>
                Wir gewährleisten, dass die gelieferten Tracks fehlerfrei und in
                der beschriebenen Qualität sind. Bei Mängeln haben Sie Anspruch
                auf Nachbesserung oder Ersatzlieferung.
              </p>

              <h3>7.2 Haftungsbeschränkung</h3>
              <p>
                Unsere Haftung ist auf Vorsatz und grobe Fahrlässigkeit
                beschränkt, es sei denn, es handelt sich um die Verletzung
                wesentlicher Vertragspflichten. In diesem Fall haften wir auch
                bei leichter Fahrlässigkeit, jedoch beschränkt auf den
                vorhersehbaren, vertragstypischen Schaden.
              </p>

              <h2>8. Datenschutz</h2>
              <p>
                Informationen zur Verarbeitung Ihrer personenbezogenen Daten
                finden Sie in unserer{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Datenschutzerklärung
                </a>
                .
              </p>

              <h2>9. Schlussbestimmungen</h2>
              <h3>9.1 Anwendbares Recht</h3>
              <p>
                Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.
              </p>

              <h3>9.2 Gerichtsstand</h3>
              <p>
                Gerichtsstand für alle Streitigkeiten ist Berlin, sofern der
                Kunde Kaufmann, juristische Person des öffentlichen Rechts oder
                öffentlich-rechtliches Sondervermögen ist.
              </p>

              <h3>9.3 Salvatorische Klausel</h3>
              <p>
                Sollten einzelne Bestimmungen dieser AGB unwirksam sein, berührt
                dies die Wirksamkeit der übrigen Bestimmungen nicht.
              </p>

              <h2>10. Kontakt</h2>
              <p>
                Bei Fragen zu diesen AGB wenden Sie sich bitte an:
              </p>
              <p>
                Musicify GmbH<br />
                Musterstraße 123<br />
                10115 Berlin<br />
                E-Mail: legal@musicify.de
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

