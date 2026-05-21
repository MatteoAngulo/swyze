import Link from 'next/link'
import { Check, Zap, Crown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mes',
    description: 'Perfecto para probar la plataforma.',
    features: [
      '5 carruseles al mes',
      '1 Brand Kit',
      'Exportacion JPG',
      'Soporte por email',
    ],
    cta: 'Empezar gratis',
    popular: false,
  },
  {
    name: 'Starter',
    price: '$15',
    period: '/mes',
    description: 'Para creadores independientes.',
    features: [
      '50 carruseles al mes',
      '3 Brand Kits',
      'Exportacion JPG + PNG',
      'Sin marca de agua',
      'Soporte prioritario',
    ],
    cta: 'Comenzar ahora',
    popular: true,
  },
  {
    name: 'Pro',
    price: '$39',
    period: '/mes',
    description: 'Para equipos y agencias.',
    features: [
      'Carruseles ilimitados',
      'Brand Kits ilimitados',
      'Todos los formatos de exportacion',
      'API Access',
      'Soporte dedicado 24/7',
      'Colaboracion en equipo',
    ],
    cta: 'Contactar ventas',
    popular: false,
  },
]

export default function PricingPage() {
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
          <Link href="/pricing" className="text-sm font-medium text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/waitlist" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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
      <main className="relative z-10 px-8 py-16 lg:px-16">
        <div className="mx-auto max-w-5xl text-center">
          <Badge className="mb-4 border-cyan/30 bg-cyan/10 text-cyan">
            <Sparkles className="mr-1 h-3 w-3" />
            Pricing
          </Badge>
          <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
            Planes simples,{' '}
            <span className="text-cyan">resultados extraordinarios.</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Elige el plan que mejor se adapte a tus necesidades. Sin sorpresas, sin compromisos.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 ${
                plan.popular
                  ? 'border-cyan bg-surface-1 shadow-lg shadow-cyan/10'
                  : 'border-border bg-surface-1'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan text-primary-foreground">
                  Mas popular
                </Badge>
              )}
              
              <div className="flex items-center gap-2 mb-4">
                {plan.name === 'Free' && <Zap className="h-5 w-5 text-muted-foreground" />}
                {plan.name === 'Starter' && <Sparkles className="h-5 w-5 text-cyan" />}
                {plan.name === 'Pro' && <Crown className="h-5 w-5 text-amber" />}
                <h3 className="font-heading text-xl font-bold text-foreground">{plan.name}</h3>
              </div>

              <div className="mb-4">
                <span className="font-heading text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <p className="mb-6 text-sm text-muted-foreground">{plan.description}</p>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-cyan" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/auth/signup">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-cyan text-primary-foreground hover:bg-cyan/90 glow-cyan-hover'
                      : 'bg-surface-2 text-foreground hover:bg-surface-3'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ or Trust Section */}
        <div className="mx-auto mt-24 max-w-2xl text-center">
          <p className="text-sm text-muted-foreground">
            Todos los planes incluyen actualizaciones gratuitas, sin contratos a largo plazo.
            <br />
            Cancela en cualquier momento.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-surface-0 px-8 py-8 lg:px-16">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-heading text-lg font-bold text-foreground">Swyze</p>
          <p className="text-xs text-muted-foreground">
            2024 Swyze AI. The Sophisticated Catalyst for Creators.
          </p>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
