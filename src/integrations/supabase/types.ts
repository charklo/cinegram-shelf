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
      movie_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          movie_id: string
          rating: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          movie_id: string
          rating?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          movie_id?: string
          rating?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_reviews_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movie_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      movies: {
        Row: {
          box_office: number | null
          budget: number | null
          country: string | null
          created_at: string
          director: string | null
          duration: number | null
          genres: string[] | null
          id: string
          imdb_id: string
          imdb_rating: number | null
          language: string | null
          movie_cast: Json | null
          overview: string | null
          poster_url: string | null
          production_company: string | null
          release_date: string | null
          title: string
        }
        Insert: {
          box_office?: number | null
          budget?: number | null
          country?: string | null
          created_at?: string
          director?: string | null
          duration?: number | null
          genres?: string[] | null
          id?: string
          imdb_id: string
          imdb_rating?: number | null
          language?: string | null
          movie_cast?: Json | null
          overview?: string | null
          poster_url?: string | null
          production_company?: string | null
          release_date?: string | null
          title: string
        }
        Update: {
          box_office?: number | null
          budget?: number | null
          country?: string | null
          created_at?: string
          director?: string | null
          duration?: number | null
          genres?: string[] | null
          id?: string
          imdb_id?: string
          imdb_rating?: number | null
          language?: string | null
          movie_cast?: Json | null
          overview?: string | null
          poster_url?: string | null
          production_company?: string | null
          release_date?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tv_show_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number | null
          tv_show_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          tv_show_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          tv_show_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tv_show_reviews_tv_show_id_fkey"
            columns: ["tv_show_id"]
            isOneToOne: false
            referencedRelation: "tv_shows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tv_show_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tv_shows: {
        Row: {
          country: string | null
          created_at: string
          creator: string | null
          duration: number | null
          first_air_date: string | null
          genres: string[] | null
          id: string
          language: string | null
          network: string | null
          number_of_episodes: number | null
          number_of_seasons: number | null
          overview: string | null
          poster_url: string | null
          show_cast: Json | null
          status: string | null
          title: string
          tmdb_id: string
          tmdb_rating: number | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          creator?: string | null
          duration?: number | null
          first_air_date?: string | null
          genres?: string[] | null
          id?: string
          language?: string | null
          network?: string | null
          number_of_episodes?: number | null
          number_of_seasons?: number | null
          overview?: string | null
          poster_url?: string | null
          show_cast?: Json | null
          status?: string | null
          title: string
          tmdb_id: string
          tmdb_rating?: number | null
        }
        Update: {
          country?: string | null
          created_at?: string
          creator?: string | null
          duration?: number | null
          first_air_date?: string | null
          genres?: string[] | null
          id?: string
          language?: string | null
          network?: string | null
          number_of_episodes?: number | null
          number_of_seasons?: number | null
          overview?: string | null
          poster_url?: string | null
          show_cast?: Json | null
          status?: string | null
          title?: string
          tmdb_id?: string
          tmdb_rating?: number | null
        }
        Relationships: []
      }
      user_movies: {
        Row: {
          created_at: string
          movie_id: string
          updated_at: string
          user_id: string
          user_rating: number | null
        }
        Insert: {
          created_at?: string
          movie_id: string
          updated_at?: string
          user_id: string
          user_rating?: number | null
        }
        Update: {
          created_at?: string
          movie_id?: string
          updated_at?: string
          user_id?: string
          user_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_movies_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_movies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tv_shows: {
        Row: {
          created_at: string
          seasons_watched: number[] | null
          tv_show_id: string
          updated_at: string
          user_id: string
          user_rating: number | null
        }
        Insert: {
          created_at?: string
          seasons_watched?: number[] | null
          tv_show_id: string
          updated_at?: string
          user_id: string
          user_rating?: number | null
        }
        Update: {
          created_at?: string
          seasons_watched?: number[] | null
          tv_show_id?: string
          updated_at?: string
          user_id?: string
          user_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tv_shows_tv_show_id_fkey"
            columns: ["tv_show_id"]
            isOneToOne: false
            referencedRelation: "tv_shows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tv_shows_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
