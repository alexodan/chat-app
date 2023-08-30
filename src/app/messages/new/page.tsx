'use client'

import { css } from '../../../../styled-system/css'
import ContactPreview from '@/components/ContactPreview'
import { useListContacts } from '@/app/domains/contacts/contacts.helpers'
import { WithSessionProps, withSession } from '@/components/hoc/withSession'

function NewMessagePage({ session }: WithSessionProps) {
  // TODO: does it make sense to have hooks in SSR (tho this has 'use client')
  const { sortedContacts } = useListContacts({
    userId: session.user.id,
  })

  return (
    <>
      <ul>
        {sortedContacts.map(contact => (
          <li
            key={contact.id}
            className={css({
              borderBottom: '0.5px solid teal',
              p: 4,
            })}
          >
            <ContactPreview contact={contact} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default withSession(NewMessagePage)
