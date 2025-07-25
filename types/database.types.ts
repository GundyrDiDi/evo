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
      _relations_dlc: {
        Row: {
          created_at: string
          dlc_id: number
          id: number
          original_id: number | null
        }
        Insert: {
          created_at?: string
          dlc_id: number
          id?: number
          original_id?: number | null
        }
        Update: {
          created_at?: string
          dlc_id?: number
          id?: number
          original_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "_relations_dlc_dlc_id_fkey"
            columns: ["dlc_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_relations_dlc_original_id_fkey"
            columns: ["original_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
        ]
      }
      _relations_game_tag: {
        Row: {
          created_at: string
          game_id: number | null
          id: number
          tag_id: number | null
        }
        Insert: {
          created_at?: string
          game_id?: number | null
          id?: number
          tag_id?: number | null
        }
        Update: {
          created_at?: string
          game_id?: number | null
          id?: number
          tag_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "_link_game_tag_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_link_game_tag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "game_tag"
            referencedColumns: ["id"]
          },
        ]
      }
      _relations_tag: {
        Row: {
          child_id: number
          id: number
          parent_id: number
        }
        Insert: {
          child_id: number
          id: number
          parent_id: number
        }
        Update: {
          child_id?: number
          id?: number
          parent_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "_relations_tag_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "game_tag"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_relations_tag_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "game_tag"
            referencedColumns: ["id"]
          },
        ]
      }
      game: {
        Row: {
          alias: string[] | null
          complete_time: string | null
          created_at: string
          edition: Database["public"]["Enums"]["edition"] | null
          extra: boolean | null
          heart: boolean | null
          id: number
          judgment: string | null
          name: string
          owned: boolean | null
          platform: Database["public"]["Enums"]["platform"] | null
          remark: string | null
          series: string | null
          status: Database["public"]["Enums"]["complete_status"] | null
          tags: string[] | null
          user_id: string | null
        }
        Insert: {
          alias?: string[] | null
          complete_time?: string | null
          created_at?: string
          edition?: Database["public"]["Enums"]["edition"] | null
          extra?: boolean | null
          heart?: boolean | null
          id?: number
          judgment?: string | null
          name: string
          owned?: boolean | null
          platform?: Database["public"]["Enums"]["platform"] | null
          remark?: string | null
          series?: string | null
          status?: Database["public"]["Enums"]["complete_status"] | null
          tags?: string[] | null
          user_id?: string | null
        }
        Update: {
          alias?: string[] | null
          complete_time?: string | null
          created_at?: string
          edition?: Database["public"]["Enums"]["edition"] | null
          extra?: boolean | null
          heart?: boolean | null
          id?: number
          judgment?: string | null
          name?: string
          owned?: boolean | null
          platform?: Database["public"]["Enums"]["platform"] | null
          remark?: string | null
          series?: string | null
          status?: Database["public"]["Enums"]["complete_status"] | null
          tags?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      game_tag: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      complete_status:
        | "running"
        | "completed"
        | "abandoned"
        | "set_aside"
        | "not_started"
        | "not_published"
      edition: "standard" | "deluxe" | "complete"
      platform: "pc" | "ps" | "ns" | "xbox"
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
    Enums: {
      complete_status: [
        "running",
        "completed",
        "abandoned",
        "set_aside",
        "not_started",
        "not_published",
      ],
      edition: ["standard", "deluxe", "complete"],
      platform: ["pc", "ps", "ns", "xbox"],
    },
  },
} as const
