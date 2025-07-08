export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      events: {
        Row: {
          date: string
          id: string
          name: string
          owner: string | null
          pin: number
        }
        Insert: {
          date: string
          id?: string
          name: string
          owner?: string | null
          pin: number
        }
        Update: {
          date?: string
          id?: string
          name?: string
          owner?: string | null
          pin?: number
        }
        Relationships: []
      }
      guests: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          link_id: string | null
          name: string
          organisation: string | null
          type: string
          used: boolean
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          link_id?: string | null
          name: string
          organisation?: string | null
          type: string
          used?: boolean
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          link_id?: string | null
          name?: string
          organisation?: string | null
          type?: string
          used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guests_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guests_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links_with_event_details"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          claimed_via_telegram: boolean
          created_at: string | null
          depth: number
          event_id: string
          id: string
          limit_free: number
          limit_half: number
          limit_skip: number
          organisation: string
          parent_link_id: string | null
          permissions: Json | null
          slug: string
          telegram_user_id: number | null
        }
        Insert: {
          claimed_via_telegram?: boolean
          created_at?: string | null
          depth?: number
          event_id: string
          id?: string
          limit_free?: number
          limit_half?: number
          limit_skip?: number
          organisation: string
          parent_link_id?: string | null
          permissions?: Json | null
          slug: string
          telegram_user_id?: number | null
        }
        Update: {
          claimed_via_telegram?: boolean
          created_at?: string | null
          depth?: number
          event_id?: string
          id?: string
          limit_free?: number
          limit_half?: number
          limit_skip?: number
          organisation?: string
          parent_link_id?: string | null
          permissions?: Json | null
          slug?: string
          telegram_user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "links_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_parent_link_id_fkey"
            columns: ["parent_link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_parent_link_id_fkey"
            columns: ["parent_link_id"]
            isOneToOne: false
            referencedRelation: "links_with_event_details"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          belongs_to_account: string | null
          created_at: string
          id: number
          name: string | null
          telegram_id: number | null
        }
        Insert: {
          belongs_to_account?: string | null
          created_at?: string
          id?: number
          name?: string | null
          telegram_id?: number | null
        }
        Update: {
          belongs_to_account?: string | null
          created_at?: string
          id?: number
          name?: string | null
          telegram_id?: number | null
        }
        Relationships: []
      }
      user_event_permissions: {
        Row: {
          event_id: string
          user_id: string
        }
        Insert: {
          event_id: string
          user_id: string
        }
        Update: {
          event_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      links_with_event_details: {
        Row: {
          event_date: string | null
          event_id: string | null
          event_name: string | null
          id: string | null
          limit_free: number | null
          limit_half: number | null
          limit_skip: number | null
          organisation: string | null
          permissions: Json | null
          slug: string | null
        }
        Relationships: [
          {
            foreignKeyName: "links_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      delete_link: {
        Args: { p_link_id: string; p_mode: string }
        Returns: undefined
      }
      get_dashboard: {
        Args: { p_event_id: string }
        Returns: {
          event: Json
          guests: Json
          links: Json
          staff: Json
        }[]
      }
      get_link_with_guests: {
        Args: { link_slug: string }
        Returns: {
          id: string
          slug: string
          organisation: string
          limit_free: number
          limit_half: number
          limit_skip: number
          event_name: string
          event_date: string
          event_id: string
          guests: Json
          used_free: number
          used_half: number
          used_skip: number
        }[]
      }
      split_link: {
        Args: {
          p_parent_id: string
          p_org: string
          p_free: number
          p_half: number
          p_skip: number
        }
        Returns: {
          claimed_via_telegram: boolean
          created_at: string | null
          depth: number
          event_id: string
          id: string
          limit_free: number
          limit_half: number
          limit_skip: number
          organisation: string
          parent_link_id: string | null
          permissions: Json | null
          slug: string
          telegram_user_id: number | null
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
