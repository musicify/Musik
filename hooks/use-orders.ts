"use client";

import { useState, useEffect, useCallback } from "react";
import { ordersApi, Order, CreateOrderData, OfferData } from "@/lib/api/client";
import { toast } from "sonner";

export function useOrders(role?: "customer" | "director") {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await ordersApi.list(role);

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    } else if (result.data) {
      setOrders(result.data);
    }

    setLoading(false);
  }, [role]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (data: CreateOrderData): Promise<Order[] | null> => {
    const result = await ordersApi.create(data);

    if (result.error) {
      toast.error(result.error);
      return null;
    }

    toast.success("Auftrag erfolgreich erstellt!");
    await fetchOrders();
    return result.data || null;
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
  };
}

export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    const result = await ordersApi.get(id);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setOrder(result.data);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Order-Aktionen
  const makeOffer = useCallback(async (data: OfferData): Promise<boolean> => {
    const result = await ordersApi.makeOffer(id, data);
    if (result.error) {
      toast.error(result.error);
      return false;
    }
    toast.success("Angebot gesendet!");
    await fetchOrder();
    return true;
  }, [id, fetchOrder]);

  const acceptOffer = useCallback(async (): Promise<boolean> => {
    const result = await ordersApi.acceptOffer(id);
    if (result.error) {
      toast.error(result.error);
      return false;
    }
    toast.success("Angebot angenommen!");
    await fetchOrder();
    return true;
  }, [id, fetchOrder]);

  const rejectOffer = useCallback(async (reason?: string): Promise<boolean> => {
    const result = await ordersApi.rejectOffer(id, reason);
    if (result.error) {
      toast.error(result.error);
      return false;
    }
    toast.success("Angebot abgelehnt");
    await fetchOrder();
    return true;
  }, [id, fetchOrder]);

  const deliver = useCallback(async (musicUrl: string, message?: string): Promise<boolean> => {
    const result = await ordersApi.deliver(id, { musicUrl, message });
    if (result.error) {
      toast.error(result.error);
      return false;
    }
    toast.success("Musik geliefert!");
    await fetchOrder();
    return true;
  }, [id, fetchOrder]);

  const requestRevision = useCallback(async (feedback: string): Promise<boolean> => {
    const result = await ordersApi.requestRevision(id, { feedback });
    if (result.error) {
      toast.error(result.error);
      return false;
    }
    toast.success("Revision angefordert");
    await fetchOrder();
    return true;
  }, [id, fetchOrder]);

  const complete = useCallback(async (): Promise<boolean> => {
    const result = await ordersApi.complete(id);
    if (result.error) {
      toast.error(result.error);
      return false;
    }
    toast.success("Auftrag abgeschlossen!");
    await fetchOrder();
    return true;
  }, [id, fetchOrder]);

  const cancel = useCallback(async (reason?: string): Promise<boolean> => {
    const result = await ordersApi.cancel(id, reason);
    if (result.error) {
      toast.error(result.error);
      return false;
    }
    toast.success("Auftrag storniert");
    await fetchOrder();
    return true;
  }, [id, fetchOrder]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
    makeOffer,
    acceptOffer,
    rejectOffer,
    deliver,
    requestRevision,
    complete,
    cancel,
  };
}

// Status-Konfiguration für UI
export const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: "Wartet auf Angebot", color: "text-yellow-500", bgColor: "bg-yellow-500/20" },
  OFFER_PENDING: { label: "Angebot erhalten", color: "text-blue-500", bgColor: "bg-blue-500/20" },
  OFFER_ACCEPTED: { label: "In Auftrag", color: "text-green-500", bgColor: "bg-green-500/20" },
  IN_PROGRESS: { label: "In Bearbeitung", color: "text-blue-500", bgColor: "bg-blue-500/20" },
  REVISION_REQUESTED: { label: "Revision", color: "text-orange-500", bgColor: "bg-orange-500/20" },
  READY_FOR_PAYMENT: { label: "Bereit zur Zahlung", color: "text-purple-500", bgColor: "bg-purple-500/20" },
  PAID: { label: "Bezahlt", color: "text-green-500", bgColor: "bg-green-500/20" },
  COMPLETED: { label: "Abgeschlossen", color: "text-green-600", bgColor: "bg-green-600/20" },
  CANCELLED: { label: "Storniert", color: "text-gray-500", bgColor: "bg-gray-500/20" },
  DISPUTED: { label: "Streitfall", color: "text-red-500", bgColor: "bg-red-500/20" },
};

