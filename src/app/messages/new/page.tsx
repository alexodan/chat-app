'use client'

import { css } from '../../../../styled-system/css'
import ContactPreview from '@/components/ContactPreview'
import { redirect } from 'next/navigation'
import { useContactsPreview } from '@/app/domains/contacts/contacts.helpers'
import { useSupabase } from '@/components/SupabaseProvider'

export default function NewMessagePage() {
  const { session } = useSupabase()

  if (!session) {
    redirect('/login')
  }

  const { sortedContacts } = useContactsPreview({
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
