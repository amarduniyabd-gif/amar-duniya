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
      profiles: {
        Row: {
          id: string
          email: string | null
          name: string | null
          phone: string | null
          avatar: string | null
          location: string | null
          bio: string | null
          is_verified: boolean
          is_admin: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
          phone?: string | null
          avatar?: string | null
          location?: string | null
          bio?: string | null
          is_verified?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          phone?: string | null
          avatar?: string | null
          location?: string | null
          bio?: string | null
          is_verified?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          name_bn: string | null
          icon: string | null
          slug: string | null
          parent_id: string | null
          order_index: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_bn?: string | null
          icon?: string | null
          slug?: string | null
          parent_id?: string | null
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_bn?: string | null
          icon?: string | null
          slug?: string | null
          parent_id?: string | null
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          original_price: number | null
          condition: 'new' | 'old' | null
          brand: string | null
          warranty: string | null
          delivery: 'pickup' | 'delivery' | 'amar_duniya_delivery' | null
          location: string | null
          seller_id: string
          category_id: string | null
          sub_category_id: string | null
          status: 'pending' | 'approved' | 'rejected' | 'sold'
          is_featured: boolean
          is_urgent: boolean
          views: number
          likes: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          original_price?: number | null
          condition?: 'new' | 'old' | null
          brand?: string | null
          warranty?: string | null
          delivery?: 'pickup' | 'delivery' | 'amar_duniya_delivery' | null
          location?: string | null
          seller_id: string
          category_id?: string | null
          sub_category_id?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'sold'
          is_featured?: boolean
          is_urgent?: boolean
          views?: number
          likes?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          original_price?: number | null
          condition?: 'new' | 'old' | null
          brand?: string | null
          warranty?: string | null
          delivery?: 'pickup' | 'delivery' | 'amar_duniya_delivery' | null
          location?: string | null
          seller_id?: string
          category_id?: string | null
          sub_category_id?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'sold'
          is_featured?: boolean
          is_urgent?: boolean
          views?: number
          likes?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      // ... অন্যান্য টেবিলের টাইপ এখানে যোগ হবে
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}