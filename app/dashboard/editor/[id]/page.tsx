'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toPng } from 'html-to-image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import {
  ArrowLeft, Undo2, Redo2, Check, Download, ChevronLeft, ChevronRight,
  Plus, Zap, Send, Square, RectangleVertical, Loader2,
  PanelLeftClose, PanelLeft, FileImage, FileCode, Archive, Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { SlideRenderer, type SlideData, type SlideLayout } from '@/components/swyze/slide-layouts'
import { createClient } from '@/lib/supabase/client'
import { saveCarousel, getCarousel, updateCarousel } from '@/lib/supabase/carousels'

const fontOptions = [
  { value: 'inter', label: 'Inter', style: 'Clean & Modern', fontFamily: "'Inter', sans-serif" },
  { value: 'sora', label: 'Sora', style: 'Tech & Bold', fontFamily: "'Sora', sans-serif" },
  { value: 'playfair', label: 'Playfair', style: 'Elegant', fontFamily: "'Playfair Display', serif" },
  { value: 'jakarta', label: 'Jakarta', style: 'Geometric', fontFamily: "'Plus Jakarta Sans', sans-serif" },
]

const colorPalettes = [
  {
    id: 1, name: 'Neon Tech',
    colors: ['#0D0D0D', '#00D4FF', '#FF4081', '#1A1A1A'],
    primary: '#00D4FF', secondary: '#0D0D0D', accent: '#FF4081',
  },
  {
    id: 2, name: 'Minimal Coral',
    colors: ['#F5F5F5', '#2A2A2A', '#E0E0E0', '#FF6B6B'],
    primary: '#FF6B6B', secondary: '#2A2A2A', accent: '#E0E0E0',
  },
]

const defaultSlides: SlideData[] = [
  { id: 1, headline: 'Q3 Growth Metrics Analysed', body: 'User engagement increased by 42% following the implementation of the new AI-driven recommendation engine.', icon: 'chart', layout: 'hero' },
  { id: 2, headline: 'Key Performance Insights', body: 'Revenue growth exceeded expectations with a 28% increase compared to the previous quarter.', icon: 'trending', layout: 'stats' },
  { id: 3, headline: 'User Retention Strategies', body: 'Implementing personalized notifications led to a 35% improvement in daily active users.', icon: 'users', layout: 'split' },
  { id: 4, headline: '"Focus on value, not vanity metrics"', body: 'The best growth comes from solving real problems for real people.', icon: 'lightbulb', layout: 'quote' },
  { id: 5, headline: 'Take Action Today', body: 'Start implementing these strategies to see immediate improvements in your metrics.', icon: 'target', layout: 'cta' },
]

export default function CarouselEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [slides, setSlides] = useState<SlideData[]>(defaultSlides)
  const [currentSlide, setCurrentSlide] = useState(1)
  const [selectedFont, setSelectedFont] = useState('sora')
  const [selectedPalette, setSelectedPalette] = useState(1)
  const [useBrandKit, setUseBrandKit] = useState(true)
  const [format, setFormat] = useState<'1:1' | '4:5'>('4:5')
  const [editingField, setEditingField] = useState<{ slideId: number; field: 'headline' | 'body' } | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [aiInput, setAiInput] = useState('')
  const [history, setHistory] = useState<SlideData[][]>([defaultSlides])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showColorEditor, setShowColorEditor] = useState(false)
  const [customColors, setCustomColors] = useState({
    primary: '#00D4FF',
    secondary: '#131313',
    accent: '#FEB528',
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const currentPalette = colorPalettes.find(p => p.id === selectedPalette) || colorPalettes[0]
  const currentFont = fontOptions.find(f => f.value === selectedFont) || fontOptions[1]

  const historyIndexRef = useRef(historyIndex)
  historyIndexRef.current = historyIndex

  const getColors = () => {
    if (useBrandKit) return customColors
    return { primary: currentPalette.primary, secondary: currentPalette.secondary, accent: currentPalette.accent }
  }

  const updateSlides = useCallback((newSlides: SlideData[]) => {
    setSlides(newSlides)
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndexRef.current + 1)
      newHistory.push(newSlides)
      setHistoryIndex(newHistory.length - 1)
      return newHistory
    })
  }, [])

  const generateCarousel = useCallback(async (prompt: string, slideCount: number, platform: string, brandKit: string) => {
    if (!prompt.trim() || isGenerating) return
    setIsGenerating(true)
    try {
      const res = await fetch('/api/carousel/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, slideCount, platform, brandKit }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      if (data.slides && Array.isArray(data.slides)) {
        const validLayouts: SlideLayout[] = ['hero', 'centered', 'split', 'quote', 'stats', 'cta']
        const newSlides: SlideData[] = data.slides.map((s: { headline: string; body: string; icon?: string; layout?: string }, i: number) => ({
          id: i + 1,
          headline: s.headline,
          body: s.body,
          icon: s.icon || 'chart',
          layout: (validLayouts.includes(s.layout as SlideLayout) ? s.layout : (i === 0 ? 'hero' : i === data.slides.length - 1 ? 'cta' : 'centered')) as SlideLayout,
        }))
        updateSlides(newSlides)
      }
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [isGenerating, updateSlides])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      let user = null
      try {
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        user = data.user
      } catch { /* Supabase not configured */ }
      if (!user) {
        setIsSaving(false)
        return
      }

      const brandKit = { ...getColors(), font: selectedFont }
      const title = slides[0]?.headline || 'Untitled Carousel'

      if (savedId) {
        await updateCarousel(savedId, {
          title, slides, brand_kit: brandKit,
          platform: format === '4:5' ? 'instagram' : 'linkedin',
          format,
        })
      } else {
        const result = await saveCarousel(
          user.id, title, slides, brandKit,
          format === '4:5' ? 'instagram' : 'linkedin', format
        )
        setSavedId(result.id)
      }
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (!resolvedParams) return

    if (resolvedParams.id === 'new') {
      const storedPrompt = sessionStorage.getItem('carouselPrompt')
      if (storedPrompt) {
        try {
          const { prompt, brandKit, slides: slideCount, platform } = JSON.parse(storedPrompt)
          sessionStorage.removeItem('carouselPrompt')
          if (platform === 'instagram' || platform === 'tiktok') setFormat('4:5')
          else setFormat('1:1')
          if (prompt) {
            setAiInput(prompt)
            generateCarousel(prompt, parseInt(slideCount) || 5, platform || 'instagram', brandKit || 'default')
          }
        } catch { /* invalid stored data */ }
      }
    } else if (resolvedParams.id !== 'new') {
      getCarousel(resolvedParams.id).then(carousel => {
        if (carousel) {
          const loadedSlides = (carousel.slides as SlideData[]).map(s => ({
            ...s,
            layout: s.layout || 'hero' as SlideLayout,
          }))
          setSlides(loadedSlides)
          setHistory([loadedSlides])
          setHistoryIndex(0)
          setSavedId(carousel.id)
          if (carousel.format) setFormat(carousel.format as '1:1' | '4:5')
          if (carousel.brand_kit) {
            setCustomColors({
              primary: carousel.brand_kit.primary,
              secondary: carousel.brand_kit.secondary,
              accent: carousel.brand_kit.accent,
            })
            if (carousel.brand_kit.font) setSelectedFont(carousel.brand_kit.font)
            setUseBrandKit(true)
          }
        }
      }).catch(() => { /* carousel not found, use defaults */ })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setSlides(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setSlides(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  const handleTextEdit = (slideId: number, field: 'headline' | 'body', value: string) => {
    const newSlides = slides.map(slide =>
      slide.id === slideId ? { ...slide, [field]: value } : slide
    )
    updateSlides(newSlides)
  }

  const addSlide = () => {
    const newSlide: SlideData = {
      id: slides.length + 1,
      headline: 'New Slide Title',
      body: 'Add your content here.',
      icon: 'lightbulb',
      layout: 'centered',
    }
    updateSlides([...slides, newSlide])
  }

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiInput.trim() || isGenerating) return
    generateCarousel(
      aiInput, slides.length,
      format === '4:5' ? 'instagram' : 'linkedin',
      useBrandKit ? 'Custom Brand Kit' : currentPalette.name
    )
    setAiInput('')
  }

  const exportAsZip = async () => {
    setIsExporting(true)
    const zip = new JSZip()
    try {
      for (let i = 0; i < slides.length; i++) {
        const slideRef = slideRefs.current[i]
        if (slideRef) {
          const dataUrl = await toPng(slideRef, { quality: 1, pixelRatio: 2, backgroundColor: getColors().primary })
          const base64 = dataUrl.split(',')[1]
          zip.file(`slide-${i + 1}.png`, base64, { base64: true })
        }
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      saveAs(blob, 'carousel-slides.zip')
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportSinglePng = async (slideIndex: number) => {
    setIsExporting(true)
    try {
      const slideRef = slideRefs.current[slideIndex]
      if (slideRef) {
        const dataUrl = await toPng(slideRef, { quality: 1, pixelRatio: 2, backgroundColor: getColors().primary })
        saveAs(dataUrl, `slide-${slideIndex + 1}.png`)
      }
    } catch (error) {
      console.error('Export PNG error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  if (!resolvedParams) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan" />
      </div>
    )
  }

  const colors = getColors()

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-surface-0 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-heading text-lg font-semibold text-foreground">
            {resolvedParams.id === 'new' ? 'Nuevo Carrusel' : slides[0]?.headline || 'Carousel'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isSaving}
            className="border-border text-foreground hover:bg-surface-1"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {savedId ? 'Guardado' : 'Guardar'}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isExporting} className="bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover">
                {isExporting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Exportando...</> : <><Download className="mr-2 h-4 w-4" />Export</>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={exportAsZip} className="cursor-pointer">
                <Archive className="mr-2 h-4 w-4" />
                <div><p>Export All as ZIP</p><p className="text-xs text-muted-foreground">All {slides.length} slides as PNG</p></div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => exportSinglePng(currentSlide - 1)} className="cursor-pointer">
                <FileImage className="mr-2 h-4 w-4" />
                <div><p>Current Slide as PNG</p><p className="text-xs text-muted-foreground">Slide {currentSlide} only</p></div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - AI Chat */}
        {!isSidebarCollapsed ? (
          <aside className="w-[320px] border-r border-border bg-surface-0 flex flex-col relative">
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface-1 text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-all"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </button>

            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <span className={cn("text-xs font-semibold uppercase tracking-wider", isGenerating ? "text-cyan" : "text-muted-foreground")}>
                  {isGenerating ? 'Generando' : 'Listo'}
                </span>
                <span className="text-sm text-muted-foreground">Slide {currentSlide} de {slides.length}</span>
              </div>
              <div className="h-1 w-full rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full rounded-full bg-cyan transition-all" style={{ width: `${(currentSlide / slides.length) * 100}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isGenerating ? (
                <div className="flex items-center gap-2 text-cyan">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Generando contenido...</span>
                </div>
              ) : (
                <div className="rounded-xl bg-surface-1 p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    Carrusel listo. Escribe un tema abajo para regenerar o refinar tus slides.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border space-y-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setAiInput('Hazlo más profesional y formal')}
                  className="px-3 py-1.5 text-xs rounded-full border border-border bg-surface-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
                >
                  Más profesional
                </button>
                <button
                  onClick={() => setAiInput(`Reescribe el slide ${currentSlide} con más impacto`)}
                  className="px-3 py-1.5 text-xs rounded-full border border-border bg-surface-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
                >
                  Reescribir slide
                </button>
              </div>

              <form onSubmit={handleAiSubmit} className="relative">
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Escribe instrucciones para la IA..."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-border bg-surface-1 px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan/50"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isGenerating || !aiInput.trim()}
                  className="absolute right-2 bottom-2 h-8 w-8 bg-transparent hover:bg-surface-2 disabled:opacity-50"
                >
                  <Send className="h-4 w-4 text-muted-foreground" />
                </Button>
              </form>
            </div>
          </aside>
        ) : (
          <div className="w-12 border-r border-border bg-surface-0 flex flex-col items-center pt-4">
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-1 text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-all"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Main Canvas */}
        <main className="flex-1 flex flex-col bg-surface-0/50">
          <div className="flex items-center justify-between border-b border-border bg-surface-0 px-6 py-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex === history.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-cyan" />
              <span className="text-sm text-muted-foreground">Brand Kit:</span>
              <span className="text-sm font-medium text-foreground">{useBrandKit ? 'Custom' : currentPalette.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">Slide {currentSlide} de {slides.length}</span>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative">
              <button
                onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
                disabled={currentSlide === 1}
                className="absolute left-[-60px] top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-1 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentSlide(Math.min(slides.length, currentSlide + 1))}
                disabled={currentSlide === slides.length}
                className="absolute right-[-60px] top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-1 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Slide Preview */}
              <div ref={(el) => { slideRefs.current[currentSlide - 1] = el }}>
                <SlideRenderer
                  slide={slides[currentSlide - 1]}
                  colors={colors}
                  fontFamily={currentFont.fontFamily}
                  format={format}
                  slideIndex={currentSlide - 1}
                  totalSlides={slides.length}
                  isEditing={editingField?.slideId === slides[currentSlide - 1]?.id ? { field: editingField.field } : null}
                  onStartEdit={(field) => setEditingField({ slideId: slides[currentSlide - 1].id, field })}
                  onTextChange={(field, value) => handleTextEdit(slides[currentSlide - 1].id, field, value)}
                  onEndEdit={() => setEditingField(null)}
                />
              </div>
            </div>
          </div>

          {/* Slide Thumbnails */}
          <div className="border-t border-border bg-surface-0 p-4">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={addSlide}
                className="flex h-20 w-16 items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface-1 text-muted-foreground hover:border-cyan/50 hover:text-cyan transition-all"
              >
                <Plus className="h-5 w-5" />
              </button>
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(i + 1)}
                  className={cn(
                    'h-20 w-16 rounded-lg overflow-hidden border-2 transition-all relative',
                    currentSlide === i + 1 ? 'border-cyan' : 'border-border hover:border-foreground/30'
                  )}
                >
                  <div
                    ref={(el) => { if (i !== currentSlide - 1) slideRefs.current[i] = el }}
                    className="h-full w-full"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <SlideRenderer
                      slide={slide}
                      colors={colors}
                      fontFamily={currentFont.fontFamily}
                      format={format}
                      slideIndex={i}
                      totalSlides={slides.length}
                      isThumbnail
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>

        {/* Right Panel - Settings */}
        <aside className="w-[280px] border-l border-border bg-surface-0 overflow-y-auto">
          <section className="p-4 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Format</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormat('1:1')}
                className={cn('flex flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all',
                  format === '1:1' ? 'border-cyan bg-cyan/10 text-foreground' : 'border-border bg-surface-1 text-muted-foreground hover:border-foreground/30'
                )}
              >
                <Square className="h-5 w-5" /><span className="text-sm">1:1</span>
              </button>
              <button
                onClick={() => setFormat('4:5')}
                className={cn('flex flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all',
                  format === '4:5' ? 'border-cyan bg-cyan/10 text-foreground' : 'border-border bg-surface-1 text-muted-foreground hover:border-foreground/30'
                )}
              >
                <RectangleVertical className="h-5 w-5" /><span className="text-sm">4:5</span>
              </button>
            </div>
          </section>

          <section className="p-4 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Typography</h3>
            <div className="grid grid-cols-2 gap-2">
              {fontOptions.map((font) => (
                <button
                  key={font.value}
                  onClick={() => setSelectedFont(font.value)}
                  className={cn('rounded-lg border p-3 text-left transition-all relative',
                    selectedFont === font.value ? 'border-cyan bg-cyan/10' : 'border-border bg-surface-1 hover:border-foreground/30'
                  )}
                >
                  <p className="font-semibold text-foreground" style={{ fontFamily: font.fontFamily }}>{font.label}</p>
                  <p className="text-xs text-muted-foreground">{font.style}</p>
                  {selectedFont === font.value && <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-cyan" />}
                </button>
              ))}
            </div>
          </section>

          <section className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color Palette</h3>
              <button onClick={() => setShowColorEditor(true)} className="text-xs text-cyan hover:underline">Edit</button>
            </div>
            <div className="flex items-center justify-between mb-4 rounded-lg bg-surface-1 p-3">
              <span className="text-sm text-foreground">Usar mi Brand Kit</span>
              <Switch checked={useBrandKit} onCheckedChange={setUseBrandKit} />
            </div>
            {useBrandKit ? (
              <div className="space-y-3">
                <div className="rounded-lg border border-cyan bg-cyan/10 p-3">
                  <div className="flex gap-1 mb-2">
                    <div className="h-6 flex-1 rounded" style={{ backgroundColor: customColors.primary }} />
                    <div className="h-6 flex-1 rounded" style={{ backgroundColor: customColors.secondary }} />
                    <div className="h-6 flex-1 rounded" style={{ backgroundColor: customColors.accent }} />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">Custom Brand Kit</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {colorPalettes.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => setSelectedPalette(palette.id)}
                    className={cn('w-full rounded-lg border p-3 transition-all',
                      selectedPalette === palette.id ? 'border-cyan bg-cyan/10' : 'border-border bg-surface-1 hover:border-foreground/30'
                    )}
                  >
                    <div className="flex gap-1 mb-2">
                      {palette.colors.map((color, i) => (
                        <div key={i} className="h-6 flex-1 rounded" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <p className="text-xs text-center text-muted-foreground">{palette.name}</p>
                  </button>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>

      {/* Color Editor Dialog */}
      <Dialog open={showColorEditor} onOpenChange={setShowColorEditor}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Brand Colors</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {[
              { key: 'primary' as const, label: 'Primary Color', desc: 'Fondo principal' },
              { key: 'secondary' as const, label: 'Secondary Color', desc: 'Texto principal' },
              { key: 'accent' as const, label: 'Accent Color', desc: 'Acentos y CTAs' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl border border-border" style={{ backgroundColor: customColors[key] }} />
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-surface-1 px-3 py-2">
                  <span className="text-xs text-muted-foreground">HEX</span>
                  <Input
                    value={customColors[key]}
                    onChange={(e) => setCustomColors({ ...customColors, [key]: e.target.value })}
                    className="h-auto w-20 border-none bg-transparent p-0 text-sm font-mono text-foreground"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowColorEditor(false)}>Cancel</Button>
            <Button
              onClick={() => { setUseBrandKit(true); setShowColorEditor(false) }}
              className="bg-cyan text-primary-foreground hover:bg-cyan/90"
            >
              Apply Colors
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
