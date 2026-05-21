'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Palette, Clock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const features = [
  {
    icon: Palette,
    title: 'Identidad de marca intocable',
    description: 'Tus colores, tus tipografias y tu estilo aplicados automaticamente a cada creacion.',
  },
  {
    icon: Clock,
    title: 'Ahorra horas de diseno',
    description: 'Genera estructuras narrativas y visuales listas para publicar con un solo clic.',
  },
  {
    icon: Sparkles,
    title: 'Sin curva de aprendizaje',
    description: 'Una interfaz disenada para creadores enfocados en el contenido, no en los pixeles.',
  },
]

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push('/onboarding/brand-import')
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    // Simulate Google auth
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push('/onboarding/brand-import')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        {/* Left Column - Branding */}
        <div className="flex flex-col justify-between p-8 lg:p-16">
          {/* Logo */}
          <Link href="/" className="font-heading text-2xl font-bold text-foreground">
            Swyze
          </Link>

          {/* Main Content */}
          <div className="py-12">
            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl">
              Carruseles que convierten.{' '}
              <span className="text-cyan">En segundos.</span>
            </h1>

            {/* Features */}
            <div className="mt-12 space-y-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-1">
                    <feature.icon className="h-5 w-5 text-cyan" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" />
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" />
                <AvatarFallback>U3</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-sm text-muted-foreground">
              Unete a mas de <span className="font-semibold text-foreground">5,000 creadores</span> pro.
            </p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="flex flex-col items-center justify-center border-l border-border bg-surface-0 p-8 lg:p-16">
          <div className="w-full max-w-md">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Crea tu cuenta gratis
            </h2>
            <p className="mt-2 text-muted-foreground">
              Comienza a disenar en segundos.
            </p>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError('')
                  }}
                  className={`h-12 border-border bg-surface-1 text-foreground placeholder:text-muted-foreground focus-visible:ring-cyan ${error ? 'border-red-500' : ''}`}
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
                {isLoading ? 'Cargando...' : 'CONTINUAR CON EMAIL'}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground">o</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Google Sign Up */}
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={handleGoogleSignUp}
              className="w-full h-12 border-border bg-surface-1 text-foreground hover:bg-white hover:text-black hover:border-white transition-all disabled:opacity-50"
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

            {/* Login Link */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Ya tienes una cuenta?{' '}
              <Link href="/auth/login" className="font-semibold text-cyan hover:underline">
                Inicia sesion
              </Link>
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-auto pt-8 flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <span>-</span>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
