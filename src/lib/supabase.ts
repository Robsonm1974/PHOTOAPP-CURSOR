import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          start_date: string
          end_date: string
          school: string
          contact: string
          phone: string
          commission: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          start_date: string
          end_date: string
          school: string
          contact: string
          phone: string
          commission: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          start_date?: string
          end_date?: string
          school?: string
          contact?: string
          phone?: string
          commission?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          event_id: string
          name: string
          class: string
          type: string
          qr_code: string
          photos: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          class: string
          type: string
          qr_code: string
          photos?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          class?: string
          type?: string
          qr_code?: string
          photos?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      photographer_profile: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          logo_url: string | null
          company_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          logo_url?: string | null
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          logo_url?: string | null
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}




