import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Öffentliche Routen (keine Authentifizierung erforderlich)
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/pricing",
  "/contact",
  "/marketplace",
  "/track/(.*)",
  "/directors",
  "/directors/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/music",
  "/api/directors",
]);

// Admin-only Routen
const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
]);

// Director-only Routen
const isDirectorRoute = createRouteMatcher([
  "/director(.*)",
  "/api/director(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // Öffentliche Routen erlauben
  if (isPublicRoute(request)) {
    return;
  }

  // Alle anderen Routen erfordern Authentifizierung
  await auth.protect();

  // Hinweis: Rollenbasierte Zugriffskontrolle wird in den API-Routes
  // und Server Components implementiert, da wir die Rolle aus
  // der Supabase-Datenbank laden müssen
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

