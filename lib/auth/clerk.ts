import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";

export interface CurrentUser {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
}

/**
 * Get the current authenticated user from Supabase
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  if (error || !user) {
    // User existiert noch nicht in Supabase (Webhook noch nicht verarbeitet)
    // Versuche, User aus Clerk zu holen und in Supabase zu erstellen
    const clerkUser = await currentUser();
    if (clerkUser) {
      const adminSupabase = createAdminClient();
      const { data: newUser } = await adminSupabase
        .from("users")
        .upsert({
          clerk_id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
          image: clerkUser.imageUrl || null,
          role: "CUSTOMER" as UserRole,
        })
        .select()
        .single();

      if (newUser) {
        return {
          id: newUser.id,
          clerkId: newUser.clerk_id,
          email: newUser.email,
          name: newUser.name,
          image: newUser.image,
          role: newUser.role as UserRole,
        };
      }
    }
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
 * Check if current user has required role
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized: Not authenticated");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Unauthorized: Requires one of these roles: ${allowedRoles.join(", ")}`);
  }

  return user;
}

/**
 * Check if user is admin
 */
export async function requireAdmin(): Promise<CurrentUser> {
  return requireRole(["ADMIN"]);
}

/**
 * Check if user is director
 */
export async function requireDirector(): Promise<CurrentUser> {
  return requireRole(["DIRECTOR", "ADMIN"]);
}

/**
 * Check if user is customer
 */
export async function requireCustomer(): Promise<CurrentUser> {
  return requireRole(["CUSTOMER", "ADMIN"]);
}

/**
 * Get director profile for current user
 */
export async function getCurrentDirectorProfile() {
  const user = await requireDirector();
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("director_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !profile) {
    throw new Error("Director profile not found");
  }

  return { user, profile };
}

