// API helper functions for client-side data fetching

const API_BASE = "/api";

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Ein Fehler ist aufgetreten" }));
    throw new Error(error.error || "Ein Fehler ist aufgetreten");
  }

  return res.json();
}

// Music API
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
  style?: string;
  structure?: string;
  tags: string[];
  pricePersonal?: number;
  priceCommercial?: number;
  priceEnterprise?: number;
  priceExclusive?: number;
  playCount: number;
  purchaseCount: number;
  createdAt: string;
  director?: {
    id: string;
    badges: string[];
    user: {
      id: string;
      name: string;
      image?: string;
    };
  };
}

export interface MusicListResponse {
  data: MusicTrack[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

export async function getMusic(filters?: MusicFilters): Promise<MusicListResponse> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });
  }
  const query = params.toString();
  return fetchAPI<MusicListResponse>(`/music${query ? `?${query}` : ""}`);
}

export async function getMusicById(id: string): Promise<MusicTrack> {
  return fetchAPI<MusicTrack>(`/music/${id}`);
}

// Directors API
export interface Director {
  id: string;
  userId: string;
  bio?: string;
  specialization: string[];
  priceRangeMin?: number;
  priceRangeMax?: number;
  badges: string[];
  isVerified: boolean;
  avgResponseTime?: number;
  completionRate?: number;
  totalProjects: number;
  rating?: number;
  reviewCount: number;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  music?: MusicTrack[];
  stats?: {
    completedOrders: number;
    totalTracks: number;
  };
}

export async function getDirectors(): Promise<Director[]> {
  return fetchAPI<Director[]>("/directors");
}

export async function getDirectorById(id: string): Promise<Director> {
  return fetchAPI<Director>(`/directors/${id}`);
}

// Orders API
export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  title: string;
  description: string;
  requirements: string;
  references?: string;
  notes?: string;
  budget?: number;
  offeredPrice?: number;
  productionTime?: number;
  includedRevisions: number;
  usedRevisions: number;
  genre?: string;
  mood?: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    image?: string;
  };
  director?: {
    id: string;
    user: {
      id: string;
      name: string;
      image?: string;
    };
  };
  chat?: {
    id: string;
    messages: ChatMessage[];
  };
}

export interface ChatMessage {
  id: string;
  content: string;
  fileUrl?: string;
  fileType?: string;
  isSystemMessage: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
}

export async function getOrders(): Promise<Order[]> {
  return fetchAPI<Order[]>("/orders");
}

export async function getOrderById(id: string): Promise<Order> {
  return fetchAPI<Order>(`/orders/${id}`);
}

export async function createOrder(data: {
  title: string;
  description: string;
  requirements: string;
  references?: string;
  notes?: string;
  budget?: number;
  genre?: string;
  mood?: string;
  directorIds: string[];
}): Promise<Order[]> {
  return fetchAPI<Order[]>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitOffer(
  orderId: string,
  data: { price: number; productionTime: number; includedRevisions?: number; message?: string }
): Promise<Order> {
  return fetchAPI<Order>(`/orders/${orderId}/offer`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function acceptOffer(orderId: string): Promise<Order> {
  return fetchAPI<Order>(`/orders/${orderId}/accept`, {
    method: "POST",
  });
}

export async function rejectOffer(orderId: string, reason?: string): Promise<Order> {
  return fetchAPI<Order>(`/orders/${orderId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function requestRevision(orderId: string, feedback: string): Promise<Order> {
  return fetchAPI<Order>(`/orders/${orderId}/revision`, {
    method: "POST",
    body: JSON.stringify({ feedback }),
  });
}

export async function cancelOrder(orderId: string, reason: string): Promise<Order> {
  return fetchAPI<Order>(`/orders/${orderId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// Cart API
export interface CartItem {
  id: string;
  musicId?: string;
  orderId?: string;
  licenseType: string;
  music?: MusicTrack;
  order?: Order;
}

export async function getCart(): Promise<CartItem[]> {
  return fetchAPI<CartItem[]>("/cart");
}

export async function addToCart(data: {
  musicId?: string;
  orderId?: string;
  licenseType: string;
}): Promise<CartItem> {
  return fetchAPI<CartItem>("/cart", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function removeFromCart(itemId: string): Promise<void> {
  return fetchAPI<void>(`/cart/${itemId}`, {
    method: "DELETE",
  });
}

// Chat API
export async function getChatMessages(chatId: string): Promise<ChatMessage[]> {
  return fetchAPI<ChatMessage[]>(`/chat/${chatId}/messages`);
}

export async function sendMessage(
  chatId: string,
  data: { content: string; fileUrl?: string; fileType?: string }
): Promise<ChatMessage> {
  return fetchAPI<ChatMessage>(`/chat/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

