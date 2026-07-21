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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categorias: {
        Row: {
          ativa: boolean
          created_at: string
          descricao: string | null
          id: string
          nome: string
          posicao: number
          slug: string
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          posicao?: number
          slug: string
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          posicao?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      configuracoes_site: {
        Row: {
          created_at: string
          descricao_marca: string | null
          endereco: string | null
          hero_image_path: string | null
          hero_subtitulo: string | null
          hero_titulo: string | null
          id: number
          instagram_url: string | null
          logo_image_path: string | null
          nome_marca: string
          texto_sobre: string | null
          updated_at: string
          updated_by: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          descricao_marca?: string | null
          endereco?: string | null
          hero_image_path?: string | null
          hero_subtitulo?: string | null
          hero_titulo?: string | null
          id?: number
          instagram_url?: string | null
          logo_image_path?: string | null
          nome_marca: string
          texto_sobre?: string | null
          updated_at?: string
          updated_by?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          descricao_marca?: string | null
          endereco?: string | null
          hero_image_path?: string | null
          hero_subtitulo?: string | null
          hero_titulo?: string | null
          id?: number
          instagram_url?: string | null
          logo_image_path?: string | null
          nome_marca?: string
          texto_sobre?: string | null
          updated_at?: string
          updated_by?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      home_secao_produtos: {
        Row: {
          created_at: string
          posicao: number
          produto_id: string
          secao_id: string
        }
        Insert: {
          created_at?: string
          posicao: number
          produto_id: string
          secao_id: string
        }
        Update: {
          created_at?: string
          posicao?: number
          produto_id?: string
          secao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "home_secao_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "home_secao_produtos_secao_id_fkey"
            columns: ["secao_id"]
            isOneToOne: false
            referencedRelation: "secoes_home"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_imagens: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          posicao: number
          produto_id: string
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          posicao: number
          produto_id: string
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          posicao?: number
          produto_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "produto_imagens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          atributos: Json
          categoria_id: string
          created_at: string
          created_by: string | null
          descricao: string | null
          descricao_curta: string | null
          disponivel: boolean
          id: string
          mensagem_whatsapp: string | null
          nome: string
          slug: string
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          atributos?: Json
          categoria_id: string
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          descricao_curta?: string | null
          disponivel?: boolean
          id?: string
          mensagem_whatsapp?: string | null
          nome: string
          slug: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          atributos?: Json
          categoria_id?: string
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          descricao_curta?: string | null
          disponivel?: boolean
          id?: string
          mensagem_whatsapp?: string | null
          nome?: string
          slug?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      secoes_home: {
        Row: {
          ativa: boolean
          created_at: string
          id: string
          limite_produtos: number
          posicao: number
          slug: string
          subtitulo: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          id?: string
          limite_produtos?: number
          posicao?: number
          slug: string
          subtitulo?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          id?: string
          limite_produtos?: number
          posicao?: number
          slug?: string
          subtitulo?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      excluir_imagem_produto: {
        Args: { p_imagem_id: string }
        Returns: undefined
      }
      excluir_produto_arquivado: {
        Args: { p_produto_id: string }
        Returns: undefined
      }
      health_check: { Args: never; Returns: string }
      registrar_imagem_produto: {
        Args: {
          p_alt_text?: string
          p_produto_id: string
          p_storage_path: string
        }
        Returns: string
      }
      reordenar_categorias: {
        Args: { p_categoria_ids: string[] }
        Returns: undefined
      }
      reordenar_imagens_produto: {
        Args: { p_imagem_ids: string[]; p_produto_id: string }
        Returns: undefined
      }
      reordenar_secoes_home: {
        Args: { p_secao_ids: string[] }
        Returns: undefined
      }
      salvar_produtos_secao_home: {
        Args: { p_produto_ids: string[]; p_secao_id: string }
        Returns: undefined
      }
      usuario_atual_e_admin: { Args: never; Returns: boolean }
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
