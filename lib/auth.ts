/**
 * Auth Module - Clerk + Supabase Integration
 * 
 * Dieses Modul wurde von NextAuth auf Clerk umgestellt.
 * 
 * Für Authentifizierung nutze:
 * - @clerk/nextjs für Client-Komponenten
 * - @/lib/auth/clerk für Server-Komponenten und API-Routes
 * 
 * Beispiel:
 * ```typescript
 * // Server Component / API Route
 * import { getCurrentUser, requireAuth, requireAdmin } from "@/lib/auth/clerk";
 * 
 * const user = await getCurrentUser();
 * if (!user) {
 *   // Not authenticated
 * }
 * 
 * // Require specific role
 * const admin = await requireAdmin();
 * ```
 * 
 * ```typescript
 * // Client Component
 * import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
 * 
 * const { user, isLoaded, isSignedIn } = useUser();
 * ```
 */

// Re-export from clerk auth module
export {
  getCurrentUser,
  requireRole,
  requireAdmin,
  requireDirector,
  requireCustomer,
  getCurrentDirectorProfile,
  type CurrentUser,
} from "./auth/clerk";
