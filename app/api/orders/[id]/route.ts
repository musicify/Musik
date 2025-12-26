import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, handleApiError, getDirectorProfile } from "@/lib/api/auth-helper";

// GET - Einzelne Bestellung abrufen
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const { id } = await params;
    const supabase = await createClient();

    const { data: order, error } = await supabase
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
          bio,
          badges,
          price_range_min,
          price_range_max,
          avg_response_time,
          completion_rate,
          rating,
          user:users (
            name,
            image,
            email
          )
        ),
        chat:chats (
          id
        ),
        history:order_history (
          id,
          status,
          message,
          changed_by,
          created_at
        )
      `)
      .eq("id", id)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      );
    }

    // Prüfe ob User berechtigt ist
    const directorProfile = user.role === "DIRECTOR" ? await getDirectorProfile(user.id) : null;
    const isCustomer = order.customer_id === user.id;
    const isDirector = directorProfile && order.director_id === directorProfile.id;
    const isAdmin = user.role === "ADMIN";

    if (!isCustomer && !isDirector && !isAdmin) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Transformiere Daten
    // Supabase gibt Relations als Array zurück, auch bei one-to-one Beziehungen
    const customerData = Array.isArray(order.customer) ? order.customer[0] : order.customer;
    const directorData = Array.isArray(order.director) ? order.director[0] : order.director;
    const chatData = Array.isArray(order.chat) ? order.chat[0] : order.chat;
    
    const transformedOrder = {
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
      paymentModel: order.payment_model,
      includedRevisions: order.included_revisions,
      usedRevisions: order.used_revisions,
      maxRevisions: order.max_revisions,
      finalMusicUrl: order.final_music_url,
      finalMusicId: order.final_music_id,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      customer: customerData,
      director: directorData ? {
        id: directorData.id,
        bio: directorData.bio,
        badges: directorData.badges || [],
        priceRangeMin: directorData.price_range_min,
        priceRangeMax: directorData.price_range_max,
        avgResponseTime: directorData.avg_response_time,
        completionRate: directorData.completion_rate,
        rating: directorData.rating,
        user: directorData.user,
      } : null,
      chatId: chatData?.id,
      history: order.history?.map((h: any) => ({
        id: h.id,
        status: h.status,
        message: h.message,
        changedBy: h.changed_by,
        createdAt: h.created_at,
      })) || [],
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    return handleApiError(error, "Fehler beim Laden der Bestellung");
  }
}

// PUT - Bestellung aktualisieren (vor Angebot)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) {
      return authResult.error;
    }

    const user = authResult.user;
    const { id } = await params;
    const body = await req.json();
    const supabase = await createClient();

    // Prüfe ob Bestellung existiert und dem User gehört
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, customer_id, status")
      .eq("id", id)
      .single();

    if (findError || !order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      );
    }

    if (order.customer_id !== user.id) {
      return NextResponse.json(
        { error: "Keine Berechtigung" },
        { status: 403 }
      );
    }

    // Nur PENDING Aufträge können bearbeitet werden
    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Bestellung kann nicht mehr bearbeitet werden" },
        { status: 400 }
      );
    }

    // Update erlaubte Felder
    const updateData: any = {};
    const allowedFields = [
      "title", "description", "requirements", "references", "notes",
      "budget", "genre", "subgenre", "style", "era", "culture",
      "mood", "use_case", "structure"
    ];

    for (const field of allowedFields) {
      const camelField = field.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      if (body[camelField] !== undefined) {
        updateData[field] = body[camelField];
      }
    }

    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Fehler beim Aktualisieren" },
        { status: 500 }
      );
    }

    // History-Eintrag
    await supabase.from("order_history").insert({
      order_id: id,
      status: "PENDING",
      message: "Auftrag aktualisiert",
      changed_by: user.id,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error, "Fehler beim Aktualisieren");
  }
}
