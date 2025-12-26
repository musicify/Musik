import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";

export interface AuthenticatedUser {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
}

/**
 * API-Route-Handler mit Authentifizierung
 * Gibt den authentifizierten User zurück oder einen 401-Fehler
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return null;
  }

  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .single();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    clerkId: user.clerk_id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role as UserRole,
  };
}

/**
 * Prüft ob der User authentifiziert ist und gibt einen Fehler zurück falls nicht
 */
export async function requireAuth(): Promise<{
  user: AuthenticatedUser;
  error?: never;
} | {
  user?: never;
  error: NextResponse;
}> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Nicht autorisiert. Bitte melde dich an." },
        { status: 401 }
      ),
    };
  }

  return { user };
}

/**
 * Prüft ob der User eine bestimmte Rolle hat
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<{
  user: AuthenticatedUser;
  error?: never;
} | {
  user?: never;
  error: NextResponse;
}> {
  const authResult = await requireAuth();

  if (authResult.error) {
    return authResult;
  }

  if (!allowedRoles.includes(authResult.user.role)) {
    return {
      error: NextResponse.json(
        { error: `Keine Berechtigung. Erforderliche Rolle: ${allowedRoles.join(", ")}` },
        { status: 403 }
      ),
    };
  }

  return { user: authResult.user };
}

/**
 * Prüft ob der User ein Admin ist
 */
export async function requireAdmin() {
  return requireRole(["ADMIN"]);
}

/**
 * Prüft ob der User ein Director ist
 */
export async function requireDirector() {
  return requireRole(["DIRECTOR", "ADMIN"]);
}

/**
 * Prüft ob der User ein Customer ist
 */
export async function requireCustomer() {
  return requireRole(["CUSTOMER", "DIRECTOR", "ADMIN"]);
}

/**
 * Holt das Director-Profil für den aktuellen User
 */
export async function getDirectorProfile(userId: string) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("director_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !profile) {
    return null;
  }

  return profile;
}

/**
 * API-Error-Handler
 */
export function handleApiError(error: unknown, message = "Ein Fehler ist aufgetreten") {
  console.error(message, error);
  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}

