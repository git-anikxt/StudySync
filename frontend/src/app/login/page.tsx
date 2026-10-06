'use client'

import { useSignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, type FormEvent, useState } from 'react'

import {
  SocialAuthButtons,
  type SocialProvider,
} from '@/src/components/auth/social-auth-buttons'
import { Button } from '@/src/components/ui/button'

function clerkErrorMessage(err: unknown, fallback: string): string {
  const errors =
    typeof err === 'object' && err !== null && 'errors' in err
      ? (err as {
          errors?: Array<{ message?: string; longMessage?: string }>
        }).errors
      : undefined

  return (
    errors?.[0]?.longMessage ??
    errors?.[0]?.message ??
    (err instanceof Error ? err.message : fallback)
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, setActive } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [verification, setVerification] = useState<{
    phase: 'first' | 'second'
    strategy: 'email_code' | 'phone_code' | 'totp'
    label: string
  } | null>(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function finishSignIn(sessionId: string | null) {
    if (!sessionId) {
      setError('Sign in completed without a session. Please try again.')
      return
    }
    if (!setActive) {
      setError('Sign in is not ready yet. Please try again.')
      return
    }

    await setActive({ session: sessionId })
    router.replace(searchParams.get('next') ?? '/dashboard')
  }

  async function handleSocialSignIn(strategy: SocialProvider) {
    if (!signIn) {
      setError('Sign in is not ready yet. Please try again.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: searchParams.get('next') ?? '/dashboard',
      })
    } catch (err) {
      setError(clerkErrorMessage(err, 'Unable to start social sign-in.'))
      setIsSubmitting(false)
    }
  }

  async function startFirstFactor() {
    if (!signIn) return

    const factors = signIn.supportedFirstFactors ?? []
    const factor =
      factors.find((item) => item.strategy === 'email_code') ??
      factors.find((item) => item.strategy === 'phone_code')

    if (
      !factor ||
      (factor.strategy !== 'email_code' && factor.strategy !== 'phone_code')
    ) {
      setError('This account requires a sign-in method that this form does not support.')
      return
    }

    if (factor.strategy === 'email_code') {
      await signIn.prepareFirstFactor({
        strategy: 'email_code',
        emailAddressId: factor.emailAddressId,
      })
    } else {
      await signIn.prepareFirstFactor({
        strategy: 'phone_code',
        phoneNumberId: factor.phoneNumberId,
      })
    }
    setCode('')
    setVerification({
      phase: 'first',
      strategy: factor.strategy,
      label: factor.safeIdentifier,
    })
  }

  async function startSecondFactor() {
    if (!signIn) return

    const factors = signIn.supportedSecondFactors ?? []
    const factor =
      factors.find((item) => item.strategy === 'email_code') ??
      factors.find((item) => item.strategy === 'totp') ??
      factors.find((item) => item.strategy === 'phone_code')

    if (!factor) {
      setError('This account requires a verification method that this form does not support.')
      return
    }

    if (factor.strategy === 'email_code' || factor.strategy === 'phone_code') {
      await signIn.prepareSecondFactor({
        strategy: factor.strategy,
        ...(factor.strategy === 'email_code'
          ? { emailAddressId: factor.emailAddressId }
          : { phoneNumberId: factor.phoneNumberId }),
      })
    }

    setCode('')
    setVerification({
      phase: 'second',
      strategy: factor.strategy,
      label: 'your verification method',
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (!signIn) {
        throw new Error('Sign in is not ready yet.')
      }

      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === 'complete') {
        await finishSignIn(result.createdSessionId)
      } else if (result.status === 'needs_first_factor') {
        await startFirstFactor()
      } else if (result.status === 'needs_second_factor') {
        await startSecondFactor()
      } else if (result.status === 'needs_new_password') {
        setError('Your password needs to be updated before you can sign in. Contact support.')
      } else {
        setError(`Sign in could not continue (${result.status ?? 'unknown status'}).`)
      }
    } catch (err) {
      setError(clerkErrorMessage(err, 'Unable to log in.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!signIn || !verification) return

    setError('')
    setIsSubmitting(true)

    try {
      const result =
        verification.phase === 'first'
          ? verification.strategy === 'email_code'
            ? await signIn.attemptFirstFactor({
                strategy: 'email_code',
                code,
              })
            : await signIn.attemptFirstFactor({
                strategy: 'phone_code',
                code,
              })
          : await signIn.attemptSecondFactor({
              strategy: verification.strategy,
              code,
            })

      if (result.status === 'complete') {
        await finishSignIn(result.createdSessionId)
      } else if (result.status === 'needs_second_factor') {
        await startSecondFactor()
      } else if (result.status === 'needs_first_factor') {
        await startFirstFactor()
      } else {
        setError(`Verification could not continue (${result.status ?? 'unknown status'}).`)
      }
    } catch (err) {
      setError(clerkErrorMessage(err, 'Unable to verify your sign-in.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <form
        onSubmit={verification ? handleVerify : handleSubmit}
        className="w-full max-w-sm rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            {verification ? 'Verify your sign-in' : 'Log in'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {verification
              ? `Enter the verification code sent to ${verification.label}.`
              : 'Continue to your StudySync dashboard.'}
          </p>
        </div>

        <div className="grid gap-4">
          {verification ? (
            <label className="grid gap-2 text-sm font-medium">
              Verification code
              <input
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                required
                autoComplete="one-time-code"
                inputMode="numeric"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </label>
          ) : (
            <>
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
                  autoComplete="current-password"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </label>
            </>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? verification
                ? 'Verifying...'
                : 'Logging in...'
              : verification
                ? 'Verify and continue'
                : 'Log in'}
          </Button>

          {!verification && (
            <SocialAuthButtons
              disabled={isSubmitting}
              onAuthenticate={handleSocialSignIn}
            />
          )}
        </div>

        {verification ? (
          <button
            type="button"
            onClick={() => {
              setVerification(null)
              setCode('')
              setError('')
            }}
            className="mt-6 w-full text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Back to log in
          </button>
        ) : (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Need an account?{' '}
            <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
              Register
            </Link>
          </p>
        )}
      </form>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
