import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import AuthForm from "./login-form"

const Main = "div"

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <Main>
      <div>
        <h1>Welcome back!</h1>
        <p>Start messaging</p>
      </div>
      <div>
        <AuthForm session={session} />
      </div>
    </Main>
  )
}
