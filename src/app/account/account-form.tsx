'use client'

import { css } from '../../../styled-system/css'
import Button from '@/components/common/Button'
import ErrorMessage from '@/components/common/ErrorMessage'
import Input from '@/components/common/Input'
import { useState } from 'react'
import useAvatar from '@/components/useAvatar'

type Props = {
  email: string
  userInfo: {
    full_name: string | null
    username: string | null
    avatar_url: string | null
  }
  isLoading: boolean
  error: string | null
  onSubmit: (formData: {
    fullName: string | null
    username: string | null
    imageFile: File | null
  }) => void
}

export default function AccountForm({
  email,
  userInfo,
  isLoading,
  error,
  onSubmit,
}: Props) {
  const [fullName, setFullName] = useState<string | null>(userInfo.full_name)
  const [username, setUsername] = useState<string | null>(userInfo.username)

  const { AvatarPreview, imageFile, handleAvatarChange, imageSrc } = useAvatar({
    avatarUrl: userInfo.avatar_url,
    size: 248,
  })

  return (
    <form
      onSubmit={() =>
        onSubmit({
          fullName,
          username,
          imageFile,
        })
      }
    >
      <div className={css({ mt: 2 })}>
        <label htmlFor="email">Email</label>
        <Input id="email" type="text" value={email} disabled />
      </div>
      <div className={css({ mt: 2 })}>
        <label htmlFor="fullName">Full Name</label>
        <Input
          id="fullName"
          type="text"
          value={fullName ?? ''}
          onChange={e => setFullName(e.target.value)}
        />
      </div>
      <div className={css({ mt: 2 })}>
        <label htmlFor="username">Username</label>
        <Input
          id="username"
          type="text"
          value={username ?? ''}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div className={css({ mt: 2 })}>
        <label htmlFor="avatar">Profile picture</label>
        <AvatarPreview />
        <Input id="avatar" type="file" onChange={handleAvatarChange} />
        <ErrorMessage>{error}</ErrorMessage>
      </div>

      <div className={css({ mt: 2 })}>
        <Button isLoading={isLoading}>Update</Button>
      </div>
    </form>
  )
}
