# Supabase Setup für Musicify

## Übersicht

Diese Migrationen erstellen die komplette Datenbankstruktur für Musicify mit:
- Benutzer & Profile (Customer, Director, Admin)
- Musik-Katalog mit Lizenzierung
- Auftrags-System für Custom Music
- Chat-System mit Realtime
- Warenkorb & Rechnungen
- Downloads
- Support Tickets

## Migrations

Die Migrationen sind nummeriert und müssen in der richtigen Reihenfolge ausgeführt werden:

1. `001_enums.sql` - Alle Enums (UserRole, LicenseType, OrderStatus, etc.)
2. `002_users.sql` - User-Tabelle mit Clerk Integration
3. `003_profiles.sql` - Customer & Director Profile
4. `004_music.sql` - Musik-Katalog & Approvals
5. `005_orders.sql` - Orders, Order History, Order Items
6. `006_chat.sql` - Chat System mit Realtime
7. `007_cart.sql` - Warenkorb
8. `008_invoices.sql` - Rechnungen & Invoice Items
9. `009_downloads.sql` - Download-Verwaltung
10. `010_support.sql` - Support Tickets
11. `011_views_functions.sql` - Views & Helper Functions
12. `012_seed.sql` - Beispieldaten (nur für Entwicklung!)

## Setup

### 1. Supabase Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com)
2. Erstelle ein neues Projekt
3. Kopiere die Project URL und den Anon Key

### 2. Environment Variables

Erstelle eine `.env.local` Datei:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx
```

### 3. Migrationen ausführen

**Option A: Über Supabase Dashboard**
1. Gehe zu SQL Editor im Supabase Dashboard
2. Führe jede Migration der Reihe nach aus

**Option B: Über Supabase CLI**
```bash
# Supabase CLI installieren
npm install -g supabase

# Login
supabase login

# Projekt verknüpfen
supabase link --project-ref your-project-ref

# Migrationen ausführen
supabase db push
```

### 4. Clerk Webhook einrichten

1. Gehe zu Clerk Dashboard → Webhooks
2. Erstelle einen neuen Webhook mit der URL: `https://your-domain.com/api/webhooks/clerk`
3. Aktiviere folgende Events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Kopiere das Webhook Secret in `.env.local`

## Row Level Security (RLS)

Alle Tabellen haben RLS aktiviert mit folgenden Policies:

- **Users**: Können nur ihr eigenes Profil sehen/bearbeiten
- **Directors**: Profile sind öffentlich lesbar, nur eigenes bearbeitbar
- **Music**: Aktive Musik ist öffentlich, Directors können eigene verwalten
- **Orders**: Customers sehen eigene, Directors sehen zugewiesene
- **Chat**: Nur Teilnehmer können sehen/schreiben
- **Cart**: Nur eigener Warenkorb sichtbar
- **Invoices**: Nur eigene Rechnungen sichtbar
- **Admin**: Hat Zugriff auf alles

## Realtime

Chat-Nachrichten sind für Realtime aktiviert. Subscription:

```typescript
const channel = supabase
  .channel('chat-messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `chat_id=eq.${chatId}`
    },
    (payload) => {
      console.log('Neue Nachricht:', payload.new)
    }
  )
  .subscribe()
```

## Wichtige Functions

| Function | Beschreibung |
|----------|--------------|
| `upsert_user_from_clerk()` | Erstellt/Updated User aus Clerk Webhook |
| `create_customer_profile()` | Erstellt Customer Profile |
| `create_director_profile()` | Erstellt Director Profile + Verification |
| `get_cart_total()` | Berechnet Warenkorb-Total |
| `search_music()` | Volltext-Suche mit Filtern |
| `get_admin_stats()` | Admin Dashboard Statistiken |

## Storage Buckets

Erstelle folgende Storage Buckets im Supabase Dashboard:

1. **audio** - Für Musik-Dateien (privat)
2. **previews** - Für Audio-Vorschauen (öffentlich)
3. **covers** - Für Cover-Bilder (öffentlich)
4. **chat-files** - Für Chat-Uploads (authentifiziert)
5. **avatars** - Für Profilbilder (öffentlich)

## Entwicklung

Seed-Daten (`012_seed.sql`) erstellt Test-User:
- Admin: `admin@musicify.de` (clerk_id: `clerk_admin_test_123`)
- Customer: `customer@example.com` (clerk_id: `clerk_customer_test_123`)
- Director: `director@example.com` (clerk_id: `clerk_director_test_123`)

**Wichtig**: Seed-Daten nur in Entwicklung verwenden!

