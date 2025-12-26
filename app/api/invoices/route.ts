import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError } from "@/lib/api/auth-helper";

// GET - Rechnungen des Users abrufen
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const supabase = await createClient();

    const { data: invoices, error } = await supabase
      .from("invoices")
      .select(`
        id,
        invoice_number,
        amount,
        tax,
        total,
        status,
        payment_method,
        paid_at,
        created_at,
        items:invoice_items (
          id,
          description,
          price,
          total,
          license_type,
          music:music_id (
            id,
            title
          ),
          order:order_id (
            id,
            title
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Invoices Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Laden der Rechnungen" },
        { status: 500 }
      );
    }

    // Transformiere Daten
    const transformedInvoices = (invoices || []).map((invoice: any) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      amount: invoice.amount,
      tax: invoice.tax,
      total: invoice.total,
      status: invoice.status,
      paymentMethod: invoice.payment_method,
      paidAt: invoice.paid_at,
      createdAt: invoice.created_at,
      items: (invoice.items || []).map((item: any) => ({
        id: item.id,
        description: item.description,
        price: item.price,
        total: item.total,
        licenseType: item.license_type,
        musicTitle: item.music?.title,
        orderTitle: item.order?.title,
      })),
    }));

    return NextResponse.json(transformedInvoices);
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der Rechnungen");
  }
}
