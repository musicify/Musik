"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Download,
  FileText,
  Mail,
  ArrowRight,
  Music,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock order data
const order = {
  id: "ORD-2024-0047",
  date: new Date().toLocaleDateString("de-DE"),
  items: [
    {
      id: "1",
      title: "Neon Dreams",
      artist: "Max Müller",
      license: "Commercial",
      price: 49,
      coverGradient: "from-purple-500 to-pink-500",
    },
    {
      id: "2",
      title: "Epic Horizon",
      artist: "Sarah Schmidt",
      license: "Enterprise",
      price: 349,
      coverGradient: "from-amber-500 to-orange-600",
    },
  ],
  subtotal: 398,
  tax: 75.62,
  total: 473.62,
  email: "max@example.de",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CheckCircle2 className="w-14 h-14 text-green-500" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="font-serif text-4xl mb-4">
              Vielen Dank für deinen Kauf!
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Deine Bestellung #{order.id} wurde erfolgreich abgeschlossen.
            </p>
            <p className="text-muted-foreground">
              Eine Bestätigung wurde an{" "}
              <span className="text-foreground">{order.email}</span> gesendet.
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            <Card className="bg-card/50 border-border/50 text-left">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Bestellnummer
                    </p>
                    <p className="font-medium">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Datum</p>
                    <p className="font-medium">{order.date}</p>
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-lg bg-gradient-to-br ${item.coverGradient} flex-shrink-0`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.artist}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.license}
                        </Badge>
                      </div>
                      <span className="font-medium">€{item.price}</span>
                    </div>
                  ))}
                </div>

                <Separator className="mb-6" />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Zwischensumme</span>
                    <span>€{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">MwSt. (19%)</span>
                    <span>€{order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2">
                    <span>Gesamt</span>
                    <span className="text-primary">€{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/downloads">
                <Button className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Musik herunterladen
                </Button>
              </Link>
              <Link href="/invoices">
                <Button variant="outline" className="w-full h-14">
                  <FileText className="w-5 h-5 mr-2" />
                  Rechnung ansehen
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4">
              <Link href="/marketplace">
                <Button variant="ghost" className="text-muted-foreground">
                  <Music className="w-4 h-4 mr-2" />
                  Mehr Musik entdecken
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-muted-foreground">
                  <Home className="w-4 h-4 mr-2" />
                  Zum Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <Card className="bg-secondary/50 border-border/50">
              <CardContent className="p-6">
                <h3 className="font-serif text-xl mb-4">Was passiert als Nächstes?</h3>
                <div className="grid sm:grid-cols-3 gap-6 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-sm">E-Mail erhalten</p>
                      <p className="text-xs text-muted-foreground">
                        Bestätigung und Rechnung wurden gesendet
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-sm">Musik herunterladen</p>
                      <p className="text-xs text-muted-foreground">
                        WAV & MP3 Dateien im Download-Center
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-sm">Lizenz speichern</p>
                      <p className="text-xs text-muted-foreground">
                        Lizenzzertifikate für deine Unterlagen
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
