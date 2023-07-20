import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import Image from 'next/image'

type Props = {
  url: string | null
  size: number
}

// new Blob(file)?
export default function Avatar({ url, size }: Props) {
  const supabase = createClientComponentClient<Database>()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const downloadImage = useCallback(
    async (path: string) => {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(path)
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error: unknown) {
        console.error('Error downloading image: ', error)
      }
    },
    [
      /* (`supabase.storage` causes a loop) */
    ],
  )

  useEffect(() => {
    if (url) {
      downloadImage(url)
    }
  }, [url, downloadImage])

  return (
    <div>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          width={size}
          height={size}
        />
      ) : (
        <div
          className="avatar no-image"
          style={{ height: size, width: size }}
        />
      )}
    </div>
  )
}
