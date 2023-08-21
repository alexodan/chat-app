import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import { compressImage } from '@/lib/compressImage'
import { useSupabase } from '@/components/SupabaseProvider'
import { useQuery } from '@tanstack/react-query'
import { cx } from '../../styled-system/css'

type Props = {
  avatarUrl?: string | null
}

function getBlob(file: File): Promise<string> {
  const fr = new FileReader()
  fr.readAsArrayBuffer(file)
  return new Promise(
    resolve =>
      (fr.onload = function () {
        const blob = new Blob([fr.result!])
        resolve(URL.createObjectURL(blob))
      }),
  )
}

export default function useAvatar({ avatarUrl }: Props) {
  const { supabase } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [localSrc, setLocalSrc] = useState<string | null>(null)

  const { data: serverSrc } = useQuery(
    ['userProfile', avatarUrl],
    async () => {
      if (!avatarUrl) {
        return
      }
      const response = await supabase.storage
        .from('avatars')
        .download(avatarUrl)
      const blob = response.data!
      const url = URL.createObjectURL(blob)
      return url
    },
    {
      // only run the query if avatar exists!
      enabled: !!avatarUrl,
    },
  )

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true)
    const image = e.target.files?.[0]
    if (!image) {
      setIsLoading(false)
      return
    }
    try {
      const compressedImage = await compressImage(image)
      const file = new File([compressedImage], 'avatar.jpeg', {
        type: 'image/jpeg',
      })
      const blob = await getBlob(file)
      setLocalSrc(blob)
      setImageFile(file)
    } catch (e) {
      console.error('Error updating avatar', e)
    } finally {
      setIsLoading(false)
    }
  }

  const imageSrc = localSrc || serverSrc

  return {
    AvatarPreview: ({
      className,
      size,
    }: {
      className?: string
      size: number
    }) => (
      <>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="Avatar"
            className={cx(className)}
            width={size}
            height={size}
          />
        ) : (
          <div
            style={{
              height: size,
              width: size,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            No image
          </div>
        )}
      </>
    ),
    imageSrc,
    setLocalSrc,
    imageFile,
    handleAvatarChange,
    isLoading,
  }
}
