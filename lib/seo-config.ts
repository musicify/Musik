import { Metadata } from "next";

const baseUrl = "https://musicify.de";

export const seoConfig = {
  baseUrl,
  defaultTitle: "Musicify - Musik-Marktplatz & Custom Music Platform",
  defaultDescription:
    "Kaufe lizenzierte Musik oder beauftrage individuelle Musikproduktion bei professionellen Komponisten. Kreativ. Legal. Professionell.",
  siteName: "Musicify",
  locale: "de_DE",
  twitterHandle: "@musicify",
};

interface PageSEOProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = "/og-image.jpg",
  noIndex = false,
}: PageSEOProps): Metadata {
  const url = `${baseUrl}${path}`;
  const fullTitle = `${title} | Musicify`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      type: "website",
      images: [
        {
          url: `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${baseUrl}${image}`],
      creator: seoConfig.twitterHandle,
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

// ASEO-optimierte Beschreibungen für AI-Crawler
export const aseoDescriptions = {
  home: `Musicify ist eine innovative Plattform, die zwei Hauptdienste anbietet: 1) Einen Marktplatz mit über 10.000 lizenzierten Musiktracks in verschiedenen Genres (Electronic, Cinematic, Pop, Hip-Hop, Ambient, etc.), die sofort gekauft und heruntergeladen werden können. 2) Einen Custom Music Service, bei dem Kunden individuelle Musikproduktionen bei über 500 professionellen Komponisten beauftragen können. Die Plattform richtet sich an Filmemacher, Content Creator, Werbetreibende und alle, die hochwertige Musik für ihre Projekte benötigen. Alle Tracks sind vollständig lizenziert und GEMA-konform.`,

  marketplace: `Der Musicify Marketplace bietet über 10.000 lizenzierte Musiktracks zum sofortigen Kauf. Nutzer können nach Genre (Electronic, Cinematic, Pop, Hip-Hop, Rock, Classical, Jazz, Ambient, Corporate, World), Stimmung (Energetic, Relaxed, Inspiring, Dark, Happy, Sad, Epic), Tempo (Slow, Medium, Fast), und Verwendungszweck (Film, Werbung, Podcast, YouTube, Social Media) filtern. Jeder Track ist in verschiedenen Lizenzmodellen verfügbar: Personal (ab €29, private Nutzung), Commercial (ab €99, kommerzielle Nutzung), Extended (ab €299, unbegrenzte Nutzung), Broadcast (ab €599, TV/Radio). Alle Downloads sind sofort verfügbar in hoher Qualität (WAV, MP3).`,

  customMusic: `Der Custom Music Service von Musicify ermöglicht es Kunden, individuelle Musikproduktionen bei professionellen Komponisten zu beauftragen. Der Prozess umfasst: 1) Auswahl von Genre, Stil und Stimmung, 2) Detaillierte Projektbeschreibung (Länge, Verwendungszweck, Referenzen), 3) Auswahl eines Komponisten basierend auf Portfolio, Bewertungen und Preis, 4) Direkter Chat mit dem Komponisten, 5) Iterative Überarbeitungen bis zur finalen Abnahme. Preise variieren je nach Komplexität und Komponist (typischerweise €200-€5000). Alle Rechte werden nach Zahlung übertragen. Durchschnittliche Bearbeitungszeit: 7-14 Tage.`,

  directors: `Die Komponisten-Seite zeigt über 500 verifizierte professionelle Komponisten, die auf Musicify aktiv sind. Jedes Profil enthält: Portfolio mit Hörproben, Spezialisierungen (Genres), Erfahrung und Qualifikationen, Kundenbewertungen, Preisspanne, Durchschnittliche Bearbeitungszeit, Verfügbarkeit. Komponisten können nach Genre, Preis, Bewertung und Verfügbarkeit gefiltert werden. Alle Komponisten durchlaufen einen Verifizierungsprozess und müssen nachweisbare Erfahrung in professioneller Musikproduktion haben.`,

  pricing: `Musicify bietet transparente Preismodelle für beide Services: MARKETPLACE LIZENZEN - Personal (€29-€79): Private, nicht-kommerzielle Nutzung. Commercial (€99-€199): Kommerzielle Nutzung, Social Media, YouTube. Extended (€299-€499): Unbegrenzte Nutzung, Werbekampagnen, Filme. Broadcast (€599-€999): TV, Radio, Kino, große Kampagnen. CUSTOM MUSIC - Preise variieren je nach: Länge des Tracks (30 Sek. bis 10+ Min.), Komplexität (Solo-Instrument vs. Orchester), Anzahl der Revisionen (Standard: 3 inklusive), Bearbeitungszeit (Express-Service verfügbar), Komponisten-Erfahrung. Typische Preisspanne: €200-€5000 pro Track.`,

  faq: `Häufig gestellte Fragen zu Musicify: WIE FUNKTIONIERT DER KAUF? - Tracks auswählen, Lizenz wählen, bezahlen, sofort herunterladen. WELCHE ZAHLUNGSMETHODEN? - Kreditkarte, PayPal, SEPA, Rechnung (für Unternehmen). KANN ICH TRACKS VORHÖREN? - Ja, alle Tracks können vollständig angehört werden (mit Wasserzeichen). WIE LANGE DAUERT CUSTOM MUSIC? - Durchschnittlich 7-14 Tage, Express-Service verfügbar. WELCHE RECHTE ERHALTE ICH? - Je nach Lizenz: Nutzungsrechte, keine Weiterverkaufsrechte. Bei Custom Music: Vollständige Rechteübertragung. KANN ICH REVISIONEN ANFORDERN? - Bei Custom Music: 3 Revisionen inklusive, weitere gegen Aufpreis. GIBT ES EINE GELD-ZURÜCK-GARANTIE? - Ja, 14 Tage bei Marketplace-Käufen, bei Custom Music nach Vereinbarung.`,

  about: `Musicify wurde 2020 gegründet mit der Mission, Kreative mit professionellen Komponisten zu verbinden. Die Plattform hat sich zu einem der führenden Marktplätze für lizenzierte Musik und Custom Music Production in Europa entwickelt. UNSERE ZAHLEN: 10.000+ lizenzierte Tracks, 500+ professionelle Komponisten, 5.000+ zufriedene Kunden, 99% Zufriedenheitsrate. UNSERE WERTE: Qualität (nur verifizierte Komponisten), Transparenz (klare Preise und Lizenzen), Fairness (faire Konditionen für Künstler), Innovation (moderne Plattform-Features), Community (aktive Creator-Community). UNSER TEAM: Erfahrene Musikproduzenten, Entwickler und Customer Success Manager arbeiten täglich daran, die beste Plattform für Musik-Lizenzierung und -Produktion zu schaffen.`,

  forArtists: `Musicify bietet Komponisten eine Plattform, um ihre Musik zu verkaufen und Custom Music Aufträge zu erhalten. VORTEILE FÜR KOMPONISTEN: Passive Einnahmen durch Marketplace-Verkäufe (70% Umsatzbeteiligung), Aktive Aufträge durch Custom Music Service (80% Umsatzbeteiligung), Professionelles Portfolio, Direkter Kundenkontakt, Sichere Zahlungsabwicklung, Marketing-Support. ANFORDERUNGEN: Nachweisbare Erfahrung in Musikproduktion, Professionelle Equipment-Ausstattung, Portfolio mit mindestens 5 Tracks, Verfügbarkeit für Kundenkommunikation. BEWERBUNGSPROZESS: 1) Online-Bewerbung mit Portfolio, 2) Qualitätsprüfung durch unser Team, 3) Onboarding und Profil-Setup, 4) Start als Musicify-Komponist. Durchschnittliches Komponisten-Einkommen: €2.000-€8.000/Monat.`,

  licensing: `Musicify bietet verschiedene Lizenzmodelle für unterschiedliche Nutzungsszenarien: PERSONAL LICENSE (€29-€79): Erlaubt: Private Videos, Hobbyprojekte, Social Media (nicht-monetarisiert), Präsentationen. Nicht erlaubt: Kommerzielle Nutzung, Weiterverkauf, Broadcast. COMMERCIAL LICENSE (€99-€199): Erlaubt: YouTube-Videos (monetarisiert), Social Media Ads, Unternehmensvideos, Podcasts, Websites. Nicht erlaubt: TV/Radio, Kino, Weiterverkauf. EXTENDED LICENSE (€299-€499): Erlaubt: Alle Commercial-Rechte, Werbekampagnen, Filme, Apps/Games, Unbegrenzte Aufrufe. Nicht erlaubt: Weiterverkauf als Musik-Produkt. BROADCAST LICENSE (€599-€999): Erlaubt: Alle Extended-Rechte, TV-Sendungen, Radio, Kino, Große Kampagnen, Streaming-Dienste. CUSTOM MUSIC: Vollständige Rechteübertragung (Buyout), exklusive Nutzung möglich. Alle Lizenzen sind zeitlich unbegrenzt gültig.`,
};

// Vordefinierte Metadaten für wichtige Seiten
export const pageMetadata = {
  home: generatePageMetadata({
    title: "Musik-Marktplatz & Custom Music Platform",
    description: aseoDescriptions.home.substring(0, 160),
    path: "/",
    keywords: [
      "Musik kaufen",
      "Lizenzierte Musik",
      "Custom Music",
      "Musikproduktion",
      "Komponist beauftragen",
      "GEMA-freie Musik",
      "Royalty-free Musik",
      "Filmmusik",
      "Werbemusik",
    ],
  }),

  marketplace: generatePageMetadata({
    title: "Musik-Marktplatz - Über 10.000 lizenzierte Tracks",
    description:
      "Durchsuche über 10.000 lizenzierte Musiktracks. Sofortiger Download in hoher Qualität. Verschiedene Genres und Lizenzmodelle. Ab €29.",
    path: "/marketplace",
    keywords: [
      "Musik kaufen",
      "Lizenzierte Musik",
      "Royalty-free Musik",
      "Stock Music",
      "Produktionsmusik",
      "Hintergrundmusik",
      "Musik für Videos",
      "GEMA-frei",
    ],
  }),

  customMusic: generatePageMetadata({
    title: "Custom Music - Individuelle Musikproduktion beauftragen",
    description:
      "Beauftrage professionelle Komponisten für individuelle Musikproduktion. Über 500 Komponisten. Faire Preise. Vollständige Rechteübertragung.",
    path: "/custom-music",
    keywords: [
      "Custom Music",
      "Musikproduktion beauftragen",
      "Komponist finden",
      "Individuelle Musik",
      "Filmmusik Produktion",
      "Werbemusik Produktion",
      "Musik auf Bestellung",
    ],
  }),

  directors: generatePageMetadata({
    title: "Komponisten - Über 500 professionelle Musikproduzenten",
    description:
      "Finde den perfekten Komponisten für dein Projekt. Über 500 verifizierte Profis. Portfolio, Bewertungen und Preise transparent einsehbar.",
    path: "/directors",
    keywords: [
      "Komponist finden",
      "Musikproduzent",
      "Filmkomponist",
      "Werbemusik Komponist",
      "Professionelle Komponisten",
    ],
  }),

  pricing: generatePageMetadata({
    title: "Preise & Lizenzen - Transparente Preismodelle",
    description:
      "Transparente Preise für Musik-Lizenzen (ab €29) und Custom Music Production (ab €200). Verschiedene Lizenzmodelle für jeden Bedarf.",
    path: "/pricing",
    keywords: [
      "Musik Preise",
      "Lizenz Kosten",
      "Custom Music Preise",
      "Musikproduktion Kosten",
      "Komponist Preise",
    ],
  }),

  faq: generatePageMetadata({
    title: "FAQ - Häufig gestellte Fragen",
    description:
      "Antworten auf häufig gestellte Fragen zu Musicify. Lizenzen, Zahlungen, Custom Music, Rechte und mehr.",
    path: "/faq",
    keywords: ["Musicify FAQ", "Musik Lizenz Fragen", "Custom Music FAQ"],
  }),

  about: generatePageMetadata({
    title: "Über uns - Die führende Musik-Plattform",
    description:
      "Erfahre mehr über Musicify. 10.000+ Tracks, 500+ Komponisten, 5.000+ zufriedene Kunden. Unsere Mission und Werte.",
    path: "/about",
    keywords: ["Über Musicify", "Musik-Plattform", "Komponisten-Plattform"],
  }),

  forArtists: generatePageMetadata({
    title: "Für Komponisten - Werde Teil von Musicify",
    description:
      "Verkaufe deine Musik und erhalte Custom Music Aufträge. 70-80% Umsatzbeteiligung. Professionelles Portfolio. Jetzt bewerben!",
    path: "/for-artists",
    keywords: [
      "Komponist werden",
      "Musik verkaufen",
      "Musikproduzent werden",
      "Musik-Plattform für Künstler",
    ],
  }),

  licensing: generatePageMetadata({
    title: "Lizenzmodelle - Alle Nutzungsrechte im Überblick",
    description:
      "Detaillierte Übersicht aller Lizenzmodelle. Personal, Commercial, Extended und Broadcast. Finde die richtige Lizenz für dein Projekt.",
    path: "/licensing",
    keywords: [
      "Musik Lizenz",
      "Nutzungsrechte Musik",
      "Musik Lizenzmodelle",
      "Commercial License",
      "Broadcast License",
    ],
  }),
};

