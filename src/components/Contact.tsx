'use client'

import { css } from '../../styled-system/css'
import Link from 'next/link'

type Props = {
  chatId: string
  contact: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}

export default function Contact({ chatId, contact }: Props) {
  return (
    <div
      className={css({
        borderBottom: '1px solid gray',
        height: 12,
        padding: 1,
      })}
    >
      <li>
        <Link href={`/messages/${chatId}`}>
          <div>
            {contact.full_name} - Chat id: {chatId}
          </div>
        </Link>
      </li>
    </div>
  )
}
