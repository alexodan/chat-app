import { css } from '../../styled-system/css'
import Link from 'next/link'
import { uuid } from 'uuidv4'

type Props = {
  contact: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}

export default function Contact({ contact }: Props) {
  const chatId = uuid()
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
          <div>{contact.full_name}</div>
        </Link>
      </li>
    </div>
  )
}
