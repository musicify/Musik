# Projektstruktur

```
Musicify/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth Routes (Login, Register)
│   ├── (customer)/              # Customer Routes
│   │   ├── marketplace/         # Musik kaufen
│   │   ├── custom-music/         # Musik auf Bestellung
│   │   ├── orders/              # Bestellungen
│   │   ├── chats/               # Chats
│   │   └── downloads/           # Downloads
│   ├── (director)/              # Director Routes
│   │   ├── dashboard/           # Dashboard
│   │   ├── orders/             # Aufträge
│   │   ├── chats/               # Chats
│   │   └── profile/             # Profil
│   ├── (admin)/                 # Admin Routes
│   │   ├── dashboard/           # Admin Dashboard
│   │   ├── users/               # Nutzerverwaltung
│   │   ├── music/               # Musikverwaltung
│   │   └── directors/           # Regisseur-Verwaltung
│   ├── api/                     # API Routes
│   │   ├── auth/                # Authentication
│   │   ├── music/               # Musik-Endpoints
│   │   ├── orders/              # Bestellungen
│   │   ├── chats/               # Chat-Endpoints
│   │   ├── payments/            # Zahlungen
│   │   └── upload/              # File Uploads
│   ├── layout.tsx               # Root Layout
│   └── page.tsx                 # Homepage
│
├── components/                  # React Components
│   ├── ui/                     # shadcn/ui Components
│   ├── music/                  # Musik-Komponenten
│   ├── chat/                   # Chat-Komponenten
│   ├── filters/                # Filter-Komponenten
│   └── layout/                 # Layout-Komponenten
│
├── lib/                        # Utilities & Helpers
│   ├── db.ts                   # Prisma Client
│   ├── auth.ts                 # NextAuth Config
│   ├── stripe.ts               # Stripe Config
│   └── utils.ts                # Helper Functions
│
├── prisma/                     # Prisma Schema
│   ├── schema.prisma           # Database Schema
│   └── migrations/             # Database Migrations
│
├── public/                     # Static Files
│   ├── audio/                  # Audio Previews
│   └── images/                 # Images
│
├── types/                      # TypeScript Types
│   ├── user.ts
│   ├── music.ts
│   ├── order.ts
│   └── chat.ts
│
├── hooks/                      # Custom React Hooks
│
├── styles/                     # Global Styles
│   └── globals.css
│
├── docs/                       # Dokumentation
│   ├── PRD.md
│   ├── TECH_STACK.md
│   └── PROJECT_STRUCTURE.md
│
├── .env.local                  # Environment Variables
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

