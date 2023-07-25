import Image from 'next/image'
import { ChangeEvent, useEffect, useState } from 'react'
import compressImage from '@/lib/compressImage'
import { useSupabase } from '@/components/SupabaseProvider'

type Props = {
  avatarUrl?: string | null
  size: number
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

export default function useAvatar({ avatarUrl, size }: Props) {
  const { supabase } = useSupabase()
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

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
      setImageSrc(blob)
      setImageFile(file)
    } catch (e) {
      console.error('Error updating avatar', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (avatarUrl) {
      supabase.storage
        .from('avatars')
        .download(avatarUrl)
        .then(response => {
          const blob = response.data!
          const url = URL.createObjectURL(blob)
          setImageSrc(url)
        })
        .catch(e => {
          console.error('Something went wrong', e)
        })
    }
    // Note: intentionally not adding supabase to deps (infinite loop)
  }, [avatarUrl])

  return {
    renderAvatar: () => (
      <div>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="Avatar"
            className="avatar image"
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
      </div>
    ),
    imageSrc,
    setImageSrc,
    imageFile,
    handleAvatarChange,
    isLoading,
  }
}
