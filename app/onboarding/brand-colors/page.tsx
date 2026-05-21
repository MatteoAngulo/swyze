'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft, ArrowRight, Pencil, Zap } from 'lucide-react'
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

const defaultColors = {
  primary: '#00D4FF',
  secondary: '#131313',
  accent: '#FEB528',
}

const fontOptions = [
  { value: 'sora', label: 'Sora', style: 'Tech & Bold' },
  { value: 'inter', label: 'Inter', style: 'Clean & Modern' },
  { value: 'playfair', label: 'Playfair', style: 'Elegant' },
  { value: 'jakarta', label: 'Jakarta', style: 'Geometric' },
]

export default function OnboardingBrandColorsPage() {
  const [colors, setColors] = useState(defaultColors)
  const [headingFont, setHeadingFont] = useState('sora')
  const [bodyFont, setBodyFont] = useState('jakarta')

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 min-h-screen p-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-cyan" />
          <span className="font-heading text-xl font-bold text-foreground">Swyze</span>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-16 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div>
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan">
                  Paso 2 de 2
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full w-full rounded-full bg-cyan" />
              </div>
            </div>

            <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Ajusta los colores de marca
            </h1>
            <p className="mt-4 text-muted-foreground">
              Estos colores se aplicarán automáticamente a todos los slides para mantener la coherencia visual.
            </p>

            {/* Colors Section */}
            <section className="mt-10">
              <h2 className="font-heading text-xl font-semibold text-foreground">Colores</h2>
              <div className="mt-6 space-y-4">
                {/* Primary Color */}
                <div className="flex items-center gap-4 rounded-xl border border-border bg-surface-1 p-4">
                  <div 
                    className="h-12 w-12 rounded-xl" 
                    style={{ backgroundColor: colors.primary }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Primary Color</p>
                    <p className="text-sm text-muted-foreground">Fondo principal, acentos fuertes</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2">
                    <span className="text-xs text-muted-foreground">HEX</span>
                    <Input
                      value={colors.primary}
                      onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                      className="h-auto w-24 border-none bg-transparent p-0 text-sm font-mono text-foreground"
                    />
                  </div>
                </div>

                {/* Secondary Color */}
                <div className="flex items-center gap-4 rounded-xl border border-border bg-surface-1 p-4">
                  <div 
                    className="h-12 w-12 rounded-xl" 
                    style={{ backgroundColor: colors.secondary }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Secondary Color</p>
                    <p className="text-sm text-muted-foreground">Texto, elementos secundarios</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2">
                    <span className="text-xs text-muted-foreground">HEX</span>
                    <Input
                      value={colors.secondary}
                      onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                      className="h-auto w-24 border-none bg-transparent p-0 text-sm font-mono text-foreground"
                    />
                  </div>
                </div>

                {/* Accent Color */}
                <div className="flex items-center gap-4 rounded-xl border border-border bg-surface-1 p-4">
                  <div 
                    className="h-12 w-12 rounded-xl" 
                    style={{ backgroundColor: colors.accent }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Accent Color</p>
                    <p className="text-sm text-muted-foreground">Botones, llamadas a la acción</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2">
                    <span className="text-xs text-muted-foreground">HEX</span>
                    <Input
                      value={colors.accent}
                      onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                      className="h-auto w-24 border-none bg-transparent p-0 text-sm font-mono text-foreground"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Typography Section */}
            <section className="mt-10">
              <h2 className="font-heading text-xl font-semibold text-foreground">Tipografía</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* Headings Font */}
                <div className="rounded-xl border border-border bg-surface-1 p-4">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Headings
                  </Label>
                  <Select value={headingFont} onValueChange={setHeadingFont}>
                    <SelectTrigger className="mt-2 h-auto border-none bg-transparent p-0">
                      <div className="text-left">
                        <p className="font-heading text-2xl font-bold text-cyan">
                          {fontOptions.find(f => f.value === headingFont)?.label}
                        </p>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span className="font-medium">{font.label}</span>
                          <span className="ml-2 text-muted-foreground">- {font.style}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-4 rounded-lg bg-surface-2 p-3">
                    <p className="font-heading text-lg font-bold text-foreground">
                      El zorro ágil salta.
                    </p>
                  </div>
                </div>

                {/* Body Font */}
                <div className="rounded-xl border border-border bg-surface-1 p-4">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    Body
                  </Label>
                  <Select value={bodyFont} onValueChange={setBodyFont}>
                    <SelectTrigger className="mt-2 h-auto border-none bg-transparent p-0">
                      <div className="text-left">
                        <p className="text-xl font-medium text-foreground">
                          Plus Jakarta
                        </p>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span className="font-medium">{font.label}</span>
                          <span className="ml-2 text-muted-foreground">- {font.style}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-4 rounded-lg bg-surface-2 p-3">
                    <p className="text-sm text-muted-foreground truncate">
                      El rápido zorro marrón salta sobre el p...
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Navigation */}
            <div className="mt-12 flex items-center justify-between">
              <Link 
                href="/onboarding/brand-import" 
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Atrás
              </Link>
              <Link href="/dashboard">
                <Button className="h-12 px-8 bg-transparent border border-cyan text-cyan font-semibold hover:bg-cyan/10">
                  Guardar y empezar a crear
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Live Preview */}
          <div>
            <div className="sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-cyan" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Live Preview
                </span>
                <div className="ml-auto flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-cyan" />
                  <div className="h-2 w-2 rounded-full bg-surface-2" />
                  <div className="h-2 w-2 rounded-full bg-surface-2" />
                </div>
              </div>

              {/* Preview Card */}
              <div 
                className="aspect-[4/5] w-full rounded-2xl p-8 flex flex-col justify-between"
                style={{ backgroundColor: colors.primary }}
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/20">
                  <Zap className="h-6 w-6 text-white" />
                </div>

                {/* Content */}
                <div>
                  <h3 
                    className="font-heading text-3xl font-bold leading-tight"
                    style={{ color: colors.secondary }}
                  >
                    El Futuro de la Creación de Contenido.
                  </h3>
                  <p 
                    className="mt-4 text-sm leading-relaxed opacity-80"
                    style={{ color: colors.secondary }}
                  >
                    Diseñado para profesionales que demandan velocidad sin sacrificar calidad estética.
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-black/30" />
                    <span className="text-sm" style={{ color: colors.secondary }}>@swyze_pro</span>
                  </div>
                  <div 
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ backgroundColor: colors.accent, color: colors.secondary }}
                  >
                    PRO TIP
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Los cambios se reflejan instantáneamente en el canvas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
