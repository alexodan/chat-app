import { z } from 'zod'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type SignInData = z.infer<typeof SignInSchema>

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return new Response(null, { status: 404, statusText: 'Not Found' })
  }
  const body = await req.json()
  const { email, password } = body
  const result = SignInSchema.safeParse({
    email,
    password,
  })
  if (!result.success) {
    return NextResponse.json({ error: result.error.message }, { status: 400 })
  }
  const supabase = createRouteHandlerClient({ cookies })
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  // TODO: is there a way to normalize this type of responses? error: string
  return NextResponse.json(
    {
      data: {
        email,
        password,
      },
    },
    { status: 200 },
  )
}
