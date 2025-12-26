"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CreditCard,
  Lock,
  Shield,
  ChevronLeft,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

// Mock order summary
const orderItems = [
  {
    id: "1",
    title: "Neon Dreams",
    artist: "Max Müller",
    license: "Commercial",
    price: 49,
  },
  {
    id: "2",
    title: "Epic Horizon",
    artist: "Sarah Schmidt",
    license: "Enterprise",
    price: 349,
  },
];

const paymentMethods = [
  {
    id: "card",
    name: "Kreditkarte",
    icon: "💳",
    description: "Visa, Mastercard, American Express",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: "🅿️",
    description: "Mit deinem PayPal-Konto bezahlen",
  },
  {
    id: "klarna",
    name: "Klarna",
    icon: "🔵",
    description: "Sofort bezahlen oder später",
  },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      window.location.href = "/checkout/success";
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          href="/cart"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Zurück zum Warenkorb
        </Link>

        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Kontaktdaten</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Vorname</Label>
                      <Input
                        id="firstName"
                        placeholder="Max"
                        className="bg-background mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nachname</Label>
                      <Input
                        id="lastName"
                        placeholder="Mustermann"
                        className="bg-background mt-1"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">E-Mail-Adresse</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="max@example.de"
                      className="bg-background mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Firma (optional)</Label>
                    <Input
                      id="company"
                      placeholder="Musterfirma GmbH"
                      className="bg-background mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Rechnungsadresse</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="street">Straße & Hausnummer</Label>
                    <Input
                      id="street"
                      placeholder="Musterstraße 123"
                      className="bg-background mt-1"
                      required
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zip">PLZ</Label>
                      <Input
                        id="zip"
                        placeholder="12345"
                        className="bg-background mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Stadt</Label>
                      <Input
                        id="city"
                        placeholder="Berlin"
                        className="bg-background mt-1"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Land</Label>
                    <Input
                      id="country"
                      placeholder="Deutschland"
                      className="bg-background mt-1"
                      defaultValue="Deutschland"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Zahlungsmethode</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-border/80"
                        }`}
                      >
                        <RadioGroupItem value={method.id} className="sr-only" />
                        <span className="text-2xl mr-4">{method.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                        {paymentMethod === method.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </label>
                    ))}
                  </RadioGroup>

                  {/* Credit Card Form */}
                  {paymentMethod === "card" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6 pt-6 border-t border-border/50 space-y-4"
                    >
                      <div>
                        <Label htmlFor="cardNumber">Kartennummer</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="bg-background mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Gültig bis</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/JJ"
                            className="bg-background mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            className="bg-background mt-1"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  Ich akzeptiere die{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    AGB
                  </Link>{" "}
                  und die{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Datenschutzerklärung
                  </Link>
                  . Ich verstehe, dass die Lizenzen nach dem Kauf sofort
                  verfügbar sind und das Widerrufsrecht entfällt.
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!acceptTerms || isProcessing}
                className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Wird verarbeitet...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Jetzt €{total.toFixed(2)} bezahlen
                  </>
                )}
              </Button>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Sichere Zahlung mit SSL-Verschlüsselung</span>
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 border-border/50 sticky top-24">
              <CardHeader>
                <CardTitle className="font-serif">Deine Bestellung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                  >
                    <div>
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

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Zwischensumme</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">MwSt. (19%)</span>
                    <span>€{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Gesamt</span>
                    <span className="text-primary">€{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* What's Included */}
                <div className="bg-secondary/50 rounded-lg p-4 mt-4">
                  <h4 className="font-medium mb-3">Inklusive:</h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Sofortiger Download nach Zahlung",
                      "WAV + MP3 Dateien",
                      "Lizenzzertifikat",
                      "Rechnung per E-Mail",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Help */}
                <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Fragen zur Lizenzierung? Kontaktiere unseren{" "}
                    <Link href="/contact" className="text-primary hover:underline">
                      Support
                    </Link>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
