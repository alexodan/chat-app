'use client'

import { useCallback, useEffect, useState } from 'react'
import { Database } from '@/types/supabase'
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"
import Input from "@/components/common/Input"
import Button from "@/components/common/Button"
import { css } from "../../../styled-system/css"

export default function AccountForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const user = session?.user

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullName(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    website,
    avatarUrl,
  }: {
    username: string | null
    fullName: string | null
    website: string | null
    avatarUrl: string | null
  }) {
    try {
      setLoading(true)

      let { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        fullName,
        username,
        website,
        avatarUrl,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

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
        <label htmlFor="website">Website</label>
        <Input
          id="website"
          type="url"
          value={website || ''}
          onChange={e => setWebsite(e.target.value)}
        />
      </div>

      <div className={css({ mt: 2 })}>
        <Button
          onClick={() =>
            updateProfile({ fullName, username, website, avatarUrl })
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </Button>
      </div>
    </div>
  )
}
