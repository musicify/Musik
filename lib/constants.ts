// Music Filter Options
export const GENRES = [
  "Electronic",
  "Cinematic",
  "Pop",
  "Rock",
  "Hip-Hop",
  "Classical",
  "Jazz",
  "Ambient",
  "World",
  "R&B",
  "Country",
  "Folk",
  "Metal",
  "Indie",
  "Funk",
  "Soul",
] as const;

export const MOODS = [
  "Energetic",
  "Melancholic",
  "Uplifting",
  "Dramatic",
  "Peaceful",
  "Mysterious",
  "Romantic",
  "Dark",
  "Happy",
  "Sad",
  "Tense",
  "Relaxed",
  "Epic",
  "Playful",
  "Nostalgic",
] as const;

export const USE_CASES = [
  "Werbung",
  "Film/TV",
  "YouTube",
  "Podcast",
  "Gaming",
  "Corporate",
  "Social Media",
  "Dokumentation",
  "Trailer",
  "Wedding",
  "Sport",
  "News",
  "Fashion",
  "Technology",
] as const;

export const ERAS = [
  "Modern",
  "2010s",
  "2000s",
  "90s",
  "80s",
  "70s",
  "60s",
  "Vintage",
  "Retro",
  "Futuristic",
] as const;

export const CULTURES = [
  "Western",
  "Asian",
  "African",
  "Latin",
  "Middle Eastern",
  "European",
  "Nordic",
  "Celtic",
  "Mediterranean",
  "Caribbean",
] as const;

export const STRUCTURES = [
  "Full Track",
  "Loop",
  "Intro/Outro",
  "Build Up",
  "Drop",
  "Ambient Bed",
  "Jingle",
  "Stinger",
] as const;

// License Types with Details
export const LICENSE_TYPES = [
  {
    type: "PERSONAL" as const,
    name: "Personal",
    icon: "🎵",
    description: "Für private Projekte",
    priceMultiplier: 1,
    features: [
      "Private Nutzung",
      "Hobbyprojekte",
      "Keine kommerzielle Verwendung",
      "Unbegrenzte Nutzungsdauer",
    ],
    restrictions: [
      "Keine monetarisierten Plattformen",
      "Kein Weiterverkauf",
      "Keine Werbung",
    ],
  },
  {
    type: "COMMERCIAL" as const,
    name: "Commercial",
    icon: "🎬",
    description: "Für kommerzielle Projekte",
    priceMultiplier: 1.8,
    features: [
      "YouTube, Social Media",
      "Kleine Werbekampagnen",
      "Bis 100K Reichweite",
      "Monetarisierung erlaubt",
    ],
    restrictions: [
      "Reichweite begrenzt",
      "Kein Weiterverkauf",
      "Keine TV-Ausstrahlung",
    ],
  },
  {
    type: "ENTERPRISE" as const,
    name: "Enterprise",
    icon: "🏢",
    description: "Für große Kampagnen",
    priceMultiplier: 4,
    features: [
      "Unbegrenzte Reichweite",
      "TV & Film",
      "Große Werbekampagnen",
      "Weltweite Nutzung",
    ],
    restrictions: ["Kein Weiterverkauf", "Track bleibt im Katalog"],
  },
  {
    type: "EXCLUSIVE" as const,
    name: "Exclusive",
    icon: "🔒",
    description: "Exklusivrechte",
    priceMultiplier: 10,
    features: [
      "Alle Rechte übertragen",
      "Track wird entfernt",
      "Einzigartige Nutzung",
      "Volle Eigentumsrechte",
    ],
    restrictions: [],
  },
] as const;

// Order Status Labels
export const ORDER_STATUS_LABELS = {
  PENDING: { label: "Wartet auf Angebot", color: "yellow" },
  OFFER_PENDING: { label: "Angebot abgegeben", color: "blue" },
  OFFER_ACCEPTED: { label: "Angebot angenommen", color: "green" },
  IN_PROGRESS: { label: "In Bearbeitung", color: "blue" },
  REVISION_REQUESTED: { label: "Revision angefragt", color: "orange" },
  READY_FOR_PAYMENT: { label: "Bereit zur Zahlung", color: "purple" },
  PAID: { label: "Bezahlt", color: "green" },
  COMPLETED: { label: "Abgeschlossen", color: "green" },
  CANCELLED: { label: "Storniert", color: "red" },
  DISPUTED: { label: "Streitfall", color: "red" },
} as const;

// Badge Labels
export const BADGE_LABELS = {
  VERIFIED: { label: "Verifiziert", color: "cyan" },
  TOP_SELLER: { label: "Top Seller", color: "amber" },
  PREMIUM: { label: "Premium", color: "purple" },
} as const;

// Default Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Price Ranges
export const PRICE_RANGES = [
  { min: 0, max: 50, label: "€0 - €50" },
  { min: 50, max: 100, label: "€50 - €100" },
  { min: 100, max: 200, label: "€100 - €200" },
  { min: 200, max: 500, label: "€200 - €500" },
  { min: 500, max: null, label: "€500+" },
] as const;

// Duration Ranges (in seconds)
export const DURATION_RANGES = [
  { min: 0, max: 60, label: "< 1 min" },
  { min: 60, max: 120, label: "1 - 2 min" },
  { min: 120, max: 180, label: "2 - 3 min" },
  { min: 180, max: 300, label: "3 - 5 min" },
  { min: 300, max: null, label: "> 5 min" },
] as const;

// BPM Ranges
export const BPM_RANGES = [
  { min: 60, max: 90, label: "60-90 BPM (Slow)" },
  { min: 90, max: 120, label: "90-120 BPM (Medium)" },
  { min: 120, max: 140, label: "120-140 BPM (Upbeat)" },
  { min: 140, max: 180, label: "140-180 BPM (Fast)" },
] as const;

