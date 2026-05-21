'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [carouselsPerMonth, setCarouselsPerMonth] = useState('')
  const [error, setError] = useState('')
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 lg:px-16">
        <Link href="/" className="font-heading text-2xl font-bold text-foreground">
          Swyze
        </Link>
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/waitlist" className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">
            Waitlist
          </Link>
        </nav>
        <nav className="flex items-center gap-6">
          <Link href="/auth/login" className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">
            Log in
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover">
              Prueba gratis
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 grid min-h-[calc(100vh-160px)] gap-16 px-8 py-16 lg:grid-cols-2 lg:px-16 lg:py-24">
        {/* Left Column - Text */}
        <div className="flex flex-col justify-center">
          {/* Coming Soon Badge */}
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan">
              Coming Soon
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            Crea carruseles virales en segundos.
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-md text-lg text-muted-foreground leading-relaxed">
            Swyze AI es el catalizador sofisticado para creadores. Unete a la lista de espera para obtener acceso anticipado y transformar tu estrategia de contenido.
          </p>

          {/* Waitlist Form */}
          <div className="mt-10 w-full max-w-md rounded-2xl border border-border bg-surface-1 p-6">
            {isSubmitted ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">Estas en la lista!</h3>
                <p className="mt-2 text-muted-foreground">Te notificaremos cuando estemos listos para ti.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Cuantos carruseles creas al mes?
                  </Label>
                  <Select value={carouselsPerMonth} onValueChange={setCarouselsPerMonth}>
                    <SelectTrigger className="h-12 border-border bg-surface-2 text-foreground">
                      <SelectValue placeholder="Selecciona una opcion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 carruseles</SelectItem>
                      <SelectItem value="6-15">6-15 carruseles</SelectItem>
                      <SelectItem value="16-30">16-30 carruseles</SelectItem>
                      <SelectItem value="30+">Mas de 30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="submit"
                  className="w-full h-12 bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover"
                >
                  Unete a la lista de espera
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column - Preview Card */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-sm">
            {/* Preview Card */}
            <div className="rounded-2xl border border-border bg-surface-1 p-6">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="h-10 w-10 rounded-lg bg-surface-2" />
                <span className="text-sm font-semibold text-muted-foreground">SWYZE</span>
              </div>
              
              {/* Content Skeleton */}
              <div className="space-y-4 py-8">
                <div className="h-4 w-3/4 rounded bg-surface-2" />
                <div className="h-4 w-1/2 rounded bg-surface-2" />
              </div>

              {/* Progress Bar */}
              <div className="mt-8 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Generando...</span>
                  <span>33%</span>
                </div>
                <div className="h-1 w-full rounded-full bg-surface-2 overflow-hidden">
                  <div className="h-full w-1/3 rounded-full bg-cyan animate-pulse" />
                </div>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-cyan/5 blur-xl" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-surface-0 px-8 py-8 lg:px-16">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-heading text-lg font-bold text-foreground">Swyze</p>
          <p className="text-xs text-muted-foreground text-center">
            2024 Swyze AI. The Sophisticated Catalyst for Creators.
          </p>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="https://twitter.com/swyze" className="hover:text-foreground">Twitter</Link>
            <Link href="/support" className="hover:text-foreground">Support</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
