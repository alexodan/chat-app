'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Button from '@/components/common/Button'
import { css } from '../../../styled-system/css'
import Input from '@/components/common/Input'
import ErrorMessage from '@/components/common/ErrorMessage'
import { useSupabase } from '@/components/SupabaseProvider'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useMutation } from '@tanstack/react-query'

function useSignUp() {
  const { supabase } = useSupabase()

  async function signUp({
    email,
    username,
    password,
  }: {
    email: string
    username: string
    password: string
  }) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return useMutation(signUp)
}

export default function RegisterForm() {
  const { session } = useSupabase()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errorMessage, setErrorMessage] = useState<string>()
  const { mutateAsync, isLoading } = useSignUp()

  const { email, username, password, confirmPassword } = formData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match")
    } else {
      const { error } = await mutateAsync({ email, username, password })
      if (error) {
        setErrorMessage(error.message)
      } else {
        toast.success('Account created successfully, check your email inbox!', {
          position: 'top-center',
          autoClose: 3000,
          closeOnClick: true,
        })
      }
    }
  }

  if (session) {
    redirect('/messages')
  }

  return (
    <div
      className={css({
        h: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDir: 'column',
        minW: '320px',
        w: '50%',
        m: '0 auto',
      })}
    >
      <ToastContainer />
      <h2 className={css({ fontSize: '2xl', mb: 2 })}>Register</h2>
      <form onSubmit={handleSubmit} className={css({ width: '100%' })}>
        <label>
          Username
          <Input
            label="Email"
            aria-label="Email"
            required
            fullWidth
            className={css({ mb: 2 })}
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </label>
        <label>
          Email
          <Input
            label="Email"
            aria-label="Email"
            required
            fullWidth
            className={css({ mb: 2 })}
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password
          <Input
            label="Password"
            aria-label="Password"
            required
            fullWidth
            className={css({ mb: 2 })}
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </label>
        <label>
          Confirm Password
          <Input
            label="Confirm password"
            aria-label="Confirm password"
            required
            fullWidth
            className={css({ mb: 2 })}
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
        </label>
        <ErrorMessage>{errorMessage}</ErrorMessage>
        <Button
          className={css({ width: '100%', my: 4 })}
          size="md"
          type="submit"
          isLoading={isLoading}
        >
          Register
        </Button>
      </form>
      <p className={css({ fontSize: 'sm' })}>
        Already have an account? <Link href="/">Sign in</Link>
      </p>
    </div>
  )
}
