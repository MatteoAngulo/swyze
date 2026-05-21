'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AlertCircle, Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

const recentCarousels = [
  {
    id: 1,
    title: 'Growth Hacks 2024',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=500&fit=crop',
    badge: 'AI-Generated',
  },
  {
    id: 2,
    title: 'UI Design Principles',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=500&fit=crop',
    badge: 'Pro',
  },
]

export default function DashboardPage() {
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
      <div className="mb-8">
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Hola, Valentina
        </h1>
        <p className="mt-1 text-muted-foreground">
          ¿Qué carrusel creamos hoy?
        </p>
      </div>

      {/* Generator Card */}
      <div className="rounded-2xl border border-border bg-surface-1 p-6">
        <Input
          placeholder="Ej: 5 tips para mejorar la retención en tus videos de Instagram..."
          className="h-14 border-none bg-surface-2 text-foreground placeholder:text-muted-foreground focus-visible:ring-cyan"
        />
        
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Brand Kit</span>
            <Select defaultValue="default">
              <SelectTrigger className="w-[140px] border-border bg-surface-2 text-foreground">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Theme</SelectItem>
                <SelectItem value="neon">Neon Tech</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Slides</span>
            <Select defaultValue="5">
              <SelectTrigger className="w-[100px] border-border bg-surface-2 text-foreground">
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

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Platform</span>
            <Select defaultValue="instagram">
              <SelectTrigger className="w-[140px] border-border bg-surface-2 text-foreground">
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
            <span className="text-sm text-muted-foreground">
              Tienes <span className="font-semibold text-foreground">12</span> tokens disponibles este mes
            </span>
            <Button className="bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover">
              Generar carrusel
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
