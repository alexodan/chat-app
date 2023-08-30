import { Database } from './supabase'

export type Message = Database['public']['Tables']['messages']['Row']
export type NewMessage = Omit<Message, 'id'>
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Chat = Database['public']['Tables']['chats']['Row']
