"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Download, FileText, Home, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import confetti from "canvas-confetti";

export default function CheckoutSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    if (!showConfetti) {
      setShowConfetti(true);
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#8b5cf6", "#6366f1", "#ec4899", "#f472b6"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#8b5cf6", "#6366f1", "#ec4899", "#f472b6"],
        });
      }, 250);
    }
  }, [showConfetti]);

  // Mock purchased items
  const purchasedItems = [
    {
      id: "1",
      title: "Neon Dreams",
      artist: "Electronic Producer",
      license: "COMMERCIAL",
      downloadUrl: "#",
    },
    {
      id: "2",
      title: "Corporate Success",
      artist: "Max Müller",
      license: "PERSONAL",
      downloadUrl: "#",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-green-500" />
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-3xl sm:text-4xl mb-4"
          >
            Zahlung erfolgreich!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-8"
          >
            Vielen Dank für deinen Einkauf! Deine Downloads sind jetzt verfügbar.
          </motion.p>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card className="bg-card border-border/50 text-left">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    Bestellnummer
                  </span>
                  <span className="font-mono font-medium">#ORD-2024-00123</span>
                </div>

                <div className="space-y-4">
                  {purchasedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                          <Music className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.artist} • {item.license}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={item.downloadUrl}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                  <span className="text-sm text-muted-foreground">
                    Rechnung
                  </span>
                  <Button variant="ghost" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    PDF herunterladen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Zum Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/marketplace">
                <Music className="w-4 h-4 mr-2" />
                Weiter shoppen
              </Link>
            </Button>
          </motion.div>

          {/* Email Notice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-muted-foreground mt-8"
          >
            Eine Bestätigung wurde an deine E-Mail-Adresse gesendet.
            <br />
            Du findest deine Downloads auch jederzeit in deinem{" "}
            <Link href="/dashboard" className="text-primary hover:underline">
              Dashboard
            </Link>
            .
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

