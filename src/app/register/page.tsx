import { redirect } from "next/navigation"
import RegisterForm from "./register-form"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/supabase"
import { cookies } from "next/headers"

export default async function Register() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    return redirect("/")
  }

  return <RegisterForm session={session} />
}
