import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { Database } from '@/types/supabase'
import { cookies } from 'next/headers'

export default async function MessagesPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    return redirect('/login')
  }

  const { data: contacts } = await supabase
    .from('contacts')
    .select('contact_id, user_id, contact_user_id')
    .eq('user_id', data.session.user.id)

  return (
    <>
      <h1>Messages</h1>
      <ul>
        {contacts?.map(contact => (
          <li key={contact.contact_id}>{contact.contact_user_id}</li>
        ))}
      </ul>
    </>
  )
}
