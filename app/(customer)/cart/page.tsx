"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Play,
  Pause,
  ArrowRight,
  CreditCard,
  Lock,
  Tag,
  X,
  ChevronRight,
  Info,
  Music,
  Check,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LICENSE_TYPES } from "@/lib/constants";

interface CartItem {
  id: string;
  type: "music" | "order";
  title: string;
  artist?: string;
  duration?: number;
  licenseType: string;
  price: number;
  coverGradient: string;
  orderId?: string;
}

// Mock cart data
const initialCartItems: CartItem[] = [
  {
    id: "1",
    type: "music",
    title: "Neon Dreams",
    artist: "Max Müller",
    duration: 204,
    licenseType: "COMMERCIAL",
    price: 49,
    coverGradient: "from-purple-500 to-pink-500",
  },
  {
    id: "2",
    type: "music",
    title: "Epic Horizon",
    artist: "Sarah Schmidt",
    duration: 252,
    licenseType: "COMMERCIAL",
    price: 79,
    coverGradient: "from-amber-500 to-orange-600",
  },
  {
    id: "3",
    type: "order",
    title: "Corporate Video Soundtrack",
    licenseType: "COMMERCIAL",
    price: 450,
    coverGradient: "from-cyan-500 to-blue-600",
    orderId: "ORD-2024-001",
  },
];

const licensePrices: Record<string, Record<string, number>> = {
  "1": { PERSONAL: 29, COMMERCIAL: 49, ENTERPRISE: 199, EXCLUSIVE: 990 },
  "2": { PERSONAL: 49, COMMERCIAL: 79, ENTERPRISE: 349, EXCLUSIVE: 1490 },
};

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function CartItemRow({
  item,
  onRemove,
  onLicenseChange,
  isPlaying,
  onPlayToggle,
}: {
  item: CartItem;
  onRemove: () => void;
  onLicenseChange: (license: string) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
}) {
  const licenseInfo = LICENSE_TYPES.find((l) => l.type === item.licenseType);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-colors"
    >
      {/* Cover */}
      <div
        className={`relative w-16 h-16 rounded-lg bg-gradient-to-br ${item.coverGradient} flex-shrink-0`}
      >
        {item.type === "music" && (
          <button
            onClick={onPlayToggle}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>
        )}
        {item.type === "order" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Music className="w-6 h-6 text-white/70" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={
                item.type === "music"
                  ? `/track/${item.id}`
                  : `/orders/${item.orderId}`
              }
              className="font-medium hover:text-primary transition-colors"
            >
              {item.title}
            </Link>
            {item.artist && (
              <p className="text-sm text-muted-foreground">{item.artist}</p>
            )}
            {item.orderId && (
              <p className="text-sm text-muted-foreground">
                Auftrag: {item.orderId}
              </p>
            )}
          </div>
          {item.duration && (
            <span className="text-sm text-muted-foreground hidden sm:block">
              {formatDuration(item.duration)}
            </span>
          )}
        </div>

        {/* License & Actions */}
        <div className="flex items-center gap-4 mt-2">
          {item.type === "music" && (
            <Select value={item.licenseType} onValueChange={onLicenseChange}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERSONAL">🎵 Personal</SelectItem>
                <SelectItem value="COMMERCIAL">🎬 Commercial</SelectItem>
                <SelectItem value="ENTERPRISE">🏢 Enterprise</SelectItem>
                <SelectItem value="EXCLUSIVE">🔒 Exclusive</SelectItem>
              </SelectContent>
            </Select>
          )}
          {item.type === "order" && (
            <Badge variant="secondary" className="text-xs">
              {licenseInfo?.icon} {licenseInfo?.name}
            </Badge>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="font-semibold text-lg">€{item.price}</p>
        {item.type === "music" && (
          <p className="text-xs text-muted-foreground">{licenseInfo?.name}</p>
        )}
      </div>

      {/* Remove Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Artikel entfernen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchtest du &quot;{item.title}&quot; wirklich aus dem Warenkorb
              entfernen?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={onRemove}>Entfernen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [playingItemId, setPlayingItemId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateLicense = (id: string, license: string) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id && item.type === "music") {
          const prices = licensePrices[id];
          return {
            ...item,
            licenseType: license,
            price: prices?.[license] || item.price,
          };
        }
        return item;
      })
    );
  };

  const applyCoupon = () => {
    // Mock coupon validation
    if (couponCode.toUpperCase() === "MUSIC10") {
      setAppliedCoupon("MUSIC10");
      setCouponDiscount(0.1); // 10% discount
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discount = subtotal * couponDiscount;
  const tax = (subtotal - discount) * 0.19;
  const total = subtotal - discount + tax;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Warenkorb</span>
        </nav>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingCart className="w-20 h-20 mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="font-serif text-3xl mb-4">
              Dein Warenkorb ist leer
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Entdecke unseren Katalog mit tausenden professionellen Tracks oder
              beauftrage individuelle Musik.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/marketplace">
                <Button className="bg-primary hover:bg-primary/90">
                  Musik entdecken
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/custom-music">
                <Button variant="outline">Custom Music</Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Cart Items */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-serif text-3xl">Warenkorb</h1>
                <Badge variant="secondary">
                  {cartItems.length}{" "}
                  {cartItems.length === 1 ? "Artikel" : "Artikel"}
                </Badge>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onRemove={() => removeItem(item.id)}
                      onLicenseChange={(license) =>
                        updateLicense(item.id, license)
                      }
                      isPlaying={playingItemId === item.id}
                      onPlayToggle={() =>
                        setPlayingItemId(
                          playingItemId === item.id ? null : item.id
                        )
                      }
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Continue Shopping */}
              <div className="mt-8">
                <Link href="/marketplace">
                  <Button variant="ghost">
                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    Weiter einkaufen
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">
                    Zusammenfassung
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Coupon Code */}
                  <div>
                    <p className="text-sm font-medium mb-2">Rabattcode</p>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-primary" />
                          <span className="font-medium text-primary">
                            {appliedCoupon}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            (-{couponDiscount * 100}%)
                          </span>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-6 h-6"
                          onClick={removeCoupon}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Code eingeben"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="h-10"
                        />
                        <Button
                          variant="outline"
                          onClick={applyCoupon}
                          disabled={!couponCode}
                        >
                          Einlösen
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Zwischensumme</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>Rabatt ({couponDiscount * 100}%)</span>
                        <span>-€{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        MwSt. (19%)
                      </span>
                      <span>€{tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Gesamt</span>
                      <span className="text-primary">€{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Zur Kasse
                  </Button>

                  {/* Trust Badges */}
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4 text-green-500" />
                      <span>Sichere Zahlung mit SSL-Verschlüsselung</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Sofortiger Download nach Bezahlung</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Lizenzzertifikat per E-Mail</span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">
                      Zahlungsarten
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-6 bg-secondary rounded flex items-center justify-center text-[10px] font-bold">
                        VISA
                      </div>
                      <div className="w-10 h-6 bg-secondary rounded flex items-center justify-center text-[10px] font-bold">
                        MC
                      </div>
                      <div className="w-10 h-6 bg-secondary rounded flex items-center justify-center text-[10px] font-bold">
                        AMEX
                      </div>
                      <div className="w-10 h-6 bg-secondary rounded flex items-center justify-center text-[10px] font-bold">
                        PP
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Link */}
              <div className="mt-4 text-center">
                <Link
                  href="/help"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  <Info className="w-4 h-4" />
                  Fragen zum Checkout?
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

