'use client'

import { useEffect, useState } from 'react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { css } from '../../../styled-system/css'
import { useSupabase } from '@/components/SupabaseProvider'
import { useMutation, useQuery } from '@tanstack/react-query'
import useAvatar from '@/components/useAvatar'
import useProfile from '@/components/useProfile'

export default function AccountForm() {
  const { session, supabase } = useSupabase()
  const [fullName, setFullName] = useState<string | null>('')
  const [username, setUsername] = useState<string | null>('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>('')
  const { imageFile, renderAvatar, handleAvatarChange } = useAvatar({
    avatarUrl,
    size: 248,
  })
  const { getUserProfile, updateUserProfile } = useProfile()

  const user = session?.user
  const { data, isError, error, isLoading } = useQuery(
    ['profile'],
    async () => {
      if (user) {
        return getUserProfile(user.id)
      }
    },
  )

  const mutation = useMutation(
    async ({
      fullName,
      username,
    }: {
      fullName: string | null
      username: string | null
    }) => {
      if (user) {
        return updateUserProfile({
          id: user.id,
          fullName,
          username,
          avatarUrl,
          imageFile,
        })
      }
    },
  )

  const updateProfile = async () => {
    try {
      mutation.mutate({ fullName, username })
    } catch (error) {
      alert('Error updating the data!')
      console.error(error)
    }
  }

  useEffect(() => {
    if (data) {
      setFullName(data.full_name)
      setUsername(data.username)
      setAvatarUrl(data.avatar_url)
    }
  }, [data])

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
          disabled={isLoading}
          onChange={e => setFullName(e.target.value)}
        />
      </div>
      <div className={css({ mt: 2 })}>
        <label htmlFor="username">Username</label>
        <Input
          id="username"
          type="text"
          value={username || ''}
          disabled={isLoading}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div className={css({ mt: 2 })}>
        <label htmlFor="avatar">Profile picture</label>
        {renderAvatar()}
        <Input
          id="avatar"
          type="file"
          disabled={isLoading}
          onChange={handleAvatarChange}
        />
        {mutation.isError && (
          // should I extract this thing
          <div className={css({ color: 'red-500' })}>
            {mutation.isError && mutation.error instanceof Error
              ? mutation.error.message
              : 'An error occurred, try again later'}
          </div>
        )}
      </div>

      <div className={css({ mt: 2 })}>
        <Button
          onClick={updateProfile}
          disabled={mutation.isLoading}
          isLoading={mutation.isLoading}
        >
          Update
        </Button>
      </div>
    </div>
  )
}
