# 🎵 MUSICIFY — Projekt-Identity

> **Das definitive Dokument für alles, was Musicify ist, war und sein wird.**

---

## 📌 Was ist Musicify?

**Musicify** ist eine webbasierte Plattform, die zwei zentrale Dienste vereint:

1. **Musik-Marktplatz** — Kauf lizenzierter, sofort verfügbarer Musikstücke
2. **Custom Music Platform** — Beauftragung individuell produzierter Musik bei verifizierten Komponisten/Regisseuren

Die Plattform verbindet Musikschaffende (Regisseure/Komponisten) mit Kunden (Content Creator, Unternehmen, Filmemacher), die hochwertige Musik für ihre Projekte benötigen.

---

## 🎯 Vision & Mission

### Vision
*Die führende Plattform für professionelle Musik-Lizenzierung und maßgeschneiderte Musikproduktion im deutschsprachigen Raum.*

### Mission
- **Qualität vor Quantität** — Nur verifizierte Regisseure, kuratierte Musik
- **Transparenz** — Klare Preise, faire Lizenzen, offene Kommunikation
- **Sicherheit** — Escrow-Zahlungen, rechtssichere Lizenzen, Streitbeilegung
- **Einfachheit** — Intuitive UX für Käufer und Verkäufer

---

## 👥 Benutzerrollen

### 🛒 Kunde (Customer)
- Durchsucht und kauft lizenzierte Musik
- Erstellt individuelle Musikaufträge
- Kommuniziert mit Regisseuren via Chat
- Erhält Rechnungen und Lizenzzertifikate
- Lädt gekaufte Musik herunter

### 🎹 Regisseur / Komponist (Director)
- Bietet eigene Musik auf dem Marktplatz an
- Erhält und bearbeitet Custom Music Aufträge
- Kommuniziert mit Kunden
- Verwaltet Portfolio und Profil
- Kann Qualitäts-Badges verdienen (VERIFIED, TOP_SELLER, PREMIUM)

### 🛡️ Administrator (Admin)
- Verifiziert neue Regisseure
- Gibt hochgeladene Musik frei
- Moderiert Streitfälle
- Überwacht Plattform-Statistiken
- Verwaltet Nutzer und Inhalte

---

## ⚙️ Kernfunktionen

### 1. Musik-Marktplatz
| Feature | Beschreibung |
|---------|--------------|
| **Filter-System** | Genre, Stimmung, Epoche, Kultur, Verwendungszweck, Struktur |
| **Audio-Player** | Waveform-Visualisierung, Vorschau-Funktion |
| **Lizenzmodelle** | Personal, Commercial, Enterprise, Exclusive |
| **Warenkorb** | Multi-Track-Kauf, Lizenz-Upgrade-Option |

### 2. Custom Music (Auftragsmusik)
| Feature | Beschreibung |
|---------|--------------|
| **Auftrags-Wizard** | Schritt-für-Schritt Anforderungserfassung |
| **Regisseur-Auswahl** | Nach Spezialisierung, Preis, Bewertung |
| **Angebots-System** | Preis + Lieferzeit durch Regisseur |
| **Revisionen** | 2-3 inkludierte Überarbeitungsrunden |
| **Auftrags-Chat** | Echtzeit-Kommunikation mit Datei-Upload |

### 3. Zahlungen & Finanzen
| Feature | Beschreibung |
|---------|--------------|
| **Stripe-Integration** | Kreditkarte, (PayPal geplant) |
| **Escrow-System** | Treuhänderische Verwahrung bei Aufträgen |
| **Teilzahlungen** | 30% Anzahlung / 70% bei Lieferung (optional) |
| **Rechnungen** | Automatische Rechnungserstellung |

### 4. Admin-Funktionen
| Feature | Beschreibung |
|---------|--------------|
| **Regisseur-Verifizierung** | Portfolio-Prüfung, Freigabe |
| **Musik-Freigabe** | Qualitätskontrolle vor Veröffentlichung |
| **Streitfall-Management** | Mediation zwischen Parteien |
| **Dashboard** | KPIs, Statistiken, Überwachung |

---

## 🏗️ Tech Stack

### Frontend & Backend
| Technologie | Version | Zweck |
|-------------|---------|-------|
| **Next.js** | 16.x | React Framework (App Router) |
| **React** | 19.x | UI Library |
| **TypeScript** | 5.x | Type Safety |
| **Tailwind CSS** | 3.4.x | Styling |
| **shadcn/ui** | - | UI-Komponenten (Radix-basiert) |
| **Framer Motion** | 12.x | Animationen |

### Backend & Datenbank
| Technologie | Version | Zweck |
|-------------|---------|-------|
| **PostgreSQL** | - | Relationale Datenbank |
| **Prisma** | 5.22.x | ORM & Migrations |
| **Supabase** | - | Datenbank-Hosting & Realtime |

### Authentifizierung
| Technologie | Version | Zweck |
|-------------|---------|-------|
| **Clerk** | 6.x | Auth, User Management, OAuth |

### Zahlungen
| Technologie | Version | Zweck |
|-------------|---------|-------|
| **Stripe** | 17.x | Payment Processing |

### Sonstige
| Technologie | Zweck |
|-------------|-------|
| **WaveSurfer.js** | Audio-Waveform-Visualisierung |
| **Zod** | Schema-Validierung |
| **React Hook Form** | Formular-Management |
| **date-fns** | Datumsformatierung |
| **Lucide React** | Icons |

---

## 📊 Datenmodell (Übersicht)

```
┌──────────────────┐
│       USER       │ ←── Clerk Auth
│  (CUSTOMER/      │
│   DIRECTOR/      │
│   ADMIN)         │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌─────────────────┐
│Customer│  │ DirectorProfile │
│Profile │  │  - badges       │
│        │  │  - portfolio    │
│        │  │  - metrics      │
└────────┘  └────────┬────────┘
                     │
              ┌──────┴──────┐
              ▼             ▼
         ┌────────┐    ┌────────┐
         │ Music  │    │ Order  │
         │ (Shop) │    │(Custom)│
         └───┬────┘    └───┬────┘
             │             │
             └──────┬──────┘
                    ▼
              ┌──────────┐
              │   Cart   │
              │ Invoice  │
              │ Download │
              └──────────┘
```

### Wichtige Entitäten
- **User** — Basis-Nutzer mit Rolle
- **DirectorProfile** — Erweiterte Regisseur-Daten
- **Music** — Tracks im Marktplatz
- **Order** — Custom Music Aufträge
- **Chat/ChatMessage** — Kommunikation
- **Invoice/InvoiceItem** — Rechnungen
- **Download** — Gekaufte Downloads

---

## 📁 Projektstruktur

```
Musicify/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Login, Register, Clerk
│   ├── (customer)/          # Kunden-Bereich
│   │   ├── marketplace/     # Musik kaufen
│   │   ├── custom-music/    # Aufträge erstellen
│   │   ├── orders/          # Bestellungen
│   │   ├── downloads/       # Downloads
│   │   ├── invoices/        # Rechnungen
│   │   └── settings/        # Einstellungen
│   ├── (director)/          # Regisseur-Bereich
│   │   ├── dashboard/       # Übersicht
│   │   ├── music/           # Eigene Musik
│   │   ├── orders/          # Aufträge
│   │   └── profile/         # Profil
│   ├── (admin)/             # Admin-Bereich
│   │   ├── dashboard/       # KPIs
│   │   ├── users/           # Nutzerverwaltung
│   │   ├── music/           # Musik-Freigaben
│   │   ├── directors/       # Verifizierungen
│   │   └── disputes/        # Streitfälle
│   ├── api/                 # API Routes
│   └── (static pages)       # About, FAQ, etc.
│
├── components/              # React Components
│   ├── ui/                  # shadcn/ui
│   ├── music/               # Audio-Player, Cards
│   ├── chat/                # Chat-Komponenten
│   ├── filters/             # Filter-Panel
│   └── layout/              # Header, Footer
│
├── lib/                     # Utilities
│   ├── auth/                # Clerk Config
│   ├── supabase/            # DB Client
│   └── hooks/               # Custom Hooks
│
├── prisma/                  # DB Schema
├── supabase/migrations/     # SQL Migrations
├── types/                   # TypeScript Types
└── docs/                    # Dokumentation
```

---

## 🔐 Lizenzmodelle

| Lizenz | Nutzung | Zielgruppe |
|--------|---------|------------|
| 🎵 **Personal** | Private, nicht-kommerzielle Nutzung | Hobby-Projekte |
| 🎬 **Commercial** | Kommerzielle Nutzung, begrenzte Reichweite | YouTuber, Social Media |
| 🏢 **Enterprise** | Unbegrenzte kommerzielle Nutzung | TV, Film, große Kampagnen |
| 🔒 **Exclusive** | Exklusivrechte, Track wird entfernt | Volle Eigentumsrechte |

---

## 📈 Auftrags-Workflow (Custom Music)

```
                    ┌─────────────────┐
                    │ 1. PENDING      │ ← Kunde erstellt Auftrag
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ 2. OFFER_PENDING│ ← Regisseur gibt Angebot
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼────────┐     │     ┌────────▼────────┐
     │  OFFER_ACCEPTED │     │     │    CANCELLED    │
     └────────┬────────┘     │     └─────────────────┘
              │              │
     ┌────────▼────────┐     │
     │  3. IN_PROGRESS │ ← Produktion läuft
     └────────┬────────┘
              │
     ┌────────▼────────────────┐
     │ 4. REVISION_REQUESTED   │ ← (optional)
     └────────┬────────────────┘
              │
     ┌────────▼────────────────┐
     │ 5. READY_FOR_PAYMENT    │ ← Musik geliefert
     └────────┬────────────────┘
              │
     ┌────────▼────────┐
     │     6. PAID     │ ← Zahlung erfolgt
     └────────┬────────┘
              │
     ┌────────▼────────┐
     │   7. COMPLETED  │ ← Auftrag abgeschlossen
     └─────────────────┘
```

---

## 🛡️ Sicherheit & Compliance

- **DSGVO-konform** — Datenschutz, Datenexport, Löschrecht
- **Clerk Auth** — OAuth 2.0, Session Management
- **Stripe PCI DSS** — Keine Kartendaten-Speicherung
- **Zod Validation** — Input-Validierung auf allen Ebenen
- **RBAC** — Rollenbasierte Zugriffskontrolle

---

## 📋 API-Übersicht

### Öffentliche Endpoints
| Route | Methode | Beschreibung |
|-------|---------|--------------|
| `/api/music` | GET | Musik-Katalog (mit Filtern) |
| `/api/directors` | GET | Regisseur-Liste |

### Authentifizierte Endpoints
| Route | Methode | Beschreibung |
|-------|---------|--------------|
| `/api/orders` | GET/POST | Aufträge verwalten |
| `/api/cart` | GET/POST/DELETE | Warenkorb |
| `/api/downloads` | GET | Downloads abrufen |
| `/api/invoices` | GET | Rechnungen |
| `/api/chat/[chatId]/messages` | GET/POST | Chat-Nachrichten |

### Admin Endpoints
| Route | Methode | Beschreibung |
|-------|---------|--------------|
| `/api/admin/directors/pending` | GET | Ausstehende Verifizierungen |
| `/api/admin/music/pending` | GET | Ausstehende Musik-Freigaben |
| `/api/admin/stats` | GET | Plattform-Statistiken |

---

## 🚦 Projekt-Status

| Bereich | Status |
|---------|--------|
| ✅ Projekt-Setup | Abgeschlossen |
| ✅ Datenbank-Schema | Abgeschlossen |
| ✅ Authentication (Clerk) | Abgeschlossen |
| ✅ UI-Komponenten | Abgeschlossen |
| ✅ Musik-Marktplatz | Abgeschlossen |
| ✅ Custom Music Aufträge | Abgeschlossen |
| ✅ Chat-System | Abgeschlossen |
| ✅ Admin-Dashboard | Abgeschlossen |
| ✅ Regisseur-Dashboard | Abgeschlossen |
| 🚧 Stripe-Integration | In Arbeit |
| 🚧 E-Mail-Benachrichtigungen | In Arbeit |
| 📋 Performance-Optimierung | Geplant |
| 📋 Mobile Optimierung | Geplant |

---

## 🌐 Umgebungsvariablen

```env
# Database
DATABASE_URL=postgresql://...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
CLERK_WEBHOOK_SECRET=...

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📚 Weiterführende Dokumentation

| Dokument | Beschreibung |
|----------|--------------|
| [PRD.md](./docs/PRD.md) | Product Requirements Document |
| [TECH_STACK.md](./docs/TECH_STACK.md) | Technologie-Details |
| [PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) | Verzeichnisstruktur |

---

## 📄 Lizenz

**Proprietär** — Alle Rechte vorbehalten.

---

## 👤 Kontakt & Team

Entwickelt mit ❤️ für die Musik-Community.

---

*Letzte Aktualisierung: Dezember 2024*

