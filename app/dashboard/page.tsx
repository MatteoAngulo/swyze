'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Plus, Sparkles, Zap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { getUserCarousels, type CarouselRecord } from '@/lib/supabase/carousels'

const brandKits = [
  { id: 'default', name: 'Default Theme' },
  { id: 'neon', name: 'Neon Tech' },
  { id: 'minimal', name: 'Minimal' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [selectedBrandKit, setSelectedBrandKit] = useState('default')
  const [slides, setSlides] = useState('5')
  const [platform, setPlatform] = useState('instagram')
  const [isGenerating, setIsGenerating] = useState(false)
  const [userName, setUserName] = useState('')
  const [carousels, setCarousels] = useState<CarouselRecord[]>([])
  const [loadingCarousels, setLoadingCarousels] = useState(true)

  useEffect(() => {
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario')
          getUserCarousels(user.id).then(data => {
            setCarousels(data)
            setLoadingCarousels(false)
          }).catch(() => setLoadingCarousels(false))
        } else {
          setLoadingCarousels(false)
        }
      })
    } catch {
      setUserName('Demo User')
      setLoadingCarousels(false)
    }
  }, [])

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    sessionStorage.setItem('carouselPrompt', JSON.stringify({
      prompt, brandKit: selectedBrandKit, slides, platform
    }))
    router.push('/dashboard/editor/new')
  }

  return (
    <div className="max-w-4xl">
      <Alert className="mb-8 border-amber/30 bg-amber/10">
        <AlertCircle className="h-5 w-5 text-amber" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-foreground">
            Configura tu Brand Kit para que los carruseles salgan con los colores exactos.
          </span>
          <Link href="/dashboard/brand-kit" className="font-semibold text-cyan hover:underline">
            Configurar
          </Link>
        </AlertDescription>
      </Alert>

      <div className="mb-6">
        <h1 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
          Hola, {userName || 'Usuario'} <span className="text-xl">&#128075;</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ¿Que carrusel creamos hoy?
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface-1 p-5">
        <textarea
          placeholder="Ej: 5 tips para mejorar la retencion en tus videos de Instagram..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="w-full resize-none border-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm"
        />

        <div className="mt-4 flex flex-wrap items-end gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Brand Kit</span>
            <Select value={selectedBrandKit} onValueChange={setSelectedBrandKit}>
              <SelectTrigger className="w-[160px] h-10 border-border bg-surface-2 text-foreground text-sm">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {brandKits.map((kit) => (
                  <SelectItem key={kit.id} value={kit.id}>{kit.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Slides</span>
            <Select value={slides} onValueChange={setSlides}>
              <SelectTrigger className="w-[120px] h-10 border-border bg-surface-2 text-foreground text-sm">
                <SelectValue placeholder="Slides" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Slides</SelectItem>
                <SelectItem value="5">5 Slides</SelectItem>
                <SelectItem value="7">7 Slides</SelectItem>
                <SelectItem value="10">10 Slides</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Platform</span>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-[150px] h-10 border-border bg-surface-2 text-foreground text-sm">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram (4:5)</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="tiktok">TikTok (9:16)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="h-10 px-5 bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover disabled:opacity-50"
            >
              {isGenerating ? (
                <><Sparkles className="mr-2 h-4 w-4 animate-pulse" />Generando...</>
              ) : (
                'Generar carrusel'
              )}
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Mis Carruseles
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loadingCarousels ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : carousels.length > 0 ? (
            carousels.map((carousel) => (
              <Link
                key={carousel.id}
                href={`/dashboard/editor/${carousel.id}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface-1 transition-all hover:border-cyan/50"
              >
                <div
                  className="aspect-[4/5] flex items-center justify-center p-4"
                  style={{ backgroundColor: carousel.brand_kit?.primary || '#00D4FF' }}
                >
                  <p
                    className="text-center text-sm font-bold leading-tight"
                    style={{ color: carousel.brand_kit?.secondary || '#0D0D0D' }}
                  >
                    {carousel.title}
                  </p>
                </div>
                <div className="absolute left-3 top-3">
                  <span className="rounded-md bg-surface-2/90 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                    {(carousel.slides as unknown[]).length} slides
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground truncate">{carousel.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(carousel.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))
          ) : null}

          <Link
            href="/dashboard/editor/new"
            className="flex aspect-[4/5] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-1 transition-all hover:border-cyan/50 hover:bg-surface-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-2">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <span className="mt-4 text-sm font-medium text-muted-foreground">Crear nuevo</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
