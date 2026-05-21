'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Layers } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const categories = [
  'Todas',
  'Tips & Consejos',
  'Listicle',
  'How-to',
  'Caso de Estudio',
  'Promocional',
]

const templates = [
  {
    id: 1,
    title: 'Desglose de Marketing',
    category: 'How-to',
    slides: 6,
    isPro: false,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop',
  },
  {
    id: 2,
    title: '5 Pasos para Escalar',
    category: 'Listicle',
    slides: 10,
    isPro: true,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=500&fit=crop',
  },
  {
    id: 3,
    title: 'Estudio de Éxito B2B',
    category: 'Caso de Estudio',
    slides: 4,
    isPro: false,
    image: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=400&h=500&fit=crop',
  },
  {
    id: 4,
    title: 'Consejos Rápidos',
    category: 'Tips & Consejos',
    slides: 8,
    isPro: false,
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=500&fit=crop',
  },
]

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('Todas')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = activeCategory === 'Todas' || template.category === activeCategory
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-heading text-4xl font-bold text-foreground">Plantillas</h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Descubre puntos de partida diseñados profesionalmente para acelerar tu proceso creativo. Optimizado para carruseles de alto impacto.
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar plantillas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-12 border-border bg-surface-1 text-foreground placeholder:text-muted-foreground focus-visible:ring-cyan"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all',
              activeCategory === category
                ? 'bg-foreground text-background'
                : 'border border-border bg-surface-1 text-muted-foreground hover:text-foreground hover:border-foreground/50'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredTemplates.map((template) => (
          <Link
            key={template.id}
            href={`/dashboard/editor/new?template=${template.id}`}
            className="group relative overflow-hidden rounded-xl border border-border bg-surface-1 transition-all hover:border-cyan/50"
          >
            <div className="aspect-[4/5] overflow-hidden relative">
              <Image
                src={template.image}
                alt={template.title}
                width={400}
                height={500}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              
              {/* Badges */}
              <div className="absolute right-3 top-3 flex flex-col gap-2 items-end">
                {template.isPro && (
                  <Badge className="bg-cyan text-primary-foreground font-semibold">
                    PRO
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-surface-2/90 text-foreground backdrop-blur-sm">
                  <Layers className="mr-1 h-3 w-3" />
                  {template.slides} slides
                </Badge>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-4">
              <h3 className="font-medium text-foreground truncate">{template.title}</h3>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{template.category}</span>
                <div className="h-2 w-2 rounded-full bg-cyan" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
