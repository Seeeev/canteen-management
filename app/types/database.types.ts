export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      cashiers: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: number
          last_name: string | null
          middle_name: string | null
          suffix: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          middle_name?: string | null
          suffix?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          middle_name?: string | null
          suffix?: string | null
        }
        Relationships: []
      }
      colleges: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          created_at: string | null
          enrollment_year: number
          id: string
          major_id: string | null
          status: string | null
          student_id: string | null
        }
        Insert: {
          created_at?: string | null
          enrollment_year: number
          id?: string
          major_id?: string | null
          status?: string | null
          student_id?: string | null
        }
        Update: {
          created_at?: string | null
          enrollment_year?: number
          id?: string
          major_id?: string | null
          status?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_major_id_fkey"
            columns: ["major_id"]
            isOneToOne: false
            referencedRelation: "majors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      majors: {
        Row: {
          created_at: string | null
          id: string
          name: string
          program_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          program_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          program_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "majors_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          code: string
          college_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          college_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          college_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          balance: number | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          last_name: string
          middle_name: string | null
          student_number: string
          suffix: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          last_name: string
          middle_name?: string | null
          student_number: string
          suffix?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          last_name?: string
          middle_name?: string | null
          student_number?: string
          suffix?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number | null
          cashier_id: number | null
          created_at: string
          id: number
          refunded: boolean | null
          student_number: string | null
          transaction_type:
            | Database["public"]["Enums"]["transaction_type"]
            | null
        }
        Insert: {
          amount?: number | null
          cashier_id?: number | null
          created_at?: string
          id?: number
          refunded?: boolean | null
          student_number?: string | null
          transaction_type?:
            | Database["public"]["Enums"]["transaction_type"]
            | null
        }
        Update: {
          amount?: number | null
          cashier_id?: number | null
          created_at?: string
          id?: number
          refunded?: boolean | null
          student_number?: string | null
          transaction_type?:
            | Database["public"]["Enums"]["transaction_type"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "cashiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_student_number_fkey"
            columns: ["student_number"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_number"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      course: "Course A" | "Course B" | "Course C"
      gender: "male" | "female"
      section: "A" | "B" | "C"
      transaction_type: "withraw" | "deposite" | "purchase" | "refund"
      year: "1" | "2" | "3" | "4"
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
      course: ["Course A", "Course B", "Course C"],
      gender: ["male", "female"],
      section: ["A", "B", "C"],
      transaction_type: ["withraw", "deposite", "purchase", "refund"],
      year: ["1", "2", "3", "4"],
    },
  },
} as const
