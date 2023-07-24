'use client'

import { Auth } from '@supabase/auth-ui-react'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button, { button } from '@/components/common/Button'
import Input, { input } from '@/components/common/Input'
import { css, cx } from '../../../styled-system/css'
import Separator from '@/components/common/Separator'
import ErrorMessage from '@/components/common/ErrorMessage'
import { useSupabase } from '@/components/SupabaseProvider'
import { useMutation } from '@tanstack/react-query'
import { SignInData } from '../auth/signin/route'
import axios, { AxiosResponse } from 'axios'
import { AuthError } from '@supabase/supabase-js'

export default function LoginForm() {
  const { supabase } = useSupabase()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isMagicLinkLogin, setIsMagicLinkLogin] = useState(false)

  const [errorMessage, setErrorMessage] = useState<string>()

  const mutation = useMutation({
    mutationFn: ({ email, password }: SignInData) => {
      return axios.post('/auth/signin', { email, password })
    },
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    mutation.mutate({ email, password })
  }

  useEffect(() => {
    if (window.location.hash.includes('error')) {
      const error = new URLSearchParams(window.location.hash)
      setErrorMessage(error.get('error_description') || 'Something went wrong')
    }
  }, [])

  if (mutation.isSuccess) {
    router.push('/messages')
    return null
  }

  return (
    <>
      {!isMagicLinkLogin && (
        <>
          <form onSubmit={handleSubmit}>
            <div>
              {/* Could be a TextField comp, given is little used I'll skip it for now */}
              <label htmlFor="email-login">Email</label>
              <Input
                fullWidth
                // onBlur={} // leavs the field
                required
                type="email"
                id="email-login"
                className={css({ mb: 2, mt: 2 })}
                placeholder="you@example.com"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                }}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Input
                fullWidth
                required
                placeholder="Password"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                }}
              />
            </div>
            {errorMessage || mutation.isError ? (
              <ErrorMessage>
                {errorMessage
                  ? errorMessage
                  : (mutation.error as AuthError).message}
              </ErrorMessage>
            ) : null}
            <div className={css({ mt: 3 })}>
              <Button
                isLoading={mutation.isLoading}
                fullWidth
                type="submit"
                disabled={mutation.isLoading}
              >
                Login
              </Button>
            </div>
            <div>
              <Link
                className={css({ fontSize: 'xs', mb: 1 })}
                href="#" /* This one is a BONUS so skipping it for now */
              >
                Forgot password?
              </Link>
              <p className={css({ fontSize: 'sm' })}>
                Don&lsquo;t have an account yet?{' '}
                <Link href="/register">Register</Link>
              </p>
            </div>
          </form>
          <Separator
            text="or"
            className={css({ my: 4, textTransform: 'uppercase' })}
          />
        </>
      )}
      {!isMagicLinkLogin && (
        <Button
          fullWidth
          onClick={() => setIsMagicLinkLogin(!isMagicLinkLogin)}
          disabled={mutation.isLoading}
          isLoading={mutation.isLoading}
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
                input: cx(css({ width: '100%', my: 2 }), input()),
                button: cx(css({ width: '100%', my: 2 }), button()),
              },
            }}
            localization={{
              variables: {
                magic_link: {
                  email_input_label: 'Login with magic link',
                },
              },
            }}
          />
          <Separator
            text="or"
            className={css({ mb: 2, textTransform: 'uppercase' })}
          />
          <Button
            fullWidth
            onClick={() => setIsMagicLinkLogin(!isMagicLinkLogin)}
            disabled={mutation.isLoading}
            isLoading={mutation.isLoading}
          >
            Use email/password
          </Button>
        </>
      )}
    </>
  )
}
