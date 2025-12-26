// Re-export everything from supabase modules
export { createClient as createBrowserClient, getSupabaseClient } from "./client";
export { createClient as createServerClient, createAdminClient } from "./server";
export { updateSession } from "./middleware";
export * from "./types";

