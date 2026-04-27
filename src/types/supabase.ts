// src/types/supabase.ts

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
      posts: {
        Row: {
          id: string
          created_at: string
          title: string | null
          // আপনার অন্যান্য কলামগুলো এখানে দিন...
        }
        Insert: {
          id?: string
          // ...
        }
        Update: {
          id?: string
          // ...
        }
      }
      // অন্যান্য টেবিল...
    }
  }
}