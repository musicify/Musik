"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Music,
  ArrowRight,
  Loader2,
  User,
  Check,
  Headphones,
  Mic2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type AccountType = "CUSTOMER" | "DIRECTOR";

const accountTypes = [
  {
    value: "CUSTOMER" as AccountType,
    icon: Headphones,
    title: "Kunde",
    description: "Musik kaufen und individuelle Aufträge erstellen",
  },
  {
    value: "DIRECTOR" as AccountType,
    icon: Mic2,
    title: "Komponist",
    description: "Musik verkaufen und Aufträge annehmen",
  },
];

const passwordRequirements = [
  { text: "Mindestens 8 Zeichen", check: (p: string) => p.length >= 8 },
  { text: "Ein Großbuchstabe", check: (p: string) => /[A-Z]/.test(p) },
  { text: "Ein Kleinbuchstabe", check: (p: string) => /[a-z]/.test(p) },
  { text: "Eine Zahl", check: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    accountType: "CUSTOMER" as AccountType,
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptNewsletter: false,
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    // Validate password requirements
    const passwordValid = passwordRequirements.every((req) =>
      req.check(formData.password)
    );
    if (!passwordValid) {
      setError("Das Passwort erfüllt nicht alle Anforderungen.");
      return;
    }

    // Validate terms
    if (!formData.acceptTerms) {
      setError("Bitte akzeptiere die AGB und Datenschutzerklärung.");
      return;
    }

    setIsLoading(true);

    try {
      // Here you would integrate with your API to create the user
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect based on account type
      if (formData.accountType === "DIRECTOR") {
        router.push("/director/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-card">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="absolute inset-0 pattern-dots opacity-20" />

        <div className="relative z-10 flex flex-col justify-between p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-2xl">Musicify</span>
          </Link>

          {/* Content */}
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="font-serif text-4xl xl:text-5xl mb-6">
                Werde Teil der{" "}
                <span className="gradient-text">Musicify</span> Community
              </h1>
              <p className="text-muted-foreground text-lg">
                Erstelle dein Konto und erhalte Zugang zu tausenden Tracks oder
                starte deine Karriere als Komponist.
              </p>
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {[
              "Sofortiger Zugang zu 10.000+ Tracks",
              "Sichere Zahlungsabwicklung",
              "Transparente Lizenzmodelle",
              "Direkte Kommunikation mit Komponisten",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Music className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-2xl">Musicify</span>
            </Link>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  s === step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-8">
                <h2 className="font-serif text-3xl mb-2">Kontotyp wählen</h2>
                <p className="text-muted-foreground">
                  Wie möchtest du Musicify nutzen?
                </p>
              </div>

              <RadioGroup
                value={formData.accountType}
                onValueChange={(value) =>
                  setFormData({ ...formData, accountType: value as AccountType })
                }
                className="space-y-4 mb-8"
              >
                {accountTypes.map((type) => (
                  <Label
                    key={type.value}
                    htmlFor={type.value}
                    className="cursor-pointer"
                  >
                    <Card
                      className={`transition-all ${
                        formData.accountType === type.value
                          ? "border-primary shadow-glow-sm"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <RadioGroupItem
                          value={type.value}
                          id={type.value}
                          className="sr-only"
                        />
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            formData.accountType === type.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          <type.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{type.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.accountType === type.value
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          }`}
                        >
                          {formData.accountType === type.value && (
                            <Check className="w-3 h-3 text-primary-foreground" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                ))}
              </RadioGroup>

              <Button
                onClick={() => setStep(2)}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Weiter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-8">
                <h2 className="font-serif text-3xl mb-2">Konto erstellen</h2>
                <p className="text-muted-foreground">
                  Gib deine Daten ein, um fortzufahren.
                </p>
              </div>

              {/* Google Login */}
              <Button variant="outline" className="w-full h-12 mb-6">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Mit Google registrieren
              </Button>

              <div className="relative mb-6">
                <Separator />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-sm text-muted-foreground">
                  oder
                </span>
              </div>

              {/* Register Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Max Mustermann"
                      className="pl-10 h-12"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.de"
                      className="pl-10 h-12"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Passwort</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {/* Password Requirements */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-1.5 text-xs ${
                          req.check(formData.password)
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        {req.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          acceptTerms: checked as boolean,
                        })
                      }
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                      Ich akzeptiere die{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        AGB
                      </Link>{" "}
                      und die{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Datenschutzerklärung
                      </Link>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.acceptNewsletter}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          acceptNewsletter: checked as boolean,
                        })
                      }
                      className="mt-1"
                    />
                    <Label htmlFor="newsletter" className="text-sm font-normal">
                      Newsletter mit Updates und Angeboten erhalten
                    </Label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12"
                    onClick={() => setStep(1)}
                  >
                    Zurück
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Registrieren...
                      </>
                    ) : (
                      <>
                        Konto erstellen
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Bereits ein Konto?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Jetzt anmelden
                </Link>
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

