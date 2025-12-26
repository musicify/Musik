import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { deDE } from "@clerk/localizations";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { AudioPlayerProvider } from "@/lib/hooks/use-audio-player";
import { GlobalAudioPlayer } from "@/components/music/global-audio-player";
import { CartProvider } from "@/hooks/use-cart";
import {
  OrganizationSchema,
  WebsiteSchema,
  ASEOEnhancedSchema,
} from "@/components/seo/structured-data";

export const metadata: Metadata = {
  metadataBase: new URL("https://musicify.de"),
  title: {
    default: "Musicify - Musik-Marktplatz & Custom Music Platform",
    template: "%s | Musicify",
  },
  description:
    "Kaufe lizenzierte Musik oder beauftrage individuelle Musikproduktion bei professionellen Komponisten. Kreativ. Legal. Professionell. Über 10.000 lizenzierte Tracks und 500+ professionelle Komponisten.",
  keywords: [
    "Musik kaufen",
    "Lizenzierte Musik",
    "Custom Music",
    "Filmmusik",
    "Werbemusik",
    "Musikproduktion",
    "Komponist beauftragen",
    "Royalty-free Musik",
    "GEMA-freie Musik",
    "Musik lizenzieren",
    "Musikmarktplatz",
    "Produktionsmusik",
    "Hintergrundmusik",
    "Musik für Videos",
    "Musik für Werbung",
    "Komponist finden",
  ],
  authors: [{ name: "Musicify", url: "https://musicify.de" }],
  creator: "Musicify",
  publisher: "Musicify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://musicify.de",
    siteName: "Musicify",
    title: "Musicify - Musik-Marktplatz & Custom Music Platform",
    description:
      "Kaufe lizenzierte Musik oder beauftrage individuelle Musikproduktion bei professionellen Komponisten. Über 10.000 Tracks verfügbar.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Musicify - Musik-Marktplatz & Custom Music Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Musicify - Musik-Marktplatz & Custom Music Platform",
    description:
      "Kaufe lizenzierte Musik oder beauftrage individuelle Musikproduktion bei professionellen Komponisten.",
    images: ["/twitter-image.jpg"],
    creator: "@musicify",
  },
  robots: {
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://musicify.de",
    languages: {
      "de-DE": "https://musicify.de",
      "en-US": "https://musicify.de/en",
    },
  },
  category: "music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={deDE}>
      <html lang="de" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/icon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        </head>
        <body className="min-h-screen flex flex-col">
          <OrganizationSchema />
          <WebsiteSchema />
          <ASEOEnhancedSchema />
          <CartProvider>
            <AudioPlayerProvider>
              <Header />
              <main className="flex-1 pb-20">{children}</main>
              <Footer />
              <GlobalAudioPlayer />
              <Toaster />
            </AudioPlayerProvider>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
