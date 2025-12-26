import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError, getDirectorProfile } from "@/lib/api/auth-helper";
import { createNotification } from "@/lib/api/notifications";
import { z } from "zod";

const createOrderSchema = z.object({
  title: z.string().min(5, "Titel muss mindestens 5 Zeichen haben"),
  description: z.string().min(20, "Beschreibung muss mindestens 20 Zeichen haben"),
  requirements: z.string().min(10, "Anforderungen müssen mindestens 10 Zeichen haben"),
  references: z.string().optional(),
  notes: z.string().optional(),
  budget: z.number().optional(),
  genre: z.string().optional(),
  subgenre: z.string().optional(),
  style: z.string().optional(),
  era: z.string().optional(),
  culture: z.string().optional(),
  mood: z.string().optional(),
  useCase: z.string().optional(),
  structure: z.string().optional(),
  directorIds: z.array(z.string()).min(1, "Mindestens ein Komponist muss ausgewählt werden"),
  paymentModel: z.enum(["PAY_ON_COMPLETION", "PARTIAL_PAYMENT"]).default("PAY_ON_COMPLETION"),
});

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  return `ORD-${year}-${random}`;
}

// GET - Bestellungen des Users abrufen
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role"); // "customer" oder "director"

    const supabase = await createClient();

    let query = supabase
      .from("orders")
      .select(`
        *,
        customer:users!orders_customer_id_fkey (
          id,
          name,
          email,
          image
        ),
        director:director_profiles (
          id,
          badges,
          user:users (
            name,
            image
          )
        ),
        chat:chats (
          id,
          messages:chat_messages (
            id,
            content,
            created_at
          )
        )
      `)
      .order("created_at", { ascending: false });

    // Je nach Rolle filtern
    if (role === "director" && user.role === "DIRECTOR") {
      // Director sieht seine Aufträge
      const directorProfile = await getDirectorProfile(user.id);
      if (directorProfile) {
        query = query.eq("director_id", directorProfile.id);
      }
    } else {
      // Customer sieht seine Aufträge
      query = query.eq("customer_id", user.id);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error("Orders Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Laden der Bestellungen" },
        { status: 500 }
      );
    }

    // Transformiere Daten für Frontend
    const transformedOrders = (orders || []).map((order: any) => {
      // Supabase gibt Relations als Array zurück, auch bei one-to-one Beziehungen
      const customerData = Array.isArray(order.customer) ? order.customer[0] : order.customer;
      const directorData = Array.isArray(order.director) ? order.director[0] : order.director;
      const chatData = Array.isArray(order.chat) ? order.chat[0] : order.chat;
      
      return {
        id: order.id,
        orderNumber: order.order_number,
        customerId: order.customer_id,
        directorId: order.director_id,
        status: order.status,
        title: order.title,
        description: order.description,
        requirements: order.requirements,
        references: order.references,
        notes: order.notes,
        budget: order.budget,
        genre: order.genre,
        subgenre: order.subgenre,
        style: order.style,
        era: order.era,
        culture: order.culture,
        mood: order.mood,
        useCase: order.use_case,
        structure: order.structure,
        offeredPrice: order.offered_price,
        productionTime: order.production_time,
        offerAcceptedAt: order.offer_accepted_at,
        includedRevisions: order.included_revisions,
        usedRevisions: order.used_revisions,
        finalMusicUrl: order.final_music_url,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        customer: customerData,
        director: directorData ? {
          id: directorData.id,
          badges: directorData.badges || [],
          user: directorData.user,
        } : null,
        chat: chatData ? {
          id: chatData.id,
          messages: chatData.messages?.slice(0, 1) || [],
        } : null,
      };
    });

    return NextResponse.json(transformedOrders);
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der Bestellungen");
  }
}

// POST - Neuen Auftrag erstellen
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const body = await req.json();
    const validatedData = createOrderSchema.parse(body);

    const supabase = await createClient();

    // Erstelle Aufträge für jeden ausgewählten Director
    const createdOrders = [];

    for (const directorId of validatedData.directorIds) {
      // Prüfe ob Director existiert und verifiziert ist
      const { data: director, error: directorError } = await supabase
        .from("director_profiles")
        .select("id, user_id, is_verified")
        .eq("id", directorId)
        .single();

      if (directorError || !director) {
        continue; // Skip ungültige Directors
      }

      // Generiere eindeutige Auftragsnummer
      const orderNumber = generateOrderNumber();

      // Auftrag erstellen
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_id: user.id,
          director_id: directorId,
          status: "PENDING",
          title: validatedData.title,
          description: validatedData.description,
          requirements: validatedData.requirements,
          references: validatedData.references,
          notes: validatedData.notes,
          budget: validatedData.budget,
          genre: validatedData.genre,
          subgenre: validatedData.subgenre,
          style: validatedData.style,
          era: validatedData.era,
          culture: validatedData.culture,
          mood: validatedData.mood,
          use_case: validatedData.useCase,
          structure: validatedData.structure,
          payment_model: validatedData.paymentModel,
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error("Order Create Error:", orderError);
        continue;
      }

      // Chat für den Auftrag erstellen
      const { data: chat, error: chatError } = await supabase
        .from("chats")
        .insert({
          order_id: order.id,
        })
        .select()
        .single();

      if (!chatError && chat) {
        // Chat-Teilnehmer hinzufügen
        await supabase.from("chat_participants").insert([
          { chat_id: chat.id, user_id: user.id },
          { chat_id: chat.id, user_id: director.user_id },
        ]);

        // System-Nachricht für neuen Auftrag
        await supabase.from("chat_messages").insert({
          chat_id: chat.id,
          sender_id: user.id,
          content: `Neuer Auftrag erstellt: ${validatedData.title}`,
          is_system_message: true,
        });
      }

      // Order History erstellen
      await supabase.from("order_history").insert({
        order_id: order.id,
        status: "PENDING",
        message: "Auftrag erstellt",
        changed_by: user.id,
      });

      createdOrders.push(order);

      // Benachrichtigung an Director senden
      await createNotification({
        userId: director.user_id,
        type: "order",
        title: "Neuer Auftrag erhalten",
        message: `Du hast einen neuen Auftrag erhalten: ${validatedData.title}`,
        link: `/director/orders`,
        metadata: {
          orderId: order.id,
          orderNumber: orderNumber,
        },
      });
    }

    if (createdOrders.length === 0) {
      return NextResponse.json(
        { error: "Keine Aufträge erstellt. Bitte prüfe die ausgewählten Komponisten." },
        { status: 400 }
      );
    }

    return NextResponse.json(createdOrders, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return handleApiError(error, "Fehler beim Erstellen des Auftrags");
  }
}
