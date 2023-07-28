import { useSupabase } from '@/components/SupabaseProvider'

export default function useProfile() {
  const { supabase } = useSupabase()

  const getUserProfile = async (id: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('full_name, username, avatar_url')
      .eq('id', id)
      .single()
    if (error) throw error
    return profile
  }

  const updateUserProfile = async ({
    id,
    fullName,
    username,
    avatarUrl,
    imageFile,
  }: {
    id: string
    fullName: string | null
    username: string | null
    avatarUrl: string | null
    imageFile: File | null
  }) => {
    let avatarResponse
    if (imageFile) {
      if (avatarUrl) {
        avatarResponse = await supabase.storage
          .from('avatars')
          .update(`${id}/avatar.jpeg`, imageFile)
      } else {
        avatarResponse = await supabase.storage
          .from('avatars')
          .upload(`${id}/avatar.jpeg`, imageFile)
      }
      if (avatarResponse.error) {
        throw new Error('Error uploading avatar')
      }
    }
    let { error: profileError } = await supabase.from('profiles').upsert({
      id,
      full_name: fullName,
      username,
      avatar_url: avatarResponse?.data.path,
      updated_at: new Date().toISOString(),
    })
    if (profileError) {
      throw new Error('Error updating profile')
    }
  }

  return {
    getUserProfile,
    updateUserProfile,
  }
}
