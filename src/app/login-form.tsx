"use client"

import { Auth } from "@supabase/auth-ui-react"
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"
import { Database } from "../types/supabase"
import { useState } from "react"
import { redirect, useRouter } from "next/navigation"
import Link from "next/link"

export default function AuthForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginMagicLink, setLoginMagicLink] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error(error)
    } else {
      router.push("/messages")
    }
  }

  if (session) {
    return redirect("/messages")
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {!loginMagicLink && (
          <>
            <div>
              <label htmlFor="email">
                <input
                  placeholder="you@example.com"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value)
                  }}
                />
              </label>
            </div>
            <div>
              <label htmlFor="password">
                <input
                  placeholder="Password"
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                  }}
                />
              </label>
            </div>
            <div>
              <button type="submit">Login</button>
            </div>
            <div>
              {/* TODO: Bonus */}
              <a href="">Forgot password?</a>
            </div>
            <h2>OR</h2>
          </>
        )}
      </form>
      <button onClick={() => setLoginMagicLink(!loginMagicLink)}>
        {loginMagicLink
          ? "Login with email and password"
          : "Login with magic link"}
      </button>
      {loginMagicLink && (
        <Auth
          supabaseClient={supabase}
          view="magic_link"
          theme="dark"
          showLinks={false}
          providers={[]}
          redirectTo="http://localhost:3000/auth/callback"
        />
      )}
      <p>
        Don&lsquo;t have an account yet? <Link href="/register">Register</Link>
      </p>
    </>
  )
}
