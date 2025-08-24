// Tipos gerados baseados na estrutura do banco de dados PhotoApp
// Após executar as migrações, você pode regerar com: supabase gen types typescript

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
      events: {
        Row: {
          id: string
          title: string
          start_date: string
          end_date: string | null
          school: string
          contact: string
          phone: string
          commission: number
          photo_price: number
          status: 'upcoming' | 'active' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          start_date: string
          end_date?: string | null
          school: string
          contact: string
          phone: string
          commission?: number
          photo_price?: number
          status?: 'upcoming' | 'active' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          start_date?: string
          end_date?: string | null
          school?: string
          contact?: string
          phone?: string
          commission?: number
          photo_price?: number
          status?: 'upcoming' | 'active' | 'completed' | 'cancelled'
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
          type: 'student' | 'teacher' | 'staff'
          qr_code: string | null
          photos: string[]
          profile_photo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          class: string
          type?: 'student' | 'teacher' | 'staff'
          qr_code?: string | null
          photos?: string[]
          profile_photo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          class?: string
          type?: 'student' | 'teacher' | 'staff'
          qr_code?: string | null
          photos?: string[]
          profile_photo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      photo_sales: {
        Row: {
          id: string
          participant_id: string
          event_id: string
          photos: string[]
          total_amount: number
          commission_amount: number
          status: 'pending' | 'paid' | 'cancelled'
          payment_method: string | null
          payment_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          event_id: string
          photos: string[]
          total_amount: number
          commission_amount: number
          status?: 'pending' | 'paid' | 'cancelled'
          payment_method?: string | null
          payment_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          event_id?: string
          photos?: string[]
          total_amount?: number
          commission_amount?: number
          status?: 'pending' | 'paid' | 'cancelled'
          payment_method?: string | null
          payment_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          avatar_url: string | null
          company_name: string | null
          website: string | null
          bio: string | null
          commission_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          company_name?: string | null
          website?: string | null
          bio?: string | null
          commission_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          company_name?: string | null
          website?: string | null
          bio?: string | null
          commission_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      event_statistics: {
        Row: {
          id: string
          title: string
          school: string
          start_date: string
          status: string
          total_participants: number
          participants_with_photos: number
          total_revenue: number
          total_commission: number
          paid_sales: number
          pending_sales: number
        }
      }
      user_dashboard: {
        Row: {
          total_events: number
          total_participants: number
          total_revenue: number
          total_commission: number
          active_events: number
          upcoming_events: number
          completed_events: number
        }
      }
    }
    Functions: {
      generate_qr_code: {
        Args: {}
        Returns: string
      }
      get_avatar_url: {
        Args: {
          user_id: string
          filename: string
        }
        Returns: string
      }
      get_company_logo_url: {
        Args: {
          user_id: string
          filename: string
        }
        Returns: string
      }
      get_user_profile: {
        Args: {
          user_id?: string
        }
        Returns: Database['public']['Tables']['profiles']['Row']
      }
      is_admin: {
        Args: {
          user_id?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      event_status: 'upcoming' | 'active' | 'completed' | 'cancelled'
      participant_type: 'student' | 'teacher' | 'staff'
      sale_status: 'pending' | 'paid' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipos auxiliares para facilitar o uso
export type Event = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type EventUpdate = Database['public']['Tables']['events']['Update']

export type Participant = Database['public']['Tables']['participants']['Row']
export type ParticipantInsert = Database['public']['Tables']['participants']['Insert']
export type ParticipantUpdate = Database['public']['Tables']['participants']['Update']

export type PhotoSale = Database['public']['Tables']['photo_sales']['Row']
export type PhotoSaleInsert = Database['public']['Tables']['photo_sales']['Insert']
export type PhotoSaleUpdate = Database['public']['Tables']['photo_sales']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type EventStatistics = Database['public']['Views']['event_statistics']['Row']
export type UserDashboard = Database['public']['Views']['user_dashboard']['Row']

// Tipos para enums
export type EventStatus = Database['public']['Enums']['event_status']
export type ParticipantType = Database['public']['Enums']['participant_type']
export type SaleStatus = Database['public']['Enums']['sale_status']
