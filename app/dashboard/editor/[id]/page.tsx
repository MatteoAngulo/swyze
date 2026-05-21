'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { toPng } from 'html-to-image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
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
  Send,
  Square,
  RectangleVertical,
  BarChart3,
  Lightbulb,
  Target,
  Rocket,
  Heart,
  Star,
  CheckCircle,
  TrendingUp,
  Users,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface SlideData {
  id: number
  headline: string
  body: string
  icon: string
}

const iconMap: Record<string, React.ElementType> = {
  chart: BarChart3,
  lightbulb: Lightbulb,
  target: Target,
  rocket: Rocket,
  heart: Heart,
  star: Star,
  check: CheckCircle,
  trending: TrendingUp,
  users: Users,
  zap: Zap,
}

const fontOptions = [
  { value: 'inter', label: 'Inter', style: 'Clean & Modern' },
  { value: 'sora', label: 'Sora', style: 'Tech & Bold' },
  { value: 'playfair', label: 'Playfair', style: 'Elegant' },
  { value: 'jakarta', label: 'Jakarta', style: 'Geometric' },
]

const colorPalettes = [
  { 
    id: 1, 
    name: 'Neon Tech', 
    colors: ['#0D0D0D', '#00D4FF', '#FF4081', '#1A1A1A'],
    primary: '#00D4FF',
    background: 'from-purple-900/80 via-purple-800/60 to-pink-900/40',
    textColor: 'white'
  },
  { 
    id: 2, 
    name: 'Minimal Coral', 
    colors: ['#F5F5F5', '#2A2A2A', '#E0E0E0', '#FF6B6B'],
    primary: '#FF6B6B',
    background: 'from-gray-100 via-gray-50 to-white',
    textColor: 'black'
  },
]

const defaultSlides: SlideData[] = [
  { id: 1, headline: 'Q3 Growth Metrics Analysed', body: 'User engagement increased by 42% following the implementation of the new AI-driven recommendation engine.', icon: 'chart' },
  { id: 2, headline: 'Key Performance Insights', body: 'Revenue growth exceeded expectations with a 28% increase compared to the previous quarter.', icon: 'trending' },
  { id: 3, headline: 'User Retention Strategies', body: 'Implementing personalized notifications led to a 35% improvement in daily active users.', icon: 'users' },
  { id: 4, headline: 'Future Roadmap', body: 'Q4 will focus on expanding our AI capabilities and launching new premium features.', icon: 'rocket' },
  { id: 5, headline: 'Take Action Today', body: 'Start implementing these strategies to see immediate improvements in your metrics.', icon: 'target' },
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
  const [aiInput, setAiInput] = useState('')
  const [history, setHistory] = useState<SlideData[][]>([defaultSlides])
  const [historyIndex, setHistoryIndex] = useState(0)
  
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const currentPalette = colorPalettes.find(p => p.id === selectedPalette) || colorPalettes[0]

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  // Load initial prompt from sessionStorage for new carousels
  useEffect(() => {
    if (resolvedParams?.id === 'new') {
      const storedPrompt = sessionStorage.getItem('carouselPrompt')
      if (storedPrompt) {
        try {
          const { prompt, brandKit, slides: slideCount, platform } = JSON.parse(storedPrompt)
          sessionStorage.removeItem('carouselPrompt')
          
          // Set format based on platform
          if (platform === 'instagram') setFormat('4:5')
          else if (platform === 'tiktok') setFormat('4:5')
          else setFormat('1:1')
          
          // Auto-generate with the prompt
          if (prompt) {
            setAiInput(prompt)
            // Send the message to generate
            sendMessage({ 
              text: prompt 
            }, { 
              body: { 
                slideCount: parseInt(slideCount) || 5,
                platform: platform || 'instagram',
                brandKit: brandKit || 'default'
              } 
            })
          }
        } catch {
          // Invalid stored data
        }
      }
    }
  }, [resolvedParams])

  // AI Chat integration
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/carousel/generate' }),
  })

  const isGenerating = status === 'streaming' || status === 'submitted'

  // Parse AI response to update slides
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant') {
        const textContent = lastMessage.parts
          ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
          .map(p => p.text)
          .join('') || ''
        
        try {
          // Try to find JSON in the response
          const jsonMatch = textContent.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            if (parsed.slides && Array.isArray(parsed.slides)) {
              const newSlides = parsed.slides.map((s: { headline: string; body: string; icon?: string }, i: number) => ({
                id: i + 1,
                headline: s.headline,
                body: s.body,
                icon: s.icon || 'chart'
              }))
              updateSlides(newSlides)
            }
          }
        } catch {
          // If parsing fails, the AI response wasn't valid JSON yet
        }
      }
    }
  }, [messages])

  const updateSlides = useCallback((newSlides: SlideData[]) => {
    setSlides(newSlides)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newSlides)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

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
      icon: 'lightbulb'
    }
    updateSlides([...slides, newSlide])
  }

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiInput.trim() || isGenerating) return
    
    sendMessage({ 
      text: aiInput 
    }, { 
      body: { 
        slideCount: slides.length,
        platform: format === '4:5' ? 'instagram' : 'linkedin',
        brandKit: currentPalette.name
      } 
    })
    setAiInput('')
  }

  const exportSlides = async () => {
    setIsExporting(true)
    const zip = new JSZip()
    
    try {
      for (let i = 0; i < slides.length; i++) {
        const slideRef = slideRefs.current[i]
        if (slideRef) {
          const dataUrl = await toPng(slideRef, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: '#0D0D0D'
          })
          const base64 = dataUrl.split(',')[1]
          zip.file(`slide-${i + 1}.png`, base64, { base64: true })
        }
      }
      
      const blob = await zip.generateAsync({ type: 'blob' })
      saveAs(blob, 'carousel-slides.zip')
    } catch (error) {
      console.error('[v0] Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const IconComponent = iconMap[slides[currentSlide - 1]?.icon || 'chart'] || BarChart3

  if (!resolvedParams) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-surface-0 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-heading text-lg font-semibold text-foreground">
            {resolvedParams.id === 'new' ? 'New Carousel' : 'Q3 Marketing Strategy Carousel'}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard/billing" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Zap className="h-4 w-4 text-cyan" />
            <span>1,250 Tokens</span>
          </Link>
          <Button 
            onClick={exportSlides}
            disabled={isExporting}
            className="bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export as ZIP
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - AI Chat */}
        <aside className="w-[320px] border-r border-border bg-surface-0 flex flex-col">
          {/* Generation Status */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                isGenerating ? "text-cyan" : "text-muted-foreground"
              )}>
                {isGenerating ? 'Generando' : 'Listo'}
              </span>
              <span className="text-sm text-muted-foreground">Slide {currentSlide} de {slides.length}</span>
            </div>
            <div className="h-1 w-full rounded-full bg-surface-2 overflow-hidden">
              <div 
                className="h-full rounded-full bg-cyan transition-all"
                style={{ width: `${(currentSlide / slides.length) * 100}%` }}
              />
            </div>
          </div>

          {/* AI Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="rounded-xl bg-surface-1 p-4">
                <p className="text-sm text-foreground leading-relaxed">
                  Carousel structure ready. I&apos;m applying the &apos;{currentPalette.name}&apos; brand palette now.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "rounded-xl p-4",
                    msg.role === 'user' 
                      ? "bg-cyan/10 border border-cyan/20" 
                      : "bg-surface-1"
                  )}
                >
                  <p className="text-sm text-foreground leading-relaxed">
                    {msg.parts
                      ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
                      .map(p => p.text)
                      .join('')
                      .slice(0, 200) || '...'}
                    {(msg.parts?.filter((p): p is { type: 'text'; text: string } => p.type === 'text').map(p => p.text).join('') || '').length > 200 && '...'}
                  </p>
                </div>
              ))
            )}
            
            {isGenerating && (
              <div className="flex items-center gap-2 text-cyan">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Generating content...</span>
              </div>
            )}
          </div>

          {/* Quick Actions & Input */}
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setAiInput('Cambiar los colores a tonos más vibrantes')}
                className="px-3 py-1.5 text-xs rounded-full border border-border bg-surface-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
              >
                Cambiar colores
              </button>
              <button 
                onClick={() => setAiInput(`Reescribe el slide ${currentSlide} con un tono más profesional`)}
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

        {/* Main Canvas */}
        <main className="flex-1 flex flex-col bg-surface-0/50">
          {/* Canvas Toolbar */}
          <div className="flex items-center justify-between border-b border-border bg-surface-0 px-6 py-3">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={undo}
                disabled={historyIndex === 0}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-cyan" />
              <span className="text-sm text-muted-foreground">Brand Kit Activo:</span>
              <span className="text-sm font-medium text-foreground">{currentPalette.name}</span>
            </div>

            <span className="text-sm text-muted-foreground">Slide {currentSlide} de {slides.length}</span>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative">
              {/* Navigation */}
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

              {/* Slide Preview - Editable */}
              <div 
                ref={(el) => { slideRefs.current[currentSlide - 1] = el }}
                className={cn(
                  "rounded-2xl p-8 flex flex-col bg-gradient-to-br",
                  currentPalette.background,
                  format === '1:1' ? 'w-[400px] h-[400px]' : 'w-[400px] h-[500px]'
                )}
              >
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan/20 mb-auto">
                  <IconComponent className="h-7 w-7 text-cyan" />
                </div>

                {/* Content - Editable */}
                <div>
                  {editingField?.slideId === slides[currentSlide - 1]?.id && editingField?.field === 'headline' ? (
                    <textarea
                      autoFocus
                      value={slides[currentSlide - 1]?.headline || ''}
                      onChange={(e) => handleTextEdit(slides[currentSlide - 1].id, 'headline', e.target.value)}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && setEditingField(null)}
                      className={cn(
                        "font-heading text-2xl font-bold leading-tight bg-transparent border-none outline-none resize-none w-full",
                        currentPalette.textColor === 'white' ? 'text-white' : 'text-gray-900'
                      )}
                      rows={2}
                    />
                  ) : (
                    <h2 
                      onClick={() => setEditingField({ slideId: slides[currentSlide - 1].id, field: 'headline' })}
                      className={cn(
                        "font-heading text-2xl font-bold leading-tight cursor-text hover:bg-white/10 rounded px-1 -mx-1 transition-colors",
                        currentPalette.textColor === 'white' ? 'text-white' : 'text-gray-900'
                      )}
                    >
                      {slides[currentSlide - 1]?.headline}
                    </h2>
                  )}
                  
                  {editingField?.slideId === slides[currentSlide - 1]?.id && editingField?.field === 'body' ? (
                    <textarea
                      autoFocus
                      value={slides[currentSlide - 1]?.body || ''}
                      onChange={(e) => handleTextEdit(slides[currentSlide - 1].id, 'body', e.target.value)}
                      onBlur={() => setEditingField(null)}
                      className={cn(
                        "mt-4 text-sm leading-relaxed bg-transparent border-none outline-none resize-none w-full",
                        currentPalette.textColor === 'white' ? 'text-white/70' : 'text-gray-600'
                      )}
                      rows={4}
                    />
                  ) : (
                    <p 
                      onClick={() => setEditingField({ slideId: slides[currentSlide - 1].id, field: 'body' })}
                      className={cn(
                        "mt-4 text-sm leading-relaxed cursor-text hover:bg-white/10 rounded px-1 -mx-1 transition-colors",
                        currentPalette.textColor === 'white' ? 'text-white/70' : 'text-gray-600'
                      )}
                    >
                      {slides[currentSlide - 1]?.body}
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between">
                  <span className={cn(
                    "text-xs",
                    currentPalette.textColor === 'white' ? 'text-white/50' : 'text-gray-400'
                  )}>
                    @swyze_ai
                  </span>
                  <div className="flex gap-1">
                    {slides.map((_, i) => (
                      <div 
                        key={i}
                        className={cn(
                          'h-2 w-2 rounded-full',
                          i + 1 === currentSlide ? 'bg-cyan' : currentPalette.textColor === 'white' ? 'bg-white/30' : 'bg-gray-300'
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
                    className={cn(
                      "h-full w-full flex items-end justify-center pb-1 bg-gradient-to-br",
                      currentPalette.background
                    )}
                  >
                    <span className={cn(
                      "text-[10px]",
                      currentPalette.textColor === 'white' ? 'text-white/50' : 'text-gray-400'
                    )}>
                      {i + 1}
                    </span>
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
                    'rounded-lg border p-3 text-left transition-all relative',
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
                    <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-cyan" />
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
