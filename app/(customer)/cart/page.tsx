"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Clock,
  Tag,
  Shield,
  CreditCard,
  ChevronUp,
  Music,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock cart items
const initialCartItems = [
  {
    id: "cart-1",
    trackId: "1",
    title: "Neon Dreams",
    artist: "Max Müller",
    duration: 204,
    license: "COMMERCIAL",
    price: 49,
    coverGradient: "from-purple-500 to-pink-500",
  },
  {
    id: "cart-2",
    trackId: "2",
    title: "Epic Horizon",
    artist: "Sarah Schmidt",
    duration: 252,
    license: "ENTERPRISE",
    price: 349,
    coverGradient: "from-amber-500 to-orange-600",
  },
];

const licenseOptions = [
  { value: "PERSONAL", label: "Personal", multiplier: 0.6 },
  { value: "COMMERCIAL", label: "Commercial", multiplier: 1 },
  { value: "ENTERPRISE", label: "Enterprise", multiplier: 2.5 },
  { value: "EXCLUSIVE", label: "Exclusive", multiplier: 10 },
];

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.19;
  const total = subtotal - discount + tax;

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const updateLicense = (id: string, newLicense: string) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const basePrice = 49; // Base price for demo
          const option = licenseOptions.find((o) => o.value === newLicense);
          return {
            ...item,
            license: newLicense,
            price: Math.round(basePrice * (option?.multiplier || 1)),
          };
        }
        return item;
      })
    );
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "music10") {
      setPromoApplied(true);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-4xl mb-2">Warenkorb</h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? "Artikel" : "Artikel"} im
            Warenkorb
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl mb-2">Dein Warenkorb ist leer</h2>
            <p className="text-muted-foreground mb-6">
              Entdecke unseren Katalog und finde die perfekte Musik für dein
              Projekt.
            </p>
            <Link href="/marketplace">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Music className="w-4 h-4 mr-2" />
                Musik entdecken
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Cover */}
                        <div
                          className={`w-20 h-20 rounded-lg bg-gradient-to-br ${item.coverGradient} flex-shrink-0`}
                        />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/track/${item.trackId}`}
                            className="font-semibold hover:text-primary transition-colors"
                          >
                            {item.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {item.artist}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDuration(item.duration)}
                            </span>
                          </div>
                        </div>

                        {/* License Select */}
                        <div className="hidden sm:block w-40">
                          <Select
                            value={item.license}
                            onValueChange={(value) => updateLicense(item.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {licenseOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-semibold text-lg">€{item.price}</p>
                          <Badge variant="outline" className="text-xs">
                            {item.license}
                          </Badge>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Mobile License Select */}
                      <div className="mt-4 sm:hidden">
                        <Select
                          value={item.license}
                          onValueChange={(value) => updateLicense(item.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {licenseOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Promo Code */}
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Gutscheincode eingeben"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-background"
                      disabled={promoApplied}
                    />
                    <Button
                      variant="outline"
                      onClick={applyPromoCode}
                      disabled={promoApplied || !promoCode}
                    >
                      {promoApplied ? "Angewendet" : "Einlösen"}
                    </Button>
                  </div>
                  {promoApplied && (
                    <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      10% Rabatt wurde angewendet!
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card/50 border-border/50 sticky top-24">
                <CardHeader>
                  <CardTitle className="font-serif">Bestellübersicht</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Zwischensumme</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>Rabatt (10%)</span>
                        <span>-€{discount.toFixed(2)}</span>
                      </div>
                    )}
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

                  <Link href="/checkout">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg h-12 text-base">
                      Zur Kasse
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>

                  {/* Trust Badges */}
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>SSL-verschlüsselte Zahlung</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      <span>Kreditkarte, PayPal, Klarna</span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/50">
                    <div className="w-10 h-6 bg-secondary rounded flex items-center justify-center text-[10px] font-bold">
                      VISA
                    </div>
                    <div className="w-10 h-6 bg-secondary rounded flex items-center justify-center text-[10px] font-bold">
                      MC
                    </div>
                    <div className="w-10 h-6 bg-secondary rounded flex items-center justify-center text-[10px] font-bold">
                      PP
                    </div>
                    <div className="w-10 h-6 bg-secondary rounded flex items-center justify-center text-[10px] font-bold">
                      KLARNA
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
