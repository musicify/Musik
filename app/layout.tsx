import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { deDE } from "@clerk/localizations";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { AudioPlayerProvider } from "@/lib/hooks/use-audio-player";
import { GlobalAudioPlayer } from "@/components/music/global-audio-player";

export const metadata: Metadata = {
  title: "Musicify - Musik-Marktplatz & Custom Music Platform",
  description:
    "Kaufe lizenzierte Musik oder beauftrage individuelle Musikproduktion bei professionellen Komponisten. Kreativ. Legal. Professionell.",
  keywords: [
    "Musik kaufen",
    "Lizenzierte Musik",
    "Custom Music",
    "Filmmusik",
    "Werbemusik",
    "Musikproduktion",
    "Komponist",
  ],
  authors: [{ name: "Musicify" }],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://musicify.de",
    siteName: "Musicify",
    title: "Musicify - Musik-Marktplatz & Custom Music Platform",
    description:
      "Kaufe lizenzierte Musik oder beauftrage individuelle Musikproduktion bei professionellen Komponisten.",
  },
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
        </head>
        <body className="min-h-screen flex flex-col">
          <AudioPlayerProvider>
            <Header />
            <main className="flex-1 pb-20">{children}</main>
            <Footer />
            <GlobalAudioPlayer />
            <Toaster />
          </AudioPlayerProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
