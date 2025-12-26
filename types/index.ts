// User Types
export type UserRole = "CUSTOMER" | "DIRECTOR" | "ADMIN";

export type DirectorBadge = "VERIFIED" | "TOP_SELLER" | "PREMIUM";

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DirectorProfile {
  id: string;
  userId: string;
  bio: string | null;
  specialization: string[];
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  badges: DirectorBadge[];
  isVerified: boolean;
  isActive: boolean;
  portfolioTracks: string[];
  website: string | null;
  socialLinks: string[];
  experience: string | null;
  equipment: string | null;
  languages: string[];
  avgResponseTime: number | null;
  completionRate: number | null;
  avgDeliveryTime: number | null;
  revisionRate: number | null;
  totalProjects: number;
  totalEarnings: number;
  rating: number | null;
  reviewCount: number;
  user?: User;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  user?: User;
}

// Music Types
export type LicenseType = "PERSONAL" | "COMMERCIAL" | "ENTERPRISE" | "EXCLUSIVE";

export type MusicStatus = "ACTIVE" | "INACTIVE" | "EXCLUSIVE_SOLD";

export interface Music {
  id: string;
  title: string;
  description: string;
  duration: number;
  bpm: number | null;
  key: string | null;
  price: number;
  audioUrl: string;
  previewUrl: string | null;
  waveformData: string | null;
  coverImage: string | null;
  licenseType: LicenseType;
  status: MusicStatus;
  pricePersonal: number | null;
  priceCommercial: number | null;
  priceEnterprise: number | null;
  priceExclusive: number | null;
  genre: string;
  subgenre: string | null;
  style: string | null;
  era: string | null;
  culture: string | null;
  mood: string | null;
  useCase: string | null;
  structure: string | null;
  tags: string[];
  directorId: string | null;
  director?: DirectorProfile;
  playCount: number;
  purchaseCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export type OrderStatus =
  | "PENDING"
  | "OFFER_PENDING"
  | "OFFER_ACCEPTED"
  | "IN_PROGRESS"
  | "REVISION_REQUESTED"
  | "READY_FOR_PAYMENT"
  | "PAID"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export type PaymentModel = "PAY_ON_COMPLETION" | "PARTIAL_PAYMENT";

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  directorId: string | null;
  status: OrderStatus;
  title: string;
  description: string;
  requirements: string;
  references: string | null;
  notes: string | null;
  budget: number | null;
  genre: string | null;
  subgenre: string | null;
  style: string | null;
  era: string | null;
  culture: string | null;
  mood: string | null;
  useCase: string | null;
  structure: string | null;
  offeredPrice: number | null;
  productionTime: number | null;
  offerAcceptedAt: Date | null;
  paymentModel: PaymentModel;
  includedRevisions: number;
  usedRevisions: number;
  maxRevisions: number;
  finalMusicUrl: string | null;
  finalMusicId: string | null;
  createdAt: Date;
  updatedAt: Date;
  customer?: User;
  director?: DirectorProfile;
  chat?: Chat;
}

// Chat Types
export interface Chat {
  id: string;
  orderId: string;
  messages?: ChatMessage[];
  participants?: ChatParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  fileUrl: string | null;
  fileType: string | null;
  isSystemMessage: boolean;
  createdAt: Date;
  sender?: User;
}

export interface ChatParticipant {
  id: string;
  chatId: string;
  userId: string;
  joinedAt: Date;
  user?: User;
}

// Cart Types
export interface CartItem {
  id: string;
  userId: string;
  musicId: string | null;
  orderId: string | null;
  licenseType: LicenseType;
  music?: Music;
  order?: Order;
  createdAt: Date;
}

// Invoice Types
export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED";

export type PaymentMethod = "CREDIT_CARD" | "PAYPAL";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  orderId: string | null;
  amount: number;
  tax: number;
  total: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  stripePaymentId: string | null;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  musicId: string | null;
  orderId: string | null;
  description: string;
  quantity: number;
  price: number;
  total: number;
  licenseType: LicenseType;
}

// Filter Types
export interface MusicFilters {
  genre?: string[];
  subgenre?: string[];
  style?: string[];
  era?: string[];
  culture?: string[];
  mood?: string[];
  useCase?: string[];
  structure?: string[];
  priceMin?: number;
  priceMax?: number;
  durationMin?: number;
  durationMax?: number;
  bpmMin?: number;
  bpmMax?: number;
  licenseType?: LicenseType[];
  search?: string;
  sortBy?: "newest" | "oldest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  limit?: number;
}

// License Price Info
export interface LicensePricing {
  type: LicenseType;
  name: string;
  icon: string;
  price: number;
  description: string;
  features: string[];
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, string>;
}

