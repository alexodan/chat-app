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
import Button, { button } from "@/components/common/Button"
import Input, { input } from "@/components/common/Input"
import { css, cx } from "../../styled-system/css"
import Separator from "@/components/common/Separator"

export default function LoginForm({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isMagicLinkLogin, setIsMagicLinkLogin] = useState(false)

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
      {!isMagicLinkLogin && (
        <>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-login">
                <Input
                  fullWidth
                  userCss={css({ mb: 2, mt: 2 })}
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value)
                  }}
                />
              </label>
            </div>
            <div>
              <label htmlFor="password">
                <Input
                  fullWidth
                  userCss={css({ mb: 2 })}
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
              <Button fullWidth type="submit">
                Login
              </Button>
            </div>
            <div>
              <Link
                className={css({ fontSize: "xs", mb: 1 })}
                href="#" /* This one is a BONUS so skipping it for now */
              >
                Forgot password?
              </Link>
              <p className={css({ fontSize: "sm" })}>
                Don&lsquo;t have an account yet?{" "}
                <Link href="/register">Register</Link>
              </p>
            </div>
          </form>
          <Separator text="OR" userCss={css({ my: 4 })} />
        </>
      )}
      {!isMagicLinkLogin && (
        <Button
          fullWidth
          onClick={() => setIsMagicLinkLogin(!isMagicLinkLogin)}
        >
          Use magic link
        </Button>
      )}
      {isMagicLinkLogin && (
        <>
          <Auth
            supabaseClient={supabase}
            view="magic_link"
            showLinks={false}
            providers={[]}
            redirectTo="http://localhost:3000/auth/callback"
            appearance={{
              extend: false,
              className: {
                input: cx(css({ width: "100%", my: 2 }), input()),
                button: cx(css({ width: "100%", my: 2 }), button()),
              },
            }}
            localization={{
              variables: {
                magic_link: {
                  email_input_label: "Login with magic link",
                },
              },
            }}
          />
          <Separator text="OR" userCss={css({ mb: 2 })} />
          <Button
            fullWidth
            onClick={() => setIsMagicLinkLogin(!isMagicLinkLogin)}
            userCss={css({ mb: 2 })}
          >
            Use email/password
          </Button>
        </>
      )}
    </>
  )
}
