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
      _link_dlc: {
        Row: {
          created_at: string
          dlc: string | null
          id: number
          original: string | null
        }
        Insert: {
          created_at?: string
          dlc?: string | null
          id?: number
          original?: string | null
        }
        Update: {
          created_at?: string
          dlc?: string | null
          id?: number
          original?: string | null
        }
        Relationships: []
      }
      _link_game_tag: {
        Row: {
          created_at: string
          game_name: string | null
          game_tag: string | null
          id: number
        }
        Insert: {
          created_at?: string
          game_name?: string | null
          game_tag?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          game_name?: string | null
          game_tag?: string | null
          id?: number
        }
        Relationships: []
      }
      game_list: {
        Row: {
          alias: string[] | null
          complete_time: string | null
          created_at: string
          game_type: Database["public"]["Enums"]["game_type"] | null
          heart: boolean | null
          id: number
          judgment: string | null
          name: string
          platform: Database["public"]["Enums"]["platform"] | null
          remark: string | null
          status: Database["public"]["Enums"]["complete_status"]
          tags: string[] | null
          user_id: string | null
        }
        Insert: {
          alias?: string[] | null
          complete_time?: string | null
          created_at?: string
          game_type?: Database["public"]["Enums"]["game_type"] | null
          heart?: boolean | null
          id?: number
          judgment?: string | null
          name: string
          platform?: Database["public"]["Enums"]["platform"] | null
          remark?: string | null
          status?: Database["public"]["Enums"]["complete_status"]
          tags?: string[] | null
          user_id?: string | null
        }
        Update: {
          alias?: string[] | null
          complete_time?: string | null
          created_at?: string
          game_type?: Database["public"]["Enums"]["game_type"] | null
          heart?: boolean | null
          id?: number
          judgment?: string | null
          name?: string
          platform?: Database["public"]["Enums"]["platform"] | null
          remark?: string | null
          status?: Database["public"]["Enums"]["complete_status"]
          tags?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      game_tags: {
        Row: {
          children: string[] | null
          created_at: string
          id: number
          name: string
          parents: string[] | null
        }
        Insert: {
          children?: string[] | null
          created_at?: string
          id?: number
          name: string
          parents?: string[] | null
        }
        Update: {
          children?: string[] | null
          created_at?: string
          id?: number
          name?: string
          parents?: string[] | null
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
        | "frozen"
        | "not_started"
        | "not_published"
      game_type: "original" | "dlc"
      platform: "pc" | "ps" | "ns" | "xbox"
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
    Enums: {
      complete_status: [
        "running",
        "completed",
        "abandoned",
        "frozen",
        "not_started",
        "not_published",
      ],
      game_type: ["original", "dlc"],
      platform: ["pc", "ps", "ns", "xbox"],
    },
  },
} as const
