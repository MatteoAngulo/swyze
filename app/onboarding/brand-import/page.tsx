import Link from 'next/link'
import { Sparkles, Link as LinkIcon, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function OnboardingBrandImportPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        {/* Logo */}
        <div className="absolute left-8 top-8 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-cyan" />
          <span className="font-heading text-xl font-bold text-foreground">Swyze</span>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12 w-full max-w-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan">
              Brand Setup
            </span>
            <span className="text-xs font-semibold text-cyan">1 of 2</span>
          </div>
          <div className="h-1 w-full rounded-full bg-surface-2 overflow-hidden">
            <div className="h-full w-1/2 rounded-full bg-cyan" />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-lg text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl italic">
            Configura la marca<br />de tu primer cliente
          </h1>
          <p className="mt-4 text-muted-foreground">
            Ingresa la URL de su sitio y extraemos los colores y<br />logo automáticamente.
          </p>

          {/* Import Form */}
          <div className="mt-10 rounded-2xl border border-border bg-surface-1 p-6">
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://ejemplo.com"
                className="h-14 pl-12 border-border bg-surface-2 text-foreground placeholder:text-muted-foreground focus-visible:ring-cyan"
              />
            </div>
            <Button className="mt-4 w-full h-14 bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover text-base">
              <Sparkles className="mr-2 h-5 w-5" />
              IMPORT MY BRAND
            </Button>
          </div>

          {/* Alternative Options */}
          <div className="mt-8 flex items-center justify-between">
            <Link 
              href="/onboarding/brand-colors" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Manual setup
            </Link>
            <Link 
              href="/dashboard" 
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Do it later
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
