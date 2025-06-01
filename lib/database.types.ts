export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          event_id: string
          id: string
          limit_free: number
          limit_half: number
          limit_skip: number
          organisation: string
          permissions: Json | null
          slug: string
          telegram_user_id: number | null
        }
        Insert: {
          claimed_via_telegram?: boolean
          created_at?: string | null
          event_id: string
          id?: string
          limit_free?: number
          limit_half?: number
          limit_skip?: number
          organisation: string
          permissions?: Json | null
          slug: string
          telegram_user_id?: number | null
        }
        Update: {
          claimed_via_telegram?: boolean
          created_at?: string | null
          event_id?: string
          id?: string
          limit_free?: number
          limit_half?: number
          limit_skip?: number
          organisation?: string
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
