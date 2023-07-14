'use client'

import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Database } from '@/types/supabase'
import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { css } from '../../../styled-system/css'
import Avatar from '@/components/Avatar'
import compressImage from '@/lib/compressImage'

export default function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const user = session?.user

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullName(data.full_name)
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  const handleAvatarUpdate = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const image = e.target.files?.[0]
    if (!image) {
      setLoading(false)
      return
    }
    try {
      const compressedImage = await compressImage(image)
      const file = new File([compressedImage], 'avatar.jpeg', {
        type: 'image/jpeg',
      })
      setProfilePicture(file)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async ({
    fullName,
    username,
    profilePicture,
  }: {
    username: string | null
    fullName: string | null
    profilePicture: File | null
  }) => {
    try {
      let avatarUrl = null
      setLoading(true)

      // TODO: I don't like having this here in the component
      if (profilePicture) {
        const { data } = await supabase.storage
          .from('avatars')
          .update(`${user?.id}/avatar.jpeg`, profilePicture)
        avatarUrl = data?.path
      }

      let { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullName,
        username,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      await getProfile()
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  return (
    <div className={css({ px: 4, py: 2 })}>
      <h2 className={css({ fontSize: '2xl' })}>Account details</h2>
      <div className={css({ mt: 2 })}>
        <label htmlFor="email">Email</label>
        <Input id="email" type="text" value={session?.user.email} disabled />
      </div>
      <div className={css({ mt: 2 })}>
        <label htmlFor="fullName">Full Name</label>
        <Input
          id="fullName"
          type="text"
          value={fullName || ''}
          onChange={e => setFullName(e.target.value)}
        />
      </div>
      <div className={css({ mt: 2 })}>
        <label htmlFor="username">Username</label>
        <Input
          id="username"
          type="text"
          value={username || ''}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div className={css({ mt: 2 })}>
        <label htmlFor="avatar">Profile picture</label>
        <Avatar url={avatarUrl} size={248} />
        <Input id="avatar" type="file" onChange={handleAvatarUpdate} />
      </div>

      <div className={css({ mt: 2 })}>
        <Button
          onClick={() => updateProfile({ fullName, username, profilePicture })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </Button>
      </div>
    </div>
  )
}
