export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          chat_id: string
          users: string[]
        }
        Insert: {
          chat_id?: string
          users: string[]
        }
        Update: {
          chat_id?: string
          users?: string[]
        }
        Relationships: []
      }
      contacts: {
        Row: {
          contact_id: number
          contact_user_id: string | null
          user_id: string | null
        }
        Insert: {
          contact_id?: number
          contact_user_id?: string | null
          user_id?: string | null
        }
        Update: {
          contact_id?: number
          contact_user_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_contact_user_id_fkey"
            columns: ["contact_user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          chat_id: string
          content: string | null
          id: number
          timestamp: string | null
          user_id: string
        }
        Insert: {
          chat_id: string
          content?: string | null
          id?: number
          timestamp?: string | null
          user_id: string
        }
        Update: {
          chat_id?: string
          content?: string | null
          id?: number
          timestamp?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            referencedRelation: "chats"
            referencedColumns: ["chat_id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
