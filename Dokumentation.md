# Musicify - Technische Dokumentation

## 📋 Inhaltsverzeichnis

1. [Projektübersicht](#projektübersicht)
2. [Architektur](#architektur)
3. [Authentifizierung](#authentifizierung)
4. [API-Referenz](#api-referenz)
5. [Datenbank-Schema](#datenbank-schema)
6. [Frontend-Komponenten](#frontend-komponenten)
7. [Hooks & State Management](#hooks--state-management)
8. [Zahlungsintegration](#zahlungsintegration)
9. [Benutzerrollen](#benutzerrollen)
10. [Deployment](#deployment)

---

## 🎵 Projektübersicht

Musicify ist eine vollständige Musik-Marktplatz-Plattform, die es ermöglicht:

- **Musik zu kaufen**: Lizenzierte Musik aus dem Katalog erwerben
- **Custom Music zu bestellen**: Individuelle Musikproduktion bei verifizierten Komponisten
- **Als Komponist zu verkaufen**: Eigene Musik hochladen und Aufträge annehmen

### Tech-Stack

| Technologie | Verwendung |
|-------------|------------|
| **Next.js 14** | React Framework mit App Router |
| **TypeScript** | Typsichere Entwicklung |
| **Supabase** | PostgreSQL-Datenbank & Auth-Backend |
| **Clerk** | Authentifizierung & Benutzerverwaltung |
| **Stripe** | Zahlungsabwicklung |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animationen |
| **Zod** | Schema-Validierung |

---

## 🏗 Architektur

### Projektstruktur

```
/app
  /(admin)         # Admin-Bereich
  /(auth)          # Authentifizierung (Login, Register)
  /(customer)      # Kundenbereich
  /(director)      # Komponisten-Bereich
  /api             # API-Routes

/components
  /chat            # Chat-Komponenten
  /filters         # Filter-Panels
  /layout          # Header, Footer
  /music           # Audio-Player, Musik-Cards
  /ui              # UI-Komponenten (shadcn/ui)

/hooks             # React-Hooks
/lib
  /api             # API-Client & Helper
  /auth            # Auth-Utilities
  /supabase        # Supabase-Client

/prisma            # Prisma-Schema (Referenz)
/supabase
  /migrations      # SQL-Migrationen
```

### API-Schicht

```
Frontend → API-Client (lib/api/client.ts) → API-Routes (/api/*) → Supabase
```

---

## 🔐 Authentifizierung

### Clerk Integration

Die Authentifizierung erfolgt über Clerk mit automatischer Synchronisation zu Supabase.

**Middleware** (`middleware.ts`):
- Schützt alle Routen außer öffentlichen
- Öffentliche Routen: `/`, `/marketplace`, `/directors`, `/sign-in`, `/sign-up`

**Auth-Helper** (`lib/api/auth-helper.ts`):

```typescript
// User abrufen
const user = await getAuthenticatedUser();

// Auth prüfen
const { user, error } = await requireAuth();

// Rolle prüfen
const { user, error } = await requireRole(["ADMIN", "DIRECTOR"]);

// Shortcuts
await requireAdmin();    // Nur Admin
await requireDirector(); // Director oder Admin
await requireCustomer(); // Alle authentifizierten User
```

### Webhook (Clerk → Supabase)

Bei Clerk-Events wird der User in Supabase synchronisiert:
- `user.created`: User in `users`-Tabelle erstellen
- `user.updated`: User-Daten aktualisieren
- `user.deleted`: User löschen

---

## 📡 API-Referenz

### Musik-API

| Endpoint | Methode | Auth | Beschreibung |
|----------|---------|------|--------------|
| `/api/music` | GET | ❌ | Musik-Liste mit Filtern |
| `/api/music` | POST | Director | Neuen Track erstellen |
| `/api/music/[id]` | GET | ❌ | Track-Details |
| `/api/music/[id]` | PUT | Director | Track aktualisieren |
| `/api/music/[id]` | DELETE | Director | Track löschen |

**Query-Parameter** (GET `/api/music`):
```
?genre=Electronic
&mood=Energetic
&useCase=Werbung
&priceMin=50
&priceMax=200
&durationMin=120
&durationMax=300
&search=neon
&sortBy=popular|newest|price_asc|price_desc
&page=1
&limit=20
```

**Response-Format**:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

### Warenkorb-API

| Endpoint | Methode | Auth | Beschreibung |
|----------|---------|------|--------------|
| `/api/cart` | GET | ✅ | Warenkorb abrufen |
| `/api/cart` | POST | ✅ | Artikel hinzufügen |
| `/api/cart` | DELETE | ✅ | Warenkorb leeren |
| `/api/cart/[itemId]` | PUT | ✅ | Lizenz ändern |
| `/api/cart/[itemId]` | DELETE | ✅ | Artikel entfernen |

**Lizenztypen**:
- `PERSONAL` - Preis × 0.6
- `COMMERCIAL` - Basispreis
- `ENTERPRISE` - Preis × 2.5
- `EXCLUSIVE` - Preis × 10 (Track wird entfernt)

### Bestellungen-API

| Endpoint | Methode | Auth | Beschreibung |
|----------|---------|------|--------------|
| `/api/orders` | GET | ✅ | Bestellungen abrufen |
| `/api/orders` | POST | Customer | Neuen Auftrag erstellen |
| `/api/orders/[id]` | GET | ✅ | Bestellungs-Details |
| `/api/orders/[id]` | PUT | Customer | Auftrag bearbeiten (nur PENDING) |
| `/api/orders/[id]/offer` | POST | Director | Angebot abgeben |
| `/api/orders/[id]/accept` | POST | Customer | Angebot annehmen |
| `/api/orders/[id]/reject` | POST | Customer | Angebot ablehnen |
| `/api/orders/[id]/deliver` | POST | Director | Musik liefern |
| `/api/orders/[id]/revision` | POST | Customer | Revision anfordern |
| `/api/orders/[id]/complete` | POST | Customer | Auftrag abschließen |
| `/api/orders/[id]/cancel` | POST | ✅ | Auftrag stornieren |

**Auftragsstatus-Flow**:
```
PENDING → OFFER_PENDING → OFFER_ACCEPTED → IN_PROGRESS 
       ↓                                        ↓
  (abgelehnt)                           REVISION_REQUESTED
                                               ↓
                               READY_FOR_PAYMENT → PAID → COMPLETED
                                               ↓
                                           CANCELLED
                                           DISPUTED
```

### Chat-API

| Endpoint | Methode | Auth | Beschreibung |
|----------|---------|------|--------------|
| `/api/chat/[chatId]` | GET | ✅ | Chat-Details |
| `/api/chat/[chatId]/messages` | GET | ✅ | Nachrichten laden |
| `/api/chat/[chatId]/messages` | POST | ✅ | Nachricht senden |

### Directors-API

| Endpoint | Methode | Auth | Beschreibung |
|----------|---------|------|--------------|
| `/api/directors` | GET | ❌ | Komponisten-Liste |
| `/api/directors/[id]` | GET | ❌ | Komponisten-Profil |
| `/api/directors/profile` | GET | Director | Eigenes Profil |
| `/api/directors/profile` | PUT | Director | Profil bearbeiten |
| `/api/directors/stats` | GET | Director | Statistiken |

### Payments-API

| Endpoint | Methode | Auth | Beschreibung |
|----------|---------|------|--------------|
| `/api/payments` | POST | ✅ | Checkout-Session erstellen |
| `/api/payments/webhook` | POST | Stripe | Stripe-Webhook |

### Admin-API

| Endpoint | Methode | Auth | Beschreibung |
|----------|---------|------|--------------|
| `/api/admin/stats` | GET | Admin | Plattform-Statistiken |
| `/api/admin/users` | GET | Admin | User-Liste |
| `/api/admin/directors/pending` | GET | Admin | Ausstehende Verifizierungen |
| `/api/admin/directors/[id]/verify` | POST | Admin | Director verifizieren |
| `/api/admin/music/pending` | GET | Admin | Ausstehende Musik-Freigaben |
| `/api/admin/music/[id]/approve` | POST | Admin | Musik freigeben |
| `/api/admin/disputes` | GET | Admin | Offene Streitfälle |
| `/api/admin/disputes/[id]` | PUT | Admin | Streitfall lösen |

---

## 🗄 Datenbank-Schema

### Haupttabellen

#### users
```sql
- id (uuid, PK)
- clerk_id (text, UNIQUE)
- email (text, UNIQUE)
- name (text)
- image (text)
- role (enum: CUSTOMER, DIRECTOR, ADMIN)
- created_at (timestamp)
```

#### director_profiles
```sql
- id (uuid, PK)
- user_id (uuid, FK → users)
- bio (text)
- specialization (text[])
- price_range_min (float)
- price_range_max (float)
- badges (enum[]: VERIFIED, TOP_SELLER, PREMIUM)
- is_verified (boolean)
- rating (float)
- total_projects (int)
- total_earnings (float)
```

#### music
```sql
- id (uuid, PK)
- title (text)
- description (text)
- duration (int) -- Sekunden
- price (float)
- audio_url (text)
- preview_url (text)
- cover_image (text)
- genre (text)
- mood (text)
- status (enum: ACTIVE, INACTIVE, EXCLUSIVE_SOLD)
- director_id (uuid, FK → director_profiles)
- price_personal, price_commercial, price_enterprise, price_exclusive (float)
```

#### orders
```sql
- id (uuid, PK)
- order_number (text, UNIQUE)
- customer_id (uuid, FK → users)
- director_id (uuid, FK → director_profiles)
- status (enum: PENDING, OFFER_PENDING, ...)
- title (text)
- description (text)
- requirements (text)
- budget (float)
- offered_price (float)
- production_time (int) -- Tage
- included_revisions (int)
- used_revisions (int)
- final_music_url (text)
```

#### chats / chat_messages
```sql
chats:
- id (uuid, PK)
- order_id (uuid, FK → orders)

chat_messages:
- id (uuid, PK)
- chat_id (uuid, FK → chats)
- sender_id (uuid, FK → users)
- content (text)
- file_url (text)
- is_system_message (boolean)
```

#### cart_items
```sql
- id (uuid, PK)
- user_id (uuid, FK → users)
- music_id (uuid, FK → music)
- order_id (uuid, FK → orders)
- license_type (enum: PERSONAL, COMMERCIAL, ENTERPRISE, EXCLUSIVE)
```

#### invoices / invoice_items
```sql
invoices:
- id (uuid, PK)
- invoice_number (text, UNIQUE)
- user_id (uuid, FK → users)
- amount, tax, total (float)
- status (enum: PENDING, COMPLETED, REFUNDED)
- stripe_payment_id (text)

invoice_items:
- id (uuid, PK)
- invoice_id (uuid, FK → invoices)
- music_id / order_id (uuid, FK)
- description (text)
- price, total (float)
- license_type (enum)
```

#### downloads
```sql
- id (uuid, PK)
- user_id (uuid, FK → users)
- music_id / order_id (uuid, FK)
- license_type (enum)
- download_url (text)
- download_count (int)
```

---

## 🎨 Frontend-Komponenten

### Layout-Komponenten

| Komponente | Pfad | Beschreibung |
|------------|------|--------------|
| Header | `components/layout/header.tsx` | Navigation, Logo, User-Menu |
| Footer | `components/layout/footer.tsx` | Links, Social, Copyright |

### Musik-Komponenten

| Komponente | Pfad | Beschreibung |
|------------|------|--------------|
| MusicCard | `components/music/music-card.tsx` | Track-Vorschau-Karte |
| AudioPlayer | `components/music/audio-player.tsx` | Audio-Wiedergabe |
| WaveformPlayer | `components/music/waveform-player.tsx` | Player mit Waveform |
| GlobalAudioPlayer | `components/music/global-audio-player.tsx` | Globaler Player |

### Filter-Komponenten

| Komponente | Pfad | Beschreibung |
|------------|------|--------------|
| MusicFilterPanel | `components/filters/music-filter-panel.tsx` | Desktop-Filter |
| MusicFilterSheet | `components/filters/music-filter-panel.tsx` | Mobile-Filter |

### Chat-Komponenten

| Komponente | Pfad | Beschreibung |
|------------|------|--------------|
| OrderChat | `components/chat/order-chat.tsx` | Chat für Aufträge |

---

## 🪝 Hooks & State Management

### useMusic

```typescript
const {
  tracks,           // MusicTrack[]
  loading,          // boolean
  error,            // string | null
  filters,          // MusicFilters
  pagination,       // { page, limit, total, totalPages }
  updateFilters,    // (filters: MusicFilters) => void
  resetFilters,     // () => void
  nextPage,         // () => void
  prevPage,         // () => void
  refetch,          // () => Promise<void>
} = useMusic(initialFilters);
```

### useCart

```typescript
const {
  items,            // CartItem[]
  subtotal,         // number
  itemCount,        // number
  loading,          // boolean
  addToCart,        // (musicId, licenseType) => Promise<boolean>
  addOrderToCart,   // (orderId) => Promise<boolean>
  updateLicense,    // (itemId, licenseType) => Promise<boolean>
  removeItem,       // (itemId) => Promise<boolean>
  clearCart,        // () => Promise<boolean>
  refetch,          // () => Promise<void>
} = useCart();
```

**CartProvider** muss in `layout.tsx` eingebunden werden:
```tsx
<CartProvider>
  {children}
</CartProvider>
```

### useOrders

```typescript
// Liste
const {
  orders,
  loading,
  error,
  refetch,
  createOrder,
} = useOrders(role);  // "customer" | "director"

// Einzelne Bestellung
const {
  order,
  loading,
  error,
  refetch,
  makeOffer,        // (data: OfferData) => Promise<boolean>
  acceptOffer,      // () => Promise<boolean>
  rejectOffer,      // (reason?) => Promise<boolean>
  deliver,          // (musicUrl, message?) => Promise<boolean>
  requestRevision,  // (feedback) => Promise<boolean>
  complete,         // () => Promise<boolean>
  cancel,           // (reason?) => Promise<boolean>
} = useOrder(orderId);
```

---

## 💳 Zahlungsintegration

### Stripe-Setup

**Erforderliche Umgebungsvariablen**:
```env
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

### Checkout-Flow

1. **Warenkorb → Checkout**:
   ```typescript
   const { data } = await paymentsApi.createCheckoutSession({
     cartItemIds: ["item1", "item2"],
     promoCode: "MUSIC10",
   });
   window.location.href = data.url;
   ```

2. **Stripe Checkout**: User gibt Zahlungsdaten ein

3. **Webhook** (`/api/payments/webhook`):
   - `checkout.session.completed` Event
   - Rechnung erstellen
   - Downloads freischalten
   - Warenkorb leeren
   - Bestellstatus aktualisieren

### Webhook-Verarbeitung

```typescript
// checkout.session.completed
- Invoice erstellen
- Für jeden Warenkorb-Artikel:
  - Download-Eintrag erstellen
  - Invoice-Item erstellen
  - Bei Musik: Purchase-Count erhöhen
  - Bei EXCLUSIVE: Musik als EXCLUSIVE_SOLD markieren
  - Bei Order: Status auf PAID setzen
- Warenkorb leeren
```

---

## 👥 Benutzerrollen

### CUSTOMER (Kunde)

**Berechtigungen**:
- Musik durchsuchen und kaufen
- Aufträge erstellen
- Mit Komponisten chatten
- Angebote annehmen/ablehnen
- Revisionen anfordern
- Downloads verwalten

**Seiten**:
- `/dashboard` - Übersicht
- `/marketplace` - Musik-Katalog
- `/cart` - Warenkorb
- `/checkout` - Bezahlung
- `/orders` - Aufträge
- `/downloads` - Downloads
- `/invoices` - Rechnungen
- `/settings` - Einstellungen

### DIRECTOR (Komponist)

**Berechtigungen**:
- Alle CUSTOMER-Rechte
- Musik hochladen
- Profil verwalten
- Aufträge annehmen
- Angebote erstellen
- Musik liefern
- Statistiken einsehen

**Seiten**:
- `/director/dashboard` - Übersicht
- `/director/music` - Meine Musik
- `/director/music/upload` - Upload
- `/director/orders` - Aufträge
- `/director/profile` - Profil
- `/director/settings` - Einstellungen

### ADMIN (Administrator)

**Berechtigungen**:
- Alle Rechte
- User verwalten
- Directors verifizieren
- Musik freigeben
- Streitfälle lösen
- Statistiken einsehen

**Seiten**:
- `/admin/dashboard` - Übersicht
- `/admin/users` - User-Verwaltung
- `/admin/directors` - Directors
- `/admin/music` - Musik-Freigabe
- `/admin/tracks` - Alle Tracks
- `/admin/disputes` - Streitfälle
- `/admin/settings` - Einstellungen

---

## 🚀 Deployment

### Umgebungsvariablen

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# App
NEXT_PUBLIC_APP_URL=https://musicify.app
```

### Datenbank-Migration

```bash
# Supabase-Migrationen ausführen
cd supabase
supabase db push
```

### Build & Start

```bash
# Dependencies installieren
npm install

# Build
npm run build

# Starten
npm run start
```

### Vercel-Deployment

1. Repository mit Vercel verbinden
2. Umgebungsvariablen konfigurieren
3. Build-Command: `npm run build`
4. Stripe-Webhook auf `https://domain.com/api/payments/webhook` setzen

---

## 📝 Changelog

### Version 1.0.0

**Implementiert**:

✅ **Authentifizierung**
- Clerk-Integration mit Supabase-Sync
- Rollenbasierte Zugriffskontrolle
- Middleware für geschützte Routen

✅ **Musik-Katalog**
- Musik-Listing mit Filtern
- Track-Details
- Audio-Vorschau
- Director-Upload mit Admin-Freigabe

✅ **Warenkorb & Checkout**
- Warenkorb-Verwaltung
- Lizenz-Auswahl
- Promo-Codes
- Stripe-Integration

✅ **Auftrags-System**
- Auftrag erstellen
- Angebots-Workflow
- Chat-Kommunikation
- Revisions-System
- Lieferung & Abschluss

✅ **Director-Dashboard**
- Profil-Verwaltung
- Statistiken
- Einnahmen-Übersicht
- Auftrags-Verwaltung

✅ **Admin-Dashboard**
- Plattform-Statistiken
- User-Verwaltung
- Director-Verifizierung
- Musik-Freigabe
- Streitfall-Management

✅ **Weitere Features**
- Downloads-Center
- Rechnungen
- Chat-System
- Responsive Design

---

## 🤝 Support

Bei Fragen oder Problemen:
- GitHub Issues erstellen
- E-Mail: support@musicify.app

