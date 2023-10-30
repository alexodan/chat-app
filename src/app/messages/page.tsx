import Button from '@/components/common/Button'
import Link from 'next/link'
import Image from 'next/image'
import { css } from '../../../styled-system/css'
import MessagePreviewList from '@/components/MessagePreviewList'

async function MessagesPage() {
  return (
    <>
      <MessagePreviewList />
      <Button
        fullWidth={false}
        className={css({ position: 'absolute', bottom: '4', right: '4' })}
      >
        <Link href="/messages/new">
          <Image
            src="/message.svg"
            alt="New conversation"
            height={30}
            width={30}
          />
        </Link>
      </Button>
    </>
  )
}

export default MessagesPage
