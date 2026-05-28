'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowLeft, ArrowRight, Zap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { createBrandKit } from '@/lib/supabase/brand-kits'

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
  const router = useRouter()
  const [colors, setColors] = useState(defaultColors)
  const [font, setFont] = useState('sora')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      await createBrandKit(user.id, {
        name: 'Mi Brand Kit',
        primary_color: colors.primary,
        secondary_color: colors.secondary,
        accent_color: colors.accent,
        font,
        is_default: true,
      })

      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id)

      router.push('/dashboard')
    } catch (e) {
      console.error(e)
      router.push('/dashboard')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 min-h-screen p-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-cyan" />
          <span className="font-heading text-xl font-bold text-foreground">Swyze</span>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-16 lg:grid-cols-2">
          {/* Form */}
          <div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan">Paso 2 de 2</span>
              </div>
              <div className="h-1 w-full rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full w-full rounded-full bg-cyan" />
              </div>
            </div>

            <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Ajusta los colores de marca
            </h1>
            <p className="mt-4 text-muted-foreground">
              Estos colores se aplicaran automaticamente a todos los slides para mantener la coherencia visual.
            </p>

            <section className="mt-10">
              <h2 className="font-heading text-xl font-semibold text-foreground">Colores</h2>
              <div className="mt-6 space-y-4">
                {[
                  { key: 'primary' as const, label: 'Primary Color', desc: 'Fondo principal, acentos fuertes' },
                  { key: 'secondary' as const, label: 'Secondary Color', desc: 'Texto, elementos secundarios' },
                  { key: 'accent' as const, label: 'Accent Color', desc: 'Botones, llamadas a la accion' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center gap-4 rounded-xl border border-border bg-surface-1 p-4">
                    <div className="h-12 w-12 rounded-xl" style={{ backgroundColor: colors[key] }} />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{label}</p>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2">
                      <span className="text-xs text-muted-foreground">HEX</span>
                      <Input
                        value={colors[key]}
                        onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                        className="h-auto w-24 border-none bg-transparent p-0 text-sm font-mono text-foreground"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-heading text-xl font-semibold text-foreground">Tipografia</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {fontOptions.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFont(f.value)}
                    className={`rounded-xl border p-4 text-left transition-all ${font === f.value ? 'border-cyan bg-cyan/10' : 'border-border bg-surface-1 hover:border-foreground/30'}`}
                  >
                    <p className="font-heading text-xl font-bold text-foreground">{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.style}</p>
                  </button>
                ))}
              </div>
            </section>

            <div className="mt-12 flex items-center justify-between">
              <Link href="/onboarding/brand-import" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Atras
              </Link>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="h-12 px-8 bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover"
              >
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : <>Guardar y empezar a crear<ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-cyan" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Preview</span>
                <div className="ml-auto flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
                </div>
              </div>
              <div className="aspect-[4/5] w-full rounded-2xl p-8 flex flex-col justify-between" style={{ backgroundColor: colors.primary }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/20">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-3xl font-bold leading-tight" style={{ color: colors.secondary }}>
                    El Futuro de la Creacion de Contenido.
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed opacity-80" style={{ color: colors.secondary }}>
                    Disenado para profesionales que demandan velocidad sin sacrificar calidad estetica.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: colors.secondary }}>@swyze_ai</span>
                  <div className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: colors.accent, color: colors.secondary }}>
                    PRO TIP
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">Los cambios se reflejan instantaneamente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
