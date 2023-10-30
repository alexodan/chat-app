import { useSupabase } from '@/components/SupabaseProvider'

export default function useProfile() {
  const { supabase } = useSupabase()

  const updateUserProfile = async ({
    id,
    fullName,
    username,
    imageFile,
  }: {
    id: string
    fullName: string | null
    username: string | null
    imageFile: File | null
  }) => {
    let avatarResponse
    if (imageFile) {
      avatarResponse = await supabase.storage
        .from('avatars')
        .update(`${id}/avatar.jpeg`, imageFile)
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
    updateUserProfile,
  }
}
