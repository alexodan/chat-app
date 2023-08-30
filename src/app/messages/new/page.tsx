'use client'

import { css } from '../../../../styled-system/css'
import ContactPreview from '@/components/ContactPreview'
import { useListContacts } from '@/app/domains/contacts/contacts.helpers'
import { UserContext } from '@/components/UserProvider'
import { useContext } from 'react'
import { redirect } from 'next/navigation'

function NewMessagePage() {
  const { user } = useContext(UserContext)

  if (!user) {
    redirect('/login')
  }

  // TODO: does it make sense to have hooks in SSR (tho this has 'use client')
  const { sortedContacts } = useListContacts({
    userId: user?.id,
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

export default NewMessagePage
