import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import LoginForm from "./login-form"
import { css } from "../../styled-system/css"

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div
      className={css({
        h: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minW: "320px",
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDir: "column",
          textAlign: "center",
        })}
      >
        <div>
          <h1 className={css({ fontSize: "3xl" })}>Welcome back!</h1>
          <p className={css({ fontSize: "sm", mb: 2 })}>Start messaging</p>
        </div>
        <div>
          <LoginForm session={session} />
        </div>
      </div>
    </div>
  )
}
