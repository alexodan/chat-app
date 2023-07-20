import { z } from 'zod'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { AuthError } from '@supabase/supabase-js'

// sign in schema
export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// FFA everyone is public / private option
// how to add a contact?
// - email
// - accepts -> it creates the record in contacts table (2 records u 1 u 2)

// list of online users - online/offline -> ping (the server pings the browser) / (supabase) lambda-edge functions runs on server

export type SignInData = z.infer<typeof SignInSchema>

export async function POST(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return new Response(null, { status: 404, statusText: 'Not Found' })
  }
  const { email, password } = await req.json()
  const result = SignInSchema.safeParse({
    email,
    password,
  })
  if (!result.success) {
    return new Response(
      JSON.stringify({ error: new AuthError('Wrong credentials', 401) }),
      {
        status: 401,
      },
    )
  }
  const supabase = createRouteHandlerClient({ cookies })
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error === null) {
    return new Response(JSON.stringify({ data }), {
      status: 200,
    })
  } else {
    return new Response(JSON.stringify({ error }), {
      status: 404,
    })
  }
}
