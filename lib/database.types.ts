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
        }
        Insert: {
          date: string
          id?: string
          name: string
          owner?: string | null
        }
        Update: {
          date?: string
          id?: string
          name?: string
          owner?: string | null
        }
        Relationships: []
      }
      guests: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          name: string
          organisation: string | null
          type: string | null
          used: boolean
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          name: string
          organisation?: string | null
          type?: string | null
          used?: boolean
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          name?: string
          organisation?: string | null
          type?: string | null
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
        ]
      }
      links: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          limit_free: number
          limit_half: number
          limit_skip: number
          organisation: string
          permissions: Json | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          limit_free?: number
          limit_half?: number
          limit_skip?: number
          organisation: string
          permissions?: Json | null
          slug: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          limit_free?: number
          limit_half?: number
          limit_skip?: number
          organisation?: string
          permissions?: Json | null
          slug?: string
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
        Relationships: [
          {
            foreignKeyName: "staff_belongs_to_account_fkey"
            columns: ["belongs_to_account"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "user_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
