'use client'

import { useMutation } from '@tanstack/react-query'
import useProfile from '@/components/useProfile'
import AccountForm from '@/app/account/account-form'
import { Profile } from '@/types/models'

type AccountDetailsProps = {
  user: Profile & { email: string }
}

export default function AccountDetail({ user }: AccountDetailsProps) {
  const { updateUserProfile } = useProfile()

  const mutation = useMutation(
    async ({
      fullName,
      username,
      imageFile,
    }: {
      fullName: string | null
      username: string | null
      imageFile: File | null
    }) => {
      if (user) {
        return updateUserProfile({
          id: user.id,
          fullName,
          username,
          imageFile,
        })
      }
    },
  )

  const handleSubmit = (formData: {
    fullName: string | null
    username: string | null
    imageFile: File | null
  }) => {
    const { fullName, username, imageFile } = formData
    mutation.mutate({ fullName, username, imageFile })
  }

  return (
    <AccountForm
      email={user.email}
      userInfo={user}
      isUpdating={mutation.isLoading}
      error={
        mutation.isError
          ? mutation.error instanceof Error
            ? mutation.error.message
            : 'An error occurred, try again later'
          : ''
      }
      onSubmit={handleSubmit}
    />
  )
}
