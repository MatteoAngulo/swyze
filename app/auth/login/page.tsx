'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      newErrors.email = 'Por favor ingresa tu correo electronico'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Por favor ingresa un correo electronico valido'
    }

    if (!password.trim()) {
      newErrors.password = 'Por favor ingresa tu contrasena'
    } else if (password.length < 6) {
      newErrors.password = 'La contrasena debe tener al menos 6 caracteres'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push('/dashboard')
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    // Simulate Google auth
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push('/dashboard')
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

        {/* Login Card */}
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface-1 p-8">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Bienvenido de vuelta
          </h1>
          <p className="mt-2 text-muted-foreground">
            Inicia sesion para continuar creando.
          </p>

          {/* Login Form */}
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
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
                }}
                className={`h-12 border-border bg-surface-2 text-foreground placeholder:text-muted-foreground focus-visible:ring-cyan ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm text-muted-foreground">
                  Contrasena
                </Label>
                <Link href="/auth/forgot-password" className="text-xs text-cyan hover:underline">
                  Olvidaste tu contrasena?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="--------"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
                }}
                className={`h-12 border-border bg-surface-2 text-foreground placeholder:text-muted-foreground focus-visible:ring-cyan ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover disabled:opacity-50"
            >
              {isLoading ? 'Cargando...' : 'INICIAR SESION'}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">o</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google Sign In */}
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
            className="w-full h-12 border-border bg-surface-2 text-foreground hover:bg-white hover:text-black hover:border-white transition-all disabled:opacity-50"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar con Google
          </Button>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            No tienes una cuenta?{' '}
            <Link href="/auth/signup" className="font-semibold text-cyan hover:underline">
              Registrate gratis
            </Link>
          </p>
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
