'use client'

import { css } from '../../../styled-system/css'
import { useSupabase } from '@/components/SupabaseProvider'
import { useMutation, useQuery } from '@tanstack/react-query'
import useProfile from '@/components/useProfile'
import Loading from '@/components/common/Loading'
import AccountForm from '@/app/account/account-form'

export default function AccountDetail() {
  const { session } = useSupabase()
  const { getUserProfile, updateUserProfile } = useProfile()

  const user = session?.user
  const { data, isLoading } = useQuery(['profile'], async () => {
    if (user) {
      return getUserProfile(user.id)
    }
  })

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

  if (isLoading || !data || !session?.user.email) {
    return <Loading height={200} width={200} />
  }

  return (
    <div className={css({ px: 4, py: 2 })}>
      <h2 className={css({ fontSize: '2xl' })}>Account details</h2>
      <AccountForm
        email={session?.user.email}
        userInfo={data}
        isLoading={mutation.isLoading}
        error={
          mutation.isError
            ? mutation.error instanceof Error
              ? mutation.error.message
              : 'An error occurred, try again later'
            : ''
        }
        onSubmit={handleSubmit}
      />
    </div>
  )
}
