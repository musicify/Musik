"use client";

import Link from "next/link";
import { Music, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  platform: {
    title: "Plattform",
    links: [
      { name: "Musik kaufen", href: "/marketplace" },
      { name: "Custom Music", href: "/custom-music" },
      { name: "Für Künstler", href: "/for-artists" },
      { name: "Preise", href: "/pricing" },
    ],
  },
  company: {
    title: "Unternehmen",
    links: [
      { name: "Über uns", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Karriere", href: "/careers" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { name: "Hilfe-Center", href: "/help" },
      { name: "Kontakt", href: "/contact" },
      { name: "Lizenzierung", href: "/licensing" },
      { name: "FAQ", href: "/faq" },
    ],
  },
  legal: {
    title: "Rechtliches",
    links: [
      { name: "AGB", href: "/terms" },
      { name: "Datenschutz", href: "/privacy" },
      { name: "Impressum", href: "/imprint" },
      { name: "Cookie-Richtlinie", href: "/cookies" },
    ],
  },
};

const socialLinks = [
  { name: "Twitter", href: "#", icon: "𝕏" },
  { name: "Instagram", href: "#", icon: "📷" },
  { name: "YouTube", href: "#", icon: "▶" },
  { name: "LinkedIn", href: "#", icon: "in" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-serif text-2xl mb-2">
                Bleib auf dem Laufenden
              </h3>
              <p className="text-muted-foreground">
                Neue Tracks, exklusive Angebote und Plattform-Updates direkt in
                deinem Postfach.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Deine E-Mail-Adresse"
                  className="pl-10 bg-background"
                />
              </div>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Abonnieren
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Music className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-2xl">Musicify</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Dein Marktplatz für lizenzierte Musik und individuelle
              Musikproduktion. Kreativ. Legal. Professionell.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Berlin, Deutschland</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@musicify.de" className="hover:text-foreground transition-colors">
                  hello@musicify.de
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+4930123456789" className="hover:text-foreground transition-colors">
                  +49 30 123 456 789
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Musicify. Alle Rechte vorbehalten.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-sm">{social.icon}</span>
                </a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-xs">Zahlungsarten:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-5 bg-secondary rounded flex items-center justify-center text-[10px] font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-secondary rounded flex items-center justify-center text-[10px] font-bold">
                  MC
                </div>
                <div className="w-8 h-5 bg-secondary rounded flex items-center justify-center text-[10px] font-bold">
                  PP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

