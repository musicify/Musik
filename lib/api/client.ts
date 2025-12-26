/**
 * API-Client für Frontend-Anfragen
 * Zentrale Stelle für alle API-Calls mit Error-Handling
 */

const API_BASE = "/api";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Ein Fehler ist aufgetreten" };
    }

    return { data };
  } catch (error) {
    console.error("API Error:", error);
    return { error: "Verbindungsfehler. Bitte versuche es erneut." };
  }
}

// ============================================
// MUSIK API
// ============================================

export interface MusicTrack {
  id: string;
  title: string;
  description: string;
  duration: number;
  bpm?: number;
  key?: string;
  price: number;
  audioUrl: string;
  previewUrl?: string;
  coverImage?: string;
  genre: string;
  subgenre?: string;
  mood?: string;
  useCase?: string;
  era?: string;
  structure?: string;
  tags: string[];
  pricePersonal?: number;
  priceCommercial?: number;
  priceEnterprise?: number;
  priceExclusive?: number;
  playCount: number;
  purchaseCount: number;
  status: string;
  createdAt: string;
  director?: {
    id: string;
    badges: string[];
    user: {
      name: string;
      image?: string;
    };
  };
}

export interface MusicFilters {
  genre?: string;
  mood?: string;
  useCase?: string;
  era?: string;
  priceMin?: number;
  priceMax?: number;
  durationMin?: number;
  durationMax?: number;
  search?: string;
  sortBy?: "newest" | "oldest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  limit?: number;
}

export interface MusicListResponse {
  data: MusicTrack[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const musicApi = {
  list: async (filters?: MusicFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    return fetchApi<MusicListResponse>(`/music?${params.toString()}`);
  },

  get: async (id: string) => {
    return fetchApi<MusicTrack>(`/music/${id}`);
  },

  create: async (data: Partial<MusicTrack>) => {
    return fetchApi<MusicTrack>("/music", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<MusicTrack>) => {
    return fetchApi<MusicTrack>(`/music/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchApi<void>(`/music/${id}`, {
      method: "DELETE",
    });
  },

  incrementPlayCount: async (id: string) => {
    return fetchApi<void>(`/music/${id}/play`, {
      method: "POST",
    });
  },
};

// ============================================
// WARENKORB API
// ============================================

export type LicenseType = "PERSONAL" | "COMMERCIAL" | "ENTERPRISE" | "EXCLUSIVE";

export interface CartItem {
  id: string;
  musicId?: string;
  orderId?: string;
  licenseType: LicenseType;
  calculatedPrice: number;
  music?: MusicTrack;
  order?: Order;
  createdAt: string;
}

export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export const cartApi = {
  get: async () => {
    return fetchApi<CartResponse>("/cart");
  },

  add: async (data: { musicId?: string; orderId?: string; licenseType: LicenseType }) => {
    return fetchApi<CartItem>("/cart", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateLicense: async (itemId: string, licenseType: LicenseType) => {
    return fetchApi<CartItem>(`/cart/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ licenseType }),
    });
  },

  remove: async (itemId: string) => {
    return fetchApi<void>(`/cart/${itemId}`, {
      method: "DELETE",
    });
  },

  clear: async () => {
    return fetchApi<void>("/cart", {
      method: "DELETE",
    });
  },
};

// ============================================
// BESTELLUNGEN API
// ============================================

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

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  directorId?: string;
  status: OrderStatus;
  title: string;
  description: string;
  requirements: string;
  references?: string;
  notes?: string;
  budget?: number;
  genre?: string;
  subgenre?: string;
  style?: string;
  era?: string;
  culture?: string;
  mood?: string;
  useCase?: string;
  structure?: string;
  offeredPrice?: number;
  productionTime?: number;
  offerAcceptedAt?: string;
  includedRevisions: number;
  usedRevisions: number;
  finalMusicUrl?: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  director?: {
    id: string;
    badges: string[];
    user: {
      name: string;
      image?: string;
    };
  };
  chat?: {
    id: string;
    messages: ChatMessage[];
  };
}

export interface CreateOrderData {
  title: string;
  description: string;
  requirements: string;
  references?: string;
  notes?: string;
  budget?: number;
  genre?: string;
  subgenre?: string;
  style?: string;
  era?: string;
  culture?: string;
  mood?: string;
  useCase?: string;
  structure?: string;
  directorIds: string[];
  paymentModel?: "PAY_ON_COMPLETION" | "PARTIAL_PAYMENT";
}

export interface OfferData {
  price: number;
  productionTime: number;
  message?: string;
}

export const ordersApi = {
  list: async (role?: "customer" | "director") => {
    const params = role ? `?role=${role}` : "";
    return fetchApi<Order[]>(`/orders${params}`);
  },

  get: async (id: string) => {
    return fetchApi<Order>(`/orders/${id}`);
  },

  create: async (data: CreateOrderData) => {
    return fetchApi<Order[]>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Order>) => {
    return fetchApi<Order>(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  makeOffer: async (id: string, data: OfferData) => {
    return fetchApi<Order>(`/orders/${id}/offer`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  acceptOffer: async (id: string) => {
    return fetchApi<Order>(`/orders/${id}/accept`, {
      method: "POST",
    });
  },

  rejectOffer: async (id: string, reason?: string) => {
    return fetchApi<Order>(`/orders/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  deliver: async (id: string, data: { musicUrl: string; message?: string }) => {
    return fetchApi<Order>(`/orders/${id}/deliver`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  requestRevision: async (id: string, data: { feedback: string }) => {
    return fetchApi<Order>(`/orders/${id}/revision`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  complete: async (id: string) => {
    return fetchApi<Order>(`/orders/${id}/complete`, {
      method: "POST",
    });
  },

  cancel: async (id: string, reason?: string) => {
    return fetchApi<Order>(`/orders/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },
};

// ============================================
// CHAT API
// ============================================

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  fileUrl?: string;
  fileType?: string;
  isSystemMessage: boolean;
  createdAt: string;
  sender?: {
    name: string;
    image?: string;
  };
}

export interface Chat {
  id: string;
  orderId: string;
  messages: ChatMessage[];
  participants: {
    userId: string;
    user: {
      name: string;
      image?: string;
    };
  }[];
  createdAt: string;
}

export const chatApi = {
  getForOrder: async (orderId: string) => {
    return fetchApi<Chat>(`/chat/${orderId}`);
  },

  getMessages: async (chatId: string, page = 1, limit = 50) => {
    return fetchApi<{ messages: ChatMessage[]; hasMore: boolean }>(
      `/chat/${chatId}/messages?page=${page}&limit=${limit}`
    );
  },

  sendMessage: async (chatId: string, data: { content: string; fileUrl?: string; fileType?: string }) => {
    return fetchApi<ChatMessage>(`/chat/${chatId}/messages`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// DIRECTORS API
// ============================================

export interface DirectorProfile {
  id: string;
  userId: string;
  bio?: string;
  specialization: string[];
  priceRangeMin?: number;
  priceRangeMax?: number;
  badges: string[];
  isVerified: boolean;
  portfolioTracks: string[];
  website?: string;
  socialLinks: string[];
  experience?: string;
  equipment?: string;
  languages: string[];
  avgResponseTime?: number;
  completionRate?: number;
  avgDeliveryTime?: number;
  totalProjects: number;
  totalEarnings: number;
  rating?: number;
  reviewCount: number;
  user: {
    id: string;
    name: string;
    image?: string;
    email: string;
  };
}

export const directorsApi = {
  list: async (filters?: { specialization?: string; verified?: boolean }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }
    return fetchApi<DirectorProfile[]>(`/directors?${params.toString()}`);
  },

  get: async (id: string) => {
    return fetchApi<DirectorProfile>(`/directors/${id}`);
  },

  getProfile: async () => {
    return fetchApi<DirectorProfile>("/directors/profile");
  },

  updateProfile: async (data: Partial<DirectorProfile>) => {
    return fetchApi<DirectorProfile>("/directors/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  getStats: async () => {
    return fetchApi<{
      totalEarnings: number;
      monthlyEarnings: number;
      totalOrders: number;
      activeOrders: number;
      completedOrders: number;
      avgRating: number;
      totalTracks: number;
      trackSales: number;
    }>("/directors/stats");
  },
};

// ============================================
// PAYMENTS API
// ============================================

export interface CheckoutSession {
  id: string;
  url: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  tax: number;
  total: number;
  status: string;
  paidAt?: string;
  createdAt: string;
  items: {
    id: string;
    description: string;
    price: number;
    licenseType: string;
  }[];
}

export const paymentsApi = {
  createCheckoutSession: async (data: { cartItemIds?: string[]; orderId?: string; promoCode?: string }) => {
    return fetchApi<CheckoutSession>("/payments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getInvoices: async () => {
    return fetchApi<Invoice[]>("/invoices");
  },

  getInvoice: async (id: string) => {
    return fetchApi<Invoice>(`/invoices/${id}`);
  },

  downloadInvoice: async (id: string) => {
    // Returns PDF blob
    const response = await fetch(`${API_BASE}/invoices/${id}/download`);
    if (!response.ok) {
      return { error: "Download fehlgeschlagen" };
    }
    const blob = await response.blob();
    return { data: blob };
  },
};

// ============================================
// DOWNLOADS API
// ============================================

export interface Download {
  id: string;
  musicId?: string;
  orderId?: string;
  licenseType: string;
  downloadUrl: string;
  downloadCount: number;
  createdAt: string;
  music?: MusicTrack;
  order?: Order;
}

export const downloadsApi = {
  list: async () => {
    return fetchApi<Download[]>("/downloads");
  },

  get: async (id: string) => {
    return fetchApi<Download>(`/downloads/${id}`);
  },

  download: async (id: string, format: "wav" | "mp3") => {
    return fetchApi<{ url: string }>(`/downloads/${id}?format=${format}`);
  },
};

// ============================================
// ADMIN API
// ============================================

export const adminApi = {
  // Stats
  getStats: async () => {
    return fetchApi<{
      totalUsers: number;
      totalDirectors: number;
      totalOrders: number;
      totalRevenue: number;
      pendingVerifications: number;
      pendingMusicApprovals: number;
      openDisputes: number;
    }>("/admin/stats");
  },

  // Users
  getUsers: async (filters?: { role?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return fetchApi<any[]>(`/admin/users?${params.toString()}`);
  },

  updateUser: async (id: string, data: { role?: string; isActive?: boolean }) => {
    return fetchApi<any>(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Directors
  getPendingDirectors: async () => {
    return fetchApi<DirectorProfile[]>("/admin/directors/pending");
  },

  verifyDirector: async (id: string, data: { approved: boolean; note?: string }) => {
    return fetchApi<DirectorProfile>(`/admin/directors/${id}/verify`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Music
  getPendingMusic: async () => {
    return fetchApi<MusicTrack[]>("/admin/music/pending");
  },

  approveMusic: async (id: string, data: { approved: boolean; note?: string }) => {
    return fetchApi<MusicTrack>(`/admin/music/${id}/approve`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Disputes
  getDisputes: async () => {
    return fetchApi<any[]>("/admin/disputes");
  },

  resolveDispute: async (id: string, data: { resolution: string; refundAmount?: number }) => {
    return fetchApi<any>(`/admin/disputes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// UPLOAD API
// ============================================

export const uploadApi = {
  getPresignedUrl: async (data: { filename: string; contentType: string; type: "audio" | "image" | "document" }) => {
    return fetchApi<{ uploadUrl: string; publicUrl: string }>("/upload", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  uploadFile: async (url: string, file: File) => {
    const response = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
    return response.ok;
  },
};

