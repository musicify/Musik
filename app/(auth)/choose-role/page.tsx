"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Music, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function ChooseRolePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Warte bis Clerk geladen ist
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Wenn nicht eingeloggt, zur Login-Seite weiterleiten
  if (!user) {
    router.push("/sign-in");
    return null;
  }

  const handleRoleSelection = async (role: "CUSTOMER" | "DIRECTOR") => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/role", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Aktualisieren der Rolle");
      }

      // Weiterleitung basierend auf gewählter Rolle
      if (role === "DIRECTOR") {
        router.push("/director/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ein Fehler ist aufgetreten"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <Music className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-3xl">Musicify</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl mb-3">
            Willkommen bei Musicify!
          </h1>
          <p className="text-muted-foreground text-lg">
            Wähle, wie du Musicify nutzen möchtest
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive text-center">
            {error}
          </div>
        )}

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Option */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg">
                  <ShoppingBag className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-serif text-2xl mb-3">Musik kaufen</h2>
                <p className="text-muted-foreground mb-6 flex-grow">
                  Entdecke lizenzierte Musik für deine Projekte. Kaufe Tracks
                  aus unserem Katalog oder beauftrage individuelle Musik.
                </p>
                <ul className="text-left space-y-2 mb-6 w-full">
                  <li className="flex items-center gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    Musik aus dem Katalog kaufen
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    Individuelle Musik beauftragen
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    Downloads und Lizenzen verwalten
                  </li>
                </ul>
                <Button
                  onClick={() => handleRoleSelection("CUSTOMER")}
                  disabled={isLoading}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird geladen...
                    </>
                  ) : (
                    <>
                      Als Kunde fortfahren
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Director Option */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg">
                  <Music className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-serif text-2xl mb-3">Musik erstellen</h2>
                <p className="text-muted-foreground mb-6 flex-grow">
                  Werde Teil unserer Community von Musikern. Verkaufe deine
                  Tracks und erstelle individuelle Musik für Kunden.
                </p>
                <ul className="text-left space-y-2 mb-6 w-full">
                  <li className="flex items-center gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    Eigene Tracks hochladen und verkaufen
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    Individuelle Aufträge annehmen
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    Einnahmen generieren
                  </li>
                </ul>
                <Button
                  onClick={() => handleRoleSelection("DIRECTOR")}
                  disabled={isLoading}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird geladen...
                    </>
                  ) : (
                    <>
                      Als Director fortfahren
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Du kannst deine Rolle später in den Einstellungen ändern.
        </p>
      </motion.div>
    </div>
  );
}

