# Musicify - Musik-Marktplatz & Custom Music Platform

Eine webbasierte Plattform zum Kauf lizenzierter Musik sowie zur Beauftragung individuell produzierter Musik bei ausgewählten Regisseuren/Komponisten.

## 🚀 Tech Stack

- **Next.js 14+** (App Router) - React Framework
- **TypeScript** - Type Safety
- **Prisma** - ORM für PostgreSQL
- **NextAuth.js v5** - Authentication
- **Tailwind CSS** - Styling
- **Stripe** - Payment Processing

## 📋 Voraussetzungen

- Node.js 20+ 
- PostgreSQL Datenbank
- npm oder yarn

## 🛠️ Installation

1. **Dependencies installieren:**
```bash
npm install
```

2. **Environment Variables einrichten:**
Kopiere `.env.example` zu `.env.local` und fülle die Werte aus:
```bash
cp .env.example .env.local
```

3. **Datenbank Setup:**
```bash
# Prisma Client generieren
npm run db:generate

# Datenbank migrieren
npm run db:migrate
```

4. **Development Server starten:**
```bash
npm run dev
```

Die App läuft dann auf [http://localhost:3000](http://localhost:3000)

## 📁 Projektstruktur

```
Musicify/
├── app/              # Next.js App Router (Routes & Pages)
├── components/       # React Components
├── lib/             # Utilities & Configs
├── prisma/          # Database Schema
├── types/           # TypeScript Types
└── docs/            # Dokumentation
```

## 📚 Dokumentation

- [PRD](./docs/PRD.md) - Product Requirements Document
- [Tech Stack](./docs/TECH_STACK.md) - Technologie-Übersicht
- [Projektstruktur](./docs/PROJECT_STRUCTURE.md) - Detaillierte Struktur

## 🎯 Features

### Für Kunden:
- ✅ Musik durchsuchen und kaufen
- ✅ Individuelle Musikaufträge erstellen
- ✅ Chat mit Regisseuren
- ✅ Warenkorb & Zahlung
- ✅ Downloads & Rechnungen

### Für Regisseure:
- ✅ Auftragsverwaltung
- ✅ Chat mit Kunden
- ✅ Portfolio-Verwaltung
- ✅ Performance-Metriken

### Für Admins:
- ✅ Nutzerverwaltung
- ✅ Musikverwaltung
- ✅ Regisseur-Verifizierung
- ✅ System-Überwachung

## 🔐 Umgebungsvariablen

Siehe `.env.example` für alle benötigten Variablen:
- `DATABASE_URL` - PostgreSQL Connection String
- `NEXTAUTH_SECRET` - Secret für NextAuth
- `STRIPE_SECRET_KEY` - Stripe API Key
- `AWS_*` - AWS S3 für File Storage
- `RESEND_API_KEY` - Für E-Mail Versand

## 📝 Scripts

- `npm run dev` - Development Server
- `npm run build` - Production Build
- `npm run start` - Production Server
- `npm run db:generate` - Prisma Client generieren
- `npm run db:migrate` - Datenbank migrieren
- `npm run db:studio` - Prisma Studio öffnen

## 🚧 Status

Projekt ist in der Entwicklung. Aktueller Stand:
- ✅ Projekt-Setup
- ✅ Datenbank-Schema
- 🚧 Authentication (in Arbeit)
- 🚧 Frontend Components (in Arbeit)

## 📄 Lizenz

Proprietär - Alle Rechte vorbehalten

