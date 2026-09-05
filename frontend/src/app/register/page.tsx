'use client'

import { useSignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'

import { Button } from '@/src/components/ui/button'

function clerkErrorMessage(err: unknown, fallback: string): string {
  const errors = (err as { errors?: Array<{ message?: string }> } | null)
    ?.errors

  return errors?.[0]?.message ?? fallback
}

export default function RegisterPage() {
  const router = useRouter()
  const { signUp, setActive } = useSignUp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationRequired, setVerificationRequired] = useState(false)
  const [code, setCode] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (!signUp) {
        throw new Error('Sign up is not ready yet.')
      }

      const nameParts = name.trim().split(/\s+/)
      const firstName = nameParts[0] ?? ''
      const lastName = nameParts.slice(1).join(' ')

      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })

        router.replace('/dashboard')
        return
      }

      if (result.status === 'missing_requirements') {
        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        })

        setVerificationRequired(true)
        return
      }

      setError('Unable to register.')
    } catch (err) {
      setError(clerkErrorMessage(err, 'Unable to register.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (!signUp) {
        throw new Error('Sign up is not ready yet.')
      }

      const result = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })

        router.replace('/dashboard')
      } else {
        setError('Unable to verify your email.')
      }
    } catch (err) {
      setError(clerkErrorMessage(err, 'Unable to verify your email.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (verificationRequired) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <form
          onSubmit={handleVerify}
          className="w-full max-w-sm rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verify your email
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the verification code we sent to {email || 'your email'}.
            </p>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Verification code
              <input
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                required
                autoComplete="one-time-code"
                inputMode="numeric"
                placeholder="000000"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </label>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify email'}
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start using StudySync with your own account.
          </p>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="name"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="new-password"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  )
}
