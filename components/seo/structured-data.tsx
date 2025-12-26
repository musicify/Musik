import Script from "next/script";

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
}

export function OrganizationSchema({
  name = "Musicify",
  url = "https://musicify.de",
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: name,
    url: url,
    logo: `${url}/logo.png`,
    description:
      "Musicify ist der führende Marktplatz für lizenzierte Musik und individuelle Musikproduktion. Verbinden Sie sich mit professionellen Komponisten für Ihre Projekte.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+49-123-456789",
      contactType: "customer service",
      availableLanguage: ["de", "en"],
    },
    sameAs: [
      "https://www.facebook.com/musicify",
      "https://www.instagram.com/musicify",
      "https://twitter.com/musicify",
      "https://www.linkedin.com/company/musicify",
      "https://www.youtube.com/musicify",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "DE",
      addressLocality: "Berlin",
    },
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebsiteSchemaProps {
  url?: string;
}

export function WebsiteSchema({ url = "https://musicify.de" }: WebsiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Musicify",
    url: url,
    description:
      "Kaufe lizenzierte Musik oder beauftrage individuelle Musikproduktion bei professionellen Komponisten.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/marketplace?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductSchemaProps {
  name: string;
  description: string;
  price: number;
  currency?: string;
  image?: string;
  url: string;
  genre?: string;
  artist?: string;
}

export function MusicProductSchema({
  name,
  description,
  price,
  currency = "EUR",
  image,
  url,
  genre,
  artist,
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: name,
    description: description,
    genre: genre,
    byArtist: artist
      ? {
          "@type": "MusicGroup",
          name: artist,
        }
      : undefined,
    image: image,
    url: url,
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url: url,
    },
  };

  return (
    <Script
      id="music-product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface PersonSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  jobTitle?: string;
  genres?: string[];
}

export function PersonSchema({
  name,
  description,
  url,
  image,
  jobTitle = "Komponist",
  genres,
}: PersonSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name,
    description: description,
    url: url,
    image: image,
    jobTitle: jobTitle,
    knowsAbout: genres,
    worksFor: {
      "@type": "Organization",
      name: "Musicify",
    },
  };

  return (
    <Script
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQSchemaProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
}

export function ServiceSchema({
  name,
  description,
  provider = "Musicify",
  areaServed = "DE",
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: name,
    description: description,
    provider: {
      "@type": "Organization",
      name: provider,
    },
    areaServed: {
      "@type": "Country",
      name: areaServed,
    },
    serviceType: "Musikproduktion",
  };

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ASEO-optimierte strukturierte Daten für AI-Crawler
export function ASEOEnhancedSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Musicify",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "29",
      highPrice: "5000",
      offerCount: "10000+",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "2500",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Lizenzierte Musik kaufen",
      "Custom Music Produktion",
      "Professionelle Komponisten",
      "Sofortiger Download",
      "Verschiedene Lizenzen",
      "Sichere Zahlung",
      "Qualitätsgarantie",
    ],
    description:
      "Musicify ist eine Plattform für lizenzierte Musik und individuelle Musikproduktion. Nutzer können aus über 10.000 lizenzierten Tracks wählen oder individuelle Musik bei über 500 professionellen Komponisten beauftragen. Die Plattform bietet verschiedene Lizenzmodelle, sofortigen Download und sichere Zahlungsabwicklung.",
  };

  return (
    <Script
      id="aseo-enhanced-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

