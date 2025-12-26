"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { cartApi, CartItem, CartResponse, LicenseType } from "@/lib/api/client";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
  addToCart: (musicId: string, licenseType: LicenseType) => Promise<boolean>;
  addOrderToCart: (orderId: string) => Promise<boolean>;
  updateLicense: (itemId: string, licenseType: LicenseType) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await cartApi.get();

    if (result.error) {
      setError(result.error);
      // Nicht eingeloggt ist kein Fehler für den User
      if (!result.error.includes("autorisiert")) {
        console.error("Cart error:", result.error);
      }
      setItems([]);
      setSubtotal(0);
      setItemCount(0);
    } else if (result.data) {
      setItems(result.data.items);
      setSubtotal(result.data.subtotal);
      setItemCount(result.data.itemCount);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (musicId: string, licenseType: LicenseType): Promise<boolean> => {
    const result = await cartApi.add({ musicId, licenseType });

    if (result.error) {
      toast.error(result.error);
      return false;
    }

    toast.success("Zum Warenkorb hinzugefügt");
    await fetchCart();
    return true;
  }, [fetchCart]);

  const addOrderToCart = useCallback(async (orderId: string): Promise<boolean> => {
    const result = await cartApi.add({ orderId, licenseType: "COMMERCIAL" });

    if (result.error) {
      toast.error(result.error);
      return false;
    }

    toast.success("Auftrag zum Warenkorb hinzugefügt");
    await fetchCart();
    return true;
  }, [fetchCart]);

  const updateLicense = useCallback(async (itemId: string, licenseType: LicenseType): Promise<boolean> => {
    const result = await cartApi.updateLicense(itemId, licenseType);

    if (result.error) {
      toast.error(result.error);
      return false;
    }

    await fetchCart();
    return true;
  }, [fetchCart]);

  const removeItem = useCallback(async (itemId: string): Promise<boolean> => {
    const result = await cartApi.remove(itemId);

    if (result.error) {
      toast.error(result.error);
      return false;
    }

    toast.success("Artikel entfernt");
    await fetchCart();
    return true;
  }, [fetchCart]);

  const clearCart = useCallback(async (): Promise<boolean> => {
    const result = await cartApi.clear();

    if (result.error) {
      toast.error(result.error);
      return false;
    }

    toast.success("Warenkorb geleert");
    setItems([]);
    setSubtotal(0);
    setItemCount(0);
    return true;
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        itemCount,
        loading,
        error,
        addToCart,
        addOrderToCart,
        updateLicense,
        removeItem,
        clearCart,
        refetch: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

// License-Preis-Berechnung
export const LICENSE_CONFIG = {
  PERSONAL: {
    label: "Personal",
    description: "Private Nutzung, keine kommerzielle Verwendung",
    multiplier: 0.6,
  },
  COMMERCIAL: {
    label: "Commercial",
    description: "Kommerzielle Nutzung, begrenzte Reichweite",
    multiplier: 1,
  },
  ENTERPRISE: {
    label: "Enterprise",
    description: "Unbegrenzte kommerzielle Nutzung",
    multiplier: 2.5,
  },
  EXCLUSIVE: {
    label: "Exclusive",
    description: "Exklusivrechte, Track wird entfernt",
    multiplier: 10,
  },
};

export function calculateLicensePrice(basePrice: number, licenseType: LicenseType): number {
  return Math.round(basePrice * LICENSE_CONFIG[licenseType].multiplier * 100) / 100;
}

