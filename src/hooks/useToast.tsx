import Toast from '@/components/common/Toast'
import { useCallback, useState } from 'react'

export default function useToast() {
  const [toastMessage, setToastMessage] = useState<string>()

  const toggleToast = useCallback((message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(undefined)
    }, 3000)
  }, [])

  return {
    toastMessage,
    toggleToast,
  }
}
