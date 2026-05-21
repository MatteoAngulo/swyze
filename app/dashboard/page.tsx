'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AlertCircle, Plus, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Mock data - in a real app this would come from an API/database
const userData = {
  name: 'Valentina',
  tokensAvailable: 12,
  tokensTotal: 50,
}

const brandKits = [
  { id: 'default', name: 'Default Theme' },
  { id: 'neon', name: 'Neon Tech' },
  { id: 'minimal', name: 'Minimal' },
]

const recentCarousels = [
  {
    id: 1,
    title: 'Growth Hacks 2024',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=500&fit=crop',
    badge: 'AI-Generated',
    createdAt: '2024-10-20',
  },
  {
    id: 2,
    title: 'UI Design Principles',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=500&fit=crop',
    badge: 'Pro',
    createdAt: '2024-10-18',
  },
]

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('')
  const [selectedBrandKit, setSelectedBrandKit] = useState('default')
  const [slides, setSlides] = useState('5')
  const [platform, setPlatform] = useState('instagram')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    // Simulate generation - in real app this would call an API
    setTimeout(() => {
      setIsGenerating(false)
      // Would redirect to editor with new carousel
    }, 2000)
  }

  const tokenPercentage = (userData.tokensAvailable / userData.tokensTotal) * 100

  return (
    <div className="max-w-4xl">
      {/* Brand Kit Alert */}
      <Alert className="mb-8 border-amber/30 bg-amber/10">
        <AlertCircle className="h-5 w-5 text-amber" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-foreground">
            Configura tu Brand Kit para que los carruseles salgan con los colores exactos.
          </span>
          <Link 
            href="/dashboard/brand-kit" 
            className="font-semibold text-cyan hover:underline"
          >
            Configurar
          </Link>
        </AlertDescription>
      </Alert>

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
          Hola, {userData.name} <span className="text-xl">&#128075;</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ¿Qué carrusel creamos hoy?
        </p>
      </div>

      {/* Generator Card */}
      <div className="rounded-2xl border border-border bg-surface-1 p-5">
        {/* Textarea for prompt */}
        <textarea
          placeholder="Ej: 5 tips para mejorar la retención en tus videos de Instagram..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="w-full resize-none border-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm"
        />
        
        {/* Options Row */}
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

          <div className="ml-auto flex items-center gap-4">
            <Link 
              href="/dashboard/billing" 
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Zap className="h-3.5 w-3.5 text-cyan" />
              <span>
                Tienes <span className="font-semibold text-foreground">{userData.tokensAvailable}</span> tokens disponibles este mes
              </span>
            </Link>
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="h-10 px-5 bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  Generando...
                </>
              ) : (
                'Generar carrusel'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Carousels */}
      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Recent Carousels
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentCarousels.map((carousel) => (
            <Link
              key={carousel.id}
              href={`/dashboard/editor/${carousel.id}`}
              className="group relative overflow-hidden rounded-xl border border-border bg-surface-1 transition-all hover:border-cyan/50"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <Image
                  src={carousel.image}
                  alt={carousel.title}
                  width={400}
                  height={500}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              {/* Badge */}
              <div className="absolute left-3 top-3">
                <span className="rounded-md bg-surface-2/90 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                  {carousel.badge}
                </span>
              </div>
              {/* Title */}
              <div className="p-4">
                <h3 className="font-medium text-foreground truncate">{carousel.title}</h3>
              </div>
            </Link>
          ))}

          {/* Create Blank */}
          <Link
            href="/dashboard/editor/new"
            className="flex aspect-[4/5] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-1 transition-all hover:border-cyan/50 hover:bg-surface-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-2">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <span className="mt-4 text-sm font-medium text-muted-foreground">Create Blank</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
