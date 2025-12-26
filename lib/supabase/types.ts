// Supabase Database Types
// Generiert aus dem Prisma Schema / SQL Migrationen

export type UserRole = "CUSTOMER" | "DIRECTOR" | "ADMIN";
export type DirectorBadge = "VERIFIED" | "TOP_SELLER" | "PREMIUM";
export type LicenseType = "PERSONAL" | "COMMERCIAL" | "ENTERPRISE" | "EXCLUSIVE";
export type MusicStatus = "ACTIVE" | "INACTIVE" | "EXCLUSIVE_SOLD";
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
export type PaymentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type PaymentMethod = "CREDIT_CARD" | "PAYPAL";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketType = "GENERAL" | "DISPUTE" | "REFUND" | "TECHNICAL" | "OTHER";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          name: string | null;
          image: string | null;
          role: UserRole;
          email_verified: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          email: string;
          name?: string | null;
          image?: string | null;
          role?: UserRole;
          email_verified?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_id?: string;
          email?: string;
          name?: string | null;
          image?: string | null;
          role?: UserRole;
          email_verified?: string | null;
          updated_at?: string;
        };
      };
      customer_profiles: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          updated_at?: string;
        };
      };
      director_profiles: {
        Row: {
          id: string;
          user_id: string;
          bio: string | null;
          specialization: string[];
          price_range_min: number | null;
          price_range_max: number | null;
          badges: DirectorBadge[];
          is_verified: boolean;
          is_active: boolean;
          portfolio_tracks: string[];
          website: string | null;
          social_links: string[];
          experience: string | null;
          equipment: string | null;
          languages: string[];
          avg_response_time: number | null;
          completion_rate: number | null;
          avg_delivery_time: number | null;
          revision_rate: number | null;
          total_projects: number;
          total_earnings: number;
          rating: number | null;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bio?: string | null;
          specialization?: string[];
          price_range_min?: number | null;
          price_range_max?: number | null;
          badges?: DirectorBadge[];
          is_verified?: boolean;
          is_active?: boolean;
          portfolio_tracks?: string[];
          website?: string | null;
          social_links?: string[];
          experience?: string | null;
          equipment?: string | null;
          languages?: string[];
          avg_response_time?: number | null;
          completion_rate?: number | null;
          avg_delivery_time?: number | null;
          revision_rate?: number | null;
          total_projects?: number;
          total_earnings?: number;
          rating?: number | null;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          bio?: string | null;
          specialization?: string[];
          price_range_min?: number | null;
          price_range_max?: number | null;
          badges?: DirectorBadge[];
          is_verified?: boolean;
          is_active?: boolean;
          portfolio_tracks?: string[];
          website?: string | null;
          social_links?: string[];
          experience?: string | null;
          equipment?: string | null;
          languages?: string[];
          avg_response_time?: number | null;
          completion_rate?: number | null;
          avg_delivery_time?: number | null;
          revision_rate?: number | null;
          total_projects?: number;
          total_earnings?: number;
          rating?: number | null;
          review_count?: number;
          updated_at?: string;
        };
      };
      music: {
        Row: {
          id: string;
          title: string;
          description: string;
          duration: number;
          bpm: number | null;
          key: string | null;
          price: number;
          audio_url: string;
          preview_url: string | null;
          waveform_data: string | null;
          cover_image: string | null;
          license_type: LicenseType;
          status: MusicStatus;
          price_personal: number | null;
          price_commercial: number | null;
          price_enterprise: number | null;
          price_exclusive: number | null;
          genre: string;
          subgenre: string | null;
          style: string | null;
          era: string | null;
          culture: string | null;
          mood: string | null;
          use_case: string | null;
          structure: string | null;
          tags: string[];
          director_id: string | null;
          play_count: number;
          purchase_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          duration: number;
          bpm?: number | null;
          key?: string | null;
          price: number;
          audio_url: string;
          preview_url?: string | null;
          waveform_data?: string | null;
          cover_image?: string | null;
          license_type?: LicenseType;
          status?: MusicStatus;
          price_personal?: number | null;
          price_commercial?: number | null;
          price_enterprise?: number | null;
          price_exclusive?: number | null;
          genre: string;
          subgenre?: string | null;
          style?: string | null;
          era?: string | null;
          culture?: string | null;
          mood?: string | null;
          use_case?: string | null;
          structure?: string | null;
          tags?: string[];
          director_id?: string | null;
          play_count?: number;
          purchase_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          duration?: number;
          bpm?: number | null;
          key?: string | null;
          price?: number;
          audio_url?: string;
          preview_url?: string | null;
          waveform_data?: string | null;
          cover_image?: string | null;
          license_type?: LicenseType;
          status?: MusicStatus;
          price_personal?: number | null;
          price_commercial?: number | null;
          price_enterprise?: number | null;
          price_exclusive?: number | null;
          genre?: string;
          subgenre?: string | null;
          style?: string | null;
          era?: string | null;
          culture?: string | null;
          mood?: string | null;
          use_case?: string | null;
          structure?: string | null;
          tags?: string[];
          director_id?: string | null;
          play_count?: number;
          purchase_count?: number;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string;
          director_id: string | null;
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
          use_case: string | null;
          structure: string | null;
          offered_price: number | null;
          production_time: number | null;
          offer_accepted_at: string | null;
          payment_model: PaymentModel;
          included_revisions: number;
          used_revisions: number;
          max_revisions: number;
          final_music_url: string | null;
          final_music_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          customer_id: string;
          director_id?: string | null;
          status?: OrderStatus;
          title: string;
          description: string;
          requirements: string;
          references?: string | null;
          notes?: string | null;
          budget?: number | null;
          genre?: string | null;
          subgenre?: string | null;
          style?: string | null;
          era?: string | null;
          culture?: string | null;
          mood?: string | null;
          use_case?: string | null;
          structure?: string | null;
          offered_price?: number | null;
          production_time?: number | null;
          offer_accepted_at?: string | null;
          payment_model?: PaymentModel;
          included_revisions?: number;
          used_revisions?: number;
          max_revisions?: number;
          final_music_url?: string | null;
          final_music_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          order_number?: string;
          customer_id?: string;
          director_id?: string | null;
          status?: OrderStatus;
          title?: string;
          description?: string;
          requirements?: string;
          references?: string | null;
          notes?: string | null;
          budget?: number | null;
          genre?: string | null;
          subgenre?: string | null;
          style?: string | null;
          era?: string | null;
          culture?: string | null;
          mood?: string | null;
          use_case?: string | null;
          structure?: string | null;
          offered_price?: number | null;
          production_time?: number | null;
          offer_accepted_at?: string | null;
          payment_model?: PaymentModel;
          included_revisions?: number;
          used_revisions?: number;
          max_revisions?: number;
          final_music_url?: string | null;
          final_music_id?: string | null;
          updated_at?: string;
        };
      };
      chats: {
        Row: {
          id: string;
          order_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          order_id?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          chat_id: string;
          sender_id: string;
          content: string;
          file_url: string | null;
          file_type: string | null;
          is_system_message: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          sender_id: string;
          content: string;
          file_url?: string | null;
          file_type?: string | null;
          is_system_message?: boolean;
          created_at?: string;
        };
        Update: {
          chat_id?: string;
          sender_id?: string;
          content?: string;
          file_url?: string | null;
          file_type?: string | null;
          is_system_message?: boolean;
        };
      };
      chat_participants: {
        Row: {
          id: string;
          chat_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          chat_id?: string;
          user_id?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          music_id: string | null;
          order_id: string | null;
          license_type: LicenseType;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          music_id?: string | null;
          order_id?: string | null;
          license_type?: LicenseType;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          music_id?: string | null;
          order_id?: string | null;
          license_type?: LicenseType;
        };
      };
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          user_id: string;
          order_id: string | null;
          amount: number;
          tax: number;
          total: number;
          status: PaymentStatus;
          payment_method: PaymentMethod | null;
          stripe_payment_id: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_number?: string;
          user_id: string;
          order_id?: string | null;
          amount: number;
          tax?: number;
          total: number;
          status?: PaymentStatus;
          payment_method?: PaymentMethod | null;
          stripe_payment_id?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          invoice_number?: string;
          user_id?: string;
          order_id?: string | null;
          amount?: number;
          tax?: number;
          total?: number;
          status?: PaymentStatus;
          payment_method?: PaymentMethod | null;
          stripe_payment_id?: string | null;
          paid_at?: string | null;
          updated_at?: string;
        };
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          music_id: string | null;
          order_id: string | null;
          description: string;
          quantity: number;
          price: number;
          total: number;
          license_type: LicenseType;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          music_id?: string | null;
          order_id?: string | null;
          description: string;
          quantity?: number;
          price: number;
          total: number;
          license_type: LicenseType;
        };
        Update: {
          invoice_id?: string;
          music_id?: string | null;
          order_id?: string | null;
          description?: string;
          quantity?: number;
          price?: number;
          total?: number;
          license_type?: LicenseType;
        };
      };
      downloads: {
        Row: {
          id: string;
          user_id: string;
          music_id: string | null;
          order_id: string | null;
          license_type: LicenseType;
          download_url: string;
          expires_at: string | null;
          download_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          music_id?: string | null;
          order_id?: string | null;
          license_type: LicenseType;
          download_url: string;
          expires_at?: string | null;
          download_count?: number;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          music_id?: string | null;
          order_id?: string | null;
          license_type?: LicenseType;
          download_url?: string;
          expires_at?: string | null;
          download_count?: number;
        };
      };
      support_tickets: {
        Row: {
          id: string;
          ticket_number: string;
          user_id: string;
          order_id: string | null;
          type: TicketType;
          status: TicketStatus;
          subject: string;
          description: string;
          assigned_to: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ticket_number?: string;
          user_id: string;
          order_id?: string | null;
          type?: TicketType;
          status?: TicketStatus;
          subject: string;
          description: string;
          assigned_to?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ticket_number?: string;
          user_id?: string;
          order_id?: string | null;
          type?: TicketType;
          status?: TicketStatus;
          subject?: string;
          description?: string;
          assigned_to?: string | null;
          resolved_at?: string | null;
          updated_at?: string;
        };
      };
      ticket_messages: {
        Row: {
          id: string;
          ticket_id: string;
          sender_id: string;
          content: string;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          sender_id: string;
          content: string;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          ticket_id?: string;
          sender_id?: string;
          content?: string;
          is_admin?: boolean;
        };
      };
    };
    Functions: {
      upsert_user_from_clerk: {
        Args: {
          p_clerk_id: string;
          p_email: string;
          p_name?: string;
          p_image?: string;
        };
        Returns: string;
      };
      create_customer_profile: {
        Args: {
          p_user_id: string;
        };
        Returns: string;
      };
      create_director_profile: {
        Args: {
          p_user_id: string;
          p_bio?: string;
          p_specialization?: string[];
        };
        Returns: string;
      };
      get_cart_total: {
        Args: {
          p_user_id: string;
        };
        Returns: number;
      };
      search_music: {
        Args: {
          p_query?: string;
          p_genre?: string;
          p_mood?: string;
          p_use_case?: string;
          p_price_min?: number;
          p_price_max?: number;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: {
          id: string;
          title: string;
          description: string;
          duration: number;
          price: number;
          audio_url: string;
          preview_url: string | null;
          cover_image: string | null;
          genre: string;
          mood: string | null;
          director_name: string | null;
          director_image: string | null;
          play_count: number;
          rank: number;
        }[];
      };
      get_admin_stats: {
        Args: Record<string, never>;
        Returns: {
          total_users: number;
          total_customers: number;
          total_directors: number;
          verified_directors: number;
          pending_verifications: number;
          total_music: number;
          active_music: number;
          pending_approvals: number;
          total_orders: number;
          pending_orders: number;
          completed_orders: number;
          total_revenue: number;
          open_tickets: number;
        };
      };
      increment_play_count: {
        Args: {
          p_music_id: string;
        };
        Returns: void;
      };
      increment_download_count: {
        Args: {
          download_id: string;
        };
        Returns: void;
      };
    };
  };
}

