"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CreditCard,
  Shield,
  Check,
  ChevronLeft,
  Lock,
  FileText,
  Download,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock cart items
const mockCartItems = [
  {
    id: "1",
    type: "music",
    title: "Neon Dreams",
    artist: "Electronic Producer",
    license: "COMMERCIAL",
    price: 79.99,
    coverImage: null,
  },
  {
    id: "2",
    type: "music",
    title: "Corporate Success",
    artist: "Max Müller",
    license: "PERSONAL",
    price: 29.99,
    coverImage: null,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptLicense, setAcceptLicense] = useState(false);

  // Calculate totals
  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!acceptTerms || !acceptLicense) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Redirect to success page
    router.push("/checkout/success");
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Zurück zum Warenkorb
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl mb-2">Checkout</h1>
          <p className="text-muted-foreground">
            Schließe deinen Einkauf ab und erhalte sofort Zugang zu deinen Tracks
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Rechnungsadresse
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Vorname</Label>
                      <Input id="firstName" placeholder="Max" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nachname</Label>
                      <Input id="lastName" placeholder="Mustermann" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">E-Mail</Label>
                    <Input id="email" type="email" placeholder="max@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="company">
                      Firma{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input id="company" placeholder="Firma GmbH" />
                  </div>
                  <div>
                    <Label htmlFor="address">Straße & Hausnummer</Label>
                    <Input id="address" placeholder="Musterstraße 123" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="zip">PLZ</Label>
                      <Input id="zip" placeholder="12345" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="city">Stadt</Label>
                      <Input id="city" placeholder="Berlin" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="vatId">
                      USt-IdNr.{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input id="vatId" placeholder="DE123456789" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Zahlungsmethode
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    <label
                      htmlFor="card"
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border/80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="card" id="card" />
                        <div>
                          <p className="font-medium">Kreditkarte</p>
                          <p className="text-sm text-muted-foreground">
                            Visa, Mastercard, American Express
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">Visa</Badge>
                        <Badge variant="outline">MC</Badge>
                        <Badge variant="outline">AMEX</Badge>
                      </div>
                    </label>

                    <label
                      htmlFor="paypal"
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === "paypal"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border/80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <div>
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-muted-foreground">
                            Schnell und sicher bezahlen
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">PayPal</Badge>
                    </label>

                    <label
                      htmlFor="sepa"
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === "sepa"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border/80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="sepa" id="sepa" />
                        <div>
                          <p className="font-medium">SEPA Lastschrift</p>
                          <p className="text-sm text-muted-foreground">
                            Direkt von deinem Bankkonto
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">SEPA</Badge>
                    </label>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Kartennummer</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Gültig bis</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card border-border/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) =>
                        setAcceptTerms(checked as boolean)
                      }
                    />
                    <label htmlFor="terms" className="text-sm cursor-pointer">
                      Ich akzeptiere die{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        AGB
                      </Link>{" "}
                      und{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Datenschutzerklärung
                      </Link>
                      .
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="license"
                      checked={acceptLicense}
                      onCheckedChange={(checked) =>
                        setAcceptLicense(checked as boolean)
                      }
                    />
                    <label htmlFor="license" className="text-sm cursor-pointer">
                      Ich habe die{" "}
                      <Link href="/license" className="text-primary hover:underline">
                        Lizenzbedingungen
                      </Link>{" "}
                      gelesen und verstanden. Die erworbene Lizenz berechtigt mich
                      zur Nutzung gemäß den gewählten Lizenzbedingungen.
                    </label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Bestellübersicht</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockCartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                          <Download className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.artist}
                          </p>
                          <Badge
                            variant="secondary"
                            className={`text-xs mt-1 ${
                              item.license === "COMMERCIAL"
                                ? "license-commercial"
                                : "license-personal"
                            }`}
                          >
                            {item.license}
                          </Badge>
                        </div>
                      </div>
                      <p className="font-medium">€{item.price.toFixed(2)}</p>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zwischensumme</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-1 text-muted-foreground">
                            MwSt. (19%)
                            <Info className="w-3 h-3" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Umsatzsteuer nach deutschem Recht</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span>€{tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-baseline">
                    <span className="font-medium">Gesamt</span>
                    <span className="text-2xl font-serif">€{total.toFixed(2)}</span>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={!acceptTerms || !acceptLicense || isProcessing}
                    onClick={handleCheckout}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Wird verarbeitet...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Jetzt bezahlen
                      </>
                    )}
                  </Button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                    <Shield className="w-4 h-4" />
                    SSL-verschlüsselt & PCI-DSS-konform
                  </div>

                  {/* What you get */}
                  <div className="bg-muted/30 rounded-lg p-4 mt-4">
                    <p className="text-sm font-medium mb-2">Das erhältst du:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500" />
                        Sofortiger Download nach Zahlung
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500" />
                        Hochauflösende Audio-Dateien (WAV/MP3)
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500" />
                        Lizenzurkunde als PDF
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500" />
                        Lebenslange Nutzungsrechte
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

