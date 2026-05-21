'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Por favor ingresa tu correo electronico')
      return
    }

    if (!validateEmail(email)) {
      setError('Por favor ingresa un correo electronico valido')
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        {/* Logo */}
        <Link href="/" className="mb-12 font-heading text-3xl font-bold text-foreground">
          Swyze
        </Link>

        {/* Card */}
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface-1 p-8">
          {!isSubmitted ? (
            <>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Recupera tu contrasena
              </h1>
              <p className="mt-2 text-muted-foreground">
                Ingresa tu correo electronico y te enviaremos un enlace para restablecer tu contrasena.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-muted-foreground">
                    Correo electronico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    className={`h-12 border-border bg-surface-2 text-foreground placeholder:text-muted-foreground focus-visible:ring-cyan ${error ? 'border-red-500' : ''}`}
                  />
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                </div>
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover disabled:opacity-50"
                >
                  {isLoading ? 'Enviando...' : 'ENVIAR ENLACE'}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan/10">
                  <CheckCircle className="h-8 w-8 text-cyan" />
                </div>
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Revisa tu bandeja de entrada
              </h1>
              <p className="mt-2 text-muted-foreground">
                Hemos enviado un enlace de recuperacion a <span className="font-semibold text-foreground">{email}</span>
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Si no ves el correo, revisa tu carpeta de spam.
              </p>
              <Button 
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail('')
                }}
                variant="outline"
                className="mt-6 border-border text-foreground hover:bg-transparent hover:border-white hover:text-white"
              >
                Enviar de nuevo
              </Button>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link 
              href="/auth/login" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a iniciar sesion
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <span>-</span>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
        </div>
      </div>
    </div>
  )
}
