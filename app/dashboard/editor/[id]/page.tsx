'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Undo2, 
  Redo2, 
  Check, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Zap,
  Sparkles,
  Send,
  Square,
  RectangleVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const fontOptions = [
  { value: 'inter', label: 'Inter', style: 'Clean & Modern' },
  { value: 'sora', label: 'Sora', style: 'Tech & Bold' },
  { value: 'playfair', label: 'Playfair', style: 'Elegant' },
  { value: 'jakarta', label: 'Jakarta', style: 'Geometric' },
]

const colorPalettes = [
  { id: 1, name: 'Neon Tech', colors: ['#0D0D0D', '#00D4FF', '#FF4081', '#1A1A1A'] },
  { id: 2, name: 'Minimal Coral', colors: ['#F5F5F5', '#2A2A2A', '#E0E0E0', '#FF6B6B'] },
]

export default function CarouselEditorPage() {
  const [currentSlide, setCurrentSlide] = useState(2)
  const [totalSlides] = useState(5)
  const [selectedFont, setSelectedFont] = useState('sora')
  const [selectedPalette, setSelectedPalette] = useState(1)
  const [useBrandKit, setUseBrandKit] = useState(true)
  const [format, setFormat] = useState<'1:1' | '4:5'>('4:5')

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-surface-0 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-heading text-lg font-semibold text-foreground">
            Q3 Marketing Strategy Carousel
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-cyan" />
            <span>1,250 Tokens</span>
          </div>
          <Button className="bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover">
            <Download className="mr-2 h-4 w-4" />
            Export as ZIP
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - AI Chat */}
        <aside className="w-[320px] border-r border-border bg-surface-0 flex flex-col">
          {/* Generation Status */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan">
                Generando
              </span>
              <span className="text-sm text-muted-foreground">Slide {currentSlide} de {totalSlides}</span>
            </div>
            <div className="h-1 w-full rounded-full bg-surface-2 overflow-hidden">
              <div 
                className="h-full rounded-full bg-cyan transition-all"
                style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
              />
            </div>
          </div>

          {/* AI Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* System Message */}
            <div className="rounded-xl bg-surface-1 p-4">
              <p className="text-sm text-foreground leading-relaxed">
                Carousel structure ready. I&apos;m applying the &apos;Neon Tech&apos; brand palette now.
              </p>
            </div>

            {/* User Request */}
            <div className="rounded-xl bg-cyan/10 border border-cyan/20 p-4">
              <p className="text-sm text-foreground leading-relaxed">
                Make the headlines punchier on slide 2.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-surface-1 transition-colors">
                Cambiar colores
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-surface-1 transition-colors">
                Reescribir slide
              </Badge>
            </div>
            
            {/* Input */}
            <div className="relative">
              <Input
                placeholder="Escribe instrucciones para la IA..."
                className="h-12 pr-12 border-border bg-surface-1 text-foreground placeholder:text-muted-foreground"
              />
              <Button 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-transparent hover:bg-surface-2"
              >
                <Send className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 flex flex-col bg-surface-0/50">
          {/* Canvas Toolbar */}
          <div className="flex items-center justify-between border-b border-border bg-surface-0 px-6 py-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-cyan" />
              <span className="text-sm text-muted-foreground">Brand Kit Activo:</span>
              <span className="text-sm font-medium text-foreground">Tech Startup</span>
            </div>

            <span className="text-sm text-muted-foreground">Slide {currentSlide} de {totalSlides}</span>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative">
              {/* Navigation */}
              <button 
                onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
                className="absolute left-[-60px] top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-1 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setCurrentSlide(Math.min(totalSlides, currentSlide + 1))}
                className="absolute right-[-60px] top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-1 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Slide Preview */}
              <div 
                className={cn(
                  "rounded-2xl bg-gradient-to-br from-purple-900/80 via-purple-800/60 to-pink-900/40 p-8 flex flex-col",
                  format === '1:1' ? 'w-[400px] h-[400px]' : 'w-[400px] h-[500px]'
                )}
              >
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan/20 mb-auto">
                  <svg className="h-7 w-7 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>

                {/* Content */}
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white leading-tight">
                    Q3 Growth Metrics Analysed
                  </h2>
                  <p className="mt-4 text-sm text-white/70 leading-relaxed">
                    User engagement increased by 42% following the implementation of the new AI-driven recommendation engine.
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-white/50">@swyze_ai</span>
                  <div className="flex gap-1">
                    {[...Array(totalSlides)].map((_, i) => (
                      <div 
                        key={i}
                        className={cn(
                          'h-2 w-2 rounded-full',
                          i + 1 === currentSlide ? 'bg-cyan' : 'bg-white/30'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Thumbnails */}
          <div className="border-t border-border bg-surface-0 p-4">
            <div className="flex items-center justify-center gap-3">
              <button className="flex h-20 w-16 items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface-1 text-muted-foreground hover:border-cyan/50 hover:text-cyan transition-all">
                <Plus className="h-5 w-5" />
              </button>
              {[...Array(totalSlides)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i + 1)}
                  className={cn(
                    'h-20 w-16 rounded-lg overflow-hidden border-2 transition-all',
                    currentSlide === i + 1 ? 'border-cyan' : 'border-border hover:border-foreground/30'
                  )}
                >
                  <div className="h-full w-full bg-gradient-to-br from-purple-900/80 via-purple-800/60 to-pink-900/40 flex items-end justify-center pb-1">
                    <span className="text-[10px] text-white/50">{i + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>

        {/* Right Panel - Settings */}
        <aside className="w-[280px] border-l border-border bg-surface-0 overflow-y-auto">
          {/* Format */}
          <section className="p-4 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Format
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormat('1:1')}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all',
                  format === '1:1' 
                    ? 'border-cyan bg-cyan/10 text-foreground' 
                    : 'border-border bg-surface-1 text-muted-foreground hover:border-foreground/30'
                )}
              >
                <Square className="h-5 w-5" />
                <span className="text-sm">1:1</span>
              </button>
              <button
                onClick={() => setFormat('4:5')}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all',
                  format === '4:5' 
                    ? 'border-cyan bg-cyan/10 text-foreground' 
                    : 'border-border bg-surface-1 text-muted-foreground hover:border-foreground/30'
                )}
              >
                <RectangleVertical className="h-5 w-5" />
                <span className="text-sm">4:5</span>
              </button>
            </div>
          </section>

          {/* Typography */}
          <section className="p-4 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Typography
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {fontOptions.map((font) => (
                <button
                  key={font.value}
                  onClick={() => setSelectedFont(font.value)}
                  className={cn(
                    'rounded-lg border p-3 text-left transition-all',
                    selectedFont === font.value
                      ? 'border-cyan bg-cyan/10'
                      : 'border-border bg-surface-1 hover:border-foreground/30'
                  )}
                >
                  <p className={cn(
                    'font-semibold text-foreground',
                    font.value === 'sora' && 'font-heading'
                  )}>
                    {font.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{font.style}</p>
                  {selectedFont === font.value && (
                    <div className="mt-1 h-1 w-1 rounded-full bg-cyan" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Color Palette */}
          <section className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Color Palette
              </h3>
              <button className="text-xs text-cyan hover:underline">Edit</button>
            </div>

            <div className="flex items-center justify-between mb-4 rounded-lg bg-surface-1 p-3">
              <span className="text-sm text-foreground">Usar mi Brand Kit</span>
              <Switch checked={useBrandKit} onCheckedChange={setUseBrandKit} />
            </div>

            <div className="space-y-3">
              {colorPalettes.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => setSelectedPalette(palette.id)}
                  className={cn(
                    'w-full rounded-lg border p-3 transition-all',
                    selectedPalette === palette.id
                      ? 'border-cyan bg-cyan/10'
                      : 'border-border bg-surface-1 hover:border-foreground/30'
                  )}
                >
                  <div className="flex gap-1 mb-2">
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        className="h-6 flex-1 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-center text-muted-foreground">{palette.name}</p>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
