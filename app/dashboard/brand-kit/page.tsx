'use client'

import { useState, useEffect } from 'react'
import { Plus, Check, Palette, Type, Trash2, Loader2, Crown, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import {
  getBrandKits, createBrandKit, updateBrandKit, deleteBrandKit,
  setDefaultBrandKit, type BrandKit
} from '@/lib/supabase/brand-kits'

const fontOptions = [
  { value: 'inter', label: 'Inter', fontFamily: "'Inter', sans-serif" },
  { value: 'sora', label: 'Sora', fontFamily: "'Sora', sans-serif" },
  { value: 'playfair', label: 'Playfair Display', fontFamily: "'Playfair Display', serif" },
  { value: 'jakarta', label: 'Plus Jakarta Sans', fontFamily: "'Plus Jakarta Sans', sans-serif" },
]

const emptyKit = {
  name: 'Nuevo Brand Kit',
  primary_color: '#00D4FF',
  secondary_color: '#131313',
  accent_color: '#FEB528',
  font: 'sora',
  is_default: false,
}

export default function BrandKitPage() {
  const [kits, setKits] = useState<BrandKit[]>([])
  const [activeKit, setActiveKit] = useState<BrandKit | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Local editable state
  const [name, setName] = useState('')
  const [primary, setPrimary] = useState('')
  const [secondary, setSecondary] = useState('')
  const [accent, setAccent] = useState('')
  const [font, setFont] = useState('sora')

  useEffect(() => {
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) { setLoading(false); return }
        setUserId(user.id)
        getBrandKits(user.id).then(data => {
          setKits(data)
          if (data.length > 0) selectKit(data[0])
          setLoading(false)
        })
      })
    } catch { setLoading(false) }
  }, [])

  const selectKit = (kit: BrandKit) => {
    setActiveKit(kit)
    setName(kit.name)
    setPrimary(kit.primary_color)
    setSecondary(kit.secondary_color)
    setAccent(kit.accent_color)
    setFont(kit.font)
  }

  const handleCreate = async () => {
    if (!userId) return
    setSaving(true)
    try {
      const newKit = await createBrandKit(userId, { ...emptyKit })
      setKits(prev => [newKit, ...prev])
      selectKit(newKit)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleSave = async () => {
    if (!activeKit) return
    setSaving(true)
    try {
      const updated = await updateBrandKit(activeKit.id, {
        name, primary_color: primary, secondary_color: secondary,
        accent_color: accent, font,
      })
      setKits(prev => prev.map(k => k.id === updated.id ? updated : k))
      setActiveKit(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const handleDelete = async (kitId: string) => {
    if (!confirm('¿Eliminar este brand kit?')) return
    try {
      await deleteBrandKit(kitId)
      const remaining = kits.filter(k => k.id !== kitId)
      setKits(remaining)
      if (activeKit?.id === kitId) {
        if (remaining.length > 0) selectKit(remaining[0])
        else setActiveKit(null)
      }
    } catch (e) { console.error(e) }
  }

  const handleSetDefault = async (kitId: string) => {
    if (!userId) return
    await setDefaultBrandKit(userId, kitId)
    setKits(prev => prev.map(k => ({ ...k, is_default: k.id === kitId })))
    if (activeKit) setActiveKit({ ...activeKit, is_default: activeKit.id === kitId })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex gap-8">
      {/* Kits list */}
      <div className="w-64 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Tus Brand Kits</h2>
          <Button size="icon" variant="ghost" onClick={handleCreate} disabled={saving} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {kits.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">Sin brand kits aún</p>
              <Button size="sm" onClick={handleCreate} className="mt-2 bg-cyan text-primary-foreground hover:bg-cyan/90">
                Crear uno
              </Button>
            </div>
          ) : kits.map((kit) => (
            <button
              key={kit.id}
              onClick={() => selectKit(kit)}
              className={cn(
                'w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors',
                activeKit?.id === kit.id ? 'bg-surface-1 border border-cyan/30' : 'hover:bg-surface-1/50'
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: kit.primary_color }}>
                <span className="text-xs font-bold" style={{ color: kit.secondary_color }}>
                  {kit.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{kit.name}</p>
                {kit.is_default && <p className="text-xs text-cyan">Por defecto</p>}
              </div>
              {activeKit?.id === kit.id && <Check className="h-4 w-4 text-cyan shrink-0" />}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-surface-1 p-4">
          <div className="flex items-center gap-2 text-amber">
            <Crown className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Pro</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Kits ilimitados y fuentes personalizadas en el plan Pro.
          </p>
          <Button className="mt-4 w-full border-border bg-surface-2 text-foreground hover:bg-surface-1" variant="outline">
            Upgrade
          </Button>
        </div>
      </div>

      {/* Editor */}
      {activeKit ? (
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Editando</p>
              <h1 className="font-heading text-3xl font-bold text-foreground">{activeKit.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetDefault(activeKit.id)}
                disabled={activeKit.is_default}
                className="border-border bg-surface-2 text-foreground hover:bg-surface-1"
              >
                <Star className={cn("mr-2 h-4 w-4", activeKit.is_default ? "text-cyan fill-cyan" : "")} />
                {activeKit.is_default ? 'Por defecto' : 'Hacer default'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(activeKit.id)}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre del kit</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 border-border bg-surface-1 text-foreground"
                />
              </div>

              {/* Colors */}
              <section className="rounded-xl border border-border bg-surface-1 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5 text-cyan" />
                  <h3 className="font-heading text-lg font-semibold text-foreground">Colores</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Primary', desc: 'Fondo principal de los slides', value: primary, set: setPrimary },
                    { label: 'Secondary', desc: 'Color del texto principal', value: secondary, set: setSecondary },
                    { label: 'Accent', desc: 'Acentos, CTAs, decoraciones', value: accent, set: setAccent },
                  ].map(({ label, desc, value, set }) => (
                    <div key={label} className="flex items-center gap-4 rounded-lg bg-surface-2 p-3">
                      <div className="h-10 w-10 rounded-lg shrink-0 border border-border/50" style={{ backgroundColor: value }} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded bg-surface-0 px-2 py-1.5">
                        <span className="text-xs text-muted-foreground">#</span>
                        <Input
                          value={value.replace('#', '')}
                          onChange={(e) => set(`#${e.target.value}`)}
                          className="h-auto w-20 border-none bg-transparent p-0 text-sm font-mono text-foreground"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Font */}
              <section className="rounded-xl border border-border bg-surface-1 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Type className="h-5 w-5 text-cyan" />
                  <h3 className="font-heading text-lg font-semibold text-foreground">Tipografia</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {fontOptions.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFont(f.value)}
                      className={cn(
                        'rounded-lg border p-3 text-left transition-all',
                        font === f.value ? 'border-cyan bg-cyan/10' : 'border-border bg-surface-2 hover:border-foreground/30'
                      )}
                    >
                      <p className="font-semibold text-foreground text-sm" style={{ fontFamily: f.fontFamily }}>{f.label}</p>
                      {font === f.value && <div className="mt-1 h-1 w-4 rounded-full bg-cyan" />}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Preview */}
            <div className="sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview en vivo</span>
              </div>
              <div className="rounded-2xl border border-border bg-surface-1 p-4">
                <div
                  className="aspect-[4/5] rounded-xl p-6 flex flex-col relative overflow-hidden"
                  style={{ backgroundColor: primary }}
                >
                  {/* decorative circle */}
                  <svg className="absolute top-0 right-0" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="100" cy="20" r="80" fill={accent} opacity="0.15" />
                  </svg>
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${secondary}20` }}>
                    <span className="text-lg font-bold" style={{ color: secondary }}>{name.charAt(0)}</span>
                  </div>
                  <div className="relative z-10 mt-auto">
                    <p className="text-2xl font-bold leading-tight" style={{ color: secondary, fontFamily: fontOptions.find(f => f.value === font)?.fontFamily }}>
                      {name}
                    </p>
                    <div className="mt-2 h-1 w-12 rounded-full" style={{ backgroundColor: accent }} />
                    <p className="mt-3 text-sm opacity-60" style={{ color: secondary }}>
                      Tu contenido con esta paleta de colores.
                    </p>
                  </div>
                  <div className="relative z-10 mt-auto flex items-center justify-between pt-4">
                    <span className="text-xs opacity-50" style={{ color: secondary }}>@swyze_ai</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: i === 0 ? accent : secondary, opacity: i === 0 ? 1 : 0.3 }} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-muted-foreground">Los cambios se reflejan en tiempo real.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-border mt-8">
            <Button onClick={handleSave} disabled={saving} className="bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 px-8">
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : saved ? <><Check className="mr-2 h-4 w-4" />Guardado</> : 'Guardar kit'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No tienes brand kits aún.</p>
            <Button onClick={handleCreate} className="bg-cyan text-primary-foreground hover:bg-cyan/90">
              <Plus className="mr-2 h-4 w-4" />Crear primer kit
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
