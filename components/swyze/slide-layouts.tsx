'use client'

import React from 'react'
import {
  BarChart3, Lightbulb, Target, Rocket, Heart, Star,
  CheckCircle, TrendingUp, Users, Zap, Quote
} from 'lucide-react'

export type SlideLayout = 'hero' | 'centered' | 'split' | 'quote' | 'stats' | 'cta'

export interface SlideData {
  id: number
  headline: string
  body: string
  icon: string
  layout: SlideLayout
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

interface SlideRendererProps {
  slide: SlideData
  colors: { primary: string; secondary: string; accent: string }
  fontFamily: string
  format: '1:1' | '4:5'
  slideIndex: number
  totalSlides: number
  isEditing?: { field: 'headline' | 'body' } | null
  onStartEdit?: (field: 'headline' | 'body') => void
  onTextChange?: (field: 'headline' | 'body', value: string) => void
  onEndEdit?: () => void
  isThumbnail?: boolean
}

function EditableText({
  value,
  field,
  isEditing,
  onStartEdit,
  onTextChange,
  onEndEdit,
  className,
  style,
  rows = 2,
  isThumbnail,
}: {
  value: string
  field: 'headline' | 'body'
  isEditing: boolean
  onStartEdit?: () => void
  onTextChange?: (value: string) => void
  onEndEdit?: () => void
  className: string
  style: React.CSSProperties
  rows?: number
  isThumbnail?: boolean
}) {
  if (isThumbnail) {
    return <div className={className} style={style}>{value}</div>
  }

  if (isEditing) {
    return (
      <textarea
        autoFocus
        value={value}
        onChange={(e) => onTextChange?.(e.target.value)}
        onBlur={onEndEdit}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onEndEdit?.()}
        className={`${className} bg-transparent border-none outline-none resize-none w-full`}
        style={style}
        rows={rows}
      />
    )
  }

  return (
    <div
      onClick={onStartEdit}
      className={`${className} cursor-text hover:bg-white/10 rounded px-1 -mx-1 transition-colors`}
      style={style}
    >
      {value}
    </div>
  )
}

function SlideFooter({
  slideIndex,
  totalSlides,
  textColor,
  accentColor,
}: {
  slideIndex: number
  totalSlides: number
  textColor: string
  accentColor: string
}) {
  return (
    <div className="mt-auto flex items-center justify-between">
      <span className="text-xs opacity-50" style={{ color: textColor }}>
        @swyze_ai
      </span>
      <div className="flex gap-1">
        {Array.from({ length: totalSlides }, (_, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: i === slideIndex ? accentColor : textColor,
              opacity: i === slideIndex ? 1 : 0.3,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function HeroLayout(props: SlideRendererProps) {
  const { slide, colors, fontFamily, isEditing, onStartEdit, onTextChange, onEndEdit, slideIndex, totalSlides, isThumbnail } = props
  const IconComponent = iconMap[slide.icon] || Zap

  return (
    <>
      {/* Decorative circle top-right */}
      <svg className="absolute top-0 right-0 overflow-hidden" width="160" height="160" viewBox="0 0 160 160">
        <circle cx="140" cy="20" r="100" fill={colors.accent} opacity="0.12" />
        <circle cx="150" cy="10" r="50" fill={colors.accent} opacity="0.08" />
      </svg>
      {/* Small decorative dots */}
      <svg className="absolute bottom-20 left-6" width="40" height="40" viewBox="0 0 40 40">
        {[0, 12, 24].map(x => [0, 12, 24].map(y => (
          <circle key={`${x}-${y}`} cx={x + 4} cy={y + 4} r="2" fill={colors.secondary} opacity="0.15" />
        )))}
      </svg>

      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-xl" style={{ backgroundColor: `${colors.secondary}20` }}>
        <IconComponent className="h-7 w-7" style={{ color: colors.secondary }} />
      </div>

      <div className="relative z-10 mt-auto">
        <EditableText
          value={slide.headline}
          field="headline"
          isEditing={isEditing?.field === 'headline'}
          onStartEdit={() => onStartEdit?.('headline')}
          onTextChange={(v) => onTextChange?.('headline', v)}
          onEndEdit={onEndEdit}
          className="text-2xl font-bold leading-tight"
          style={{ color: colors.secondary, fontFamily }}
          isThumbnail={isThumbnail}
        />
        <EditableText
          value={slide.body}
          field="body"
          isEditing={isEditing?.field === 'body'}
          onStartEdit={() => onStartEdit?.('body')}
          onTextChange={(v) => onTextChange?.('body', v)}
          onEndEdit={onEndEdit}
          className="mt-4 text-sm leading-relaxed opacity-70"
          style={{ color: colors.secondary, fontFamily }}
          rows={4}
          isThumbnail={isThumbnail}
        />
      </div>

      <SlideFooter slideIndex={slideIndex} totalSlides={totalSlides} textColor={colors.secondary} accentColor={colors.accent} />
    </>
  )
}

function CenteredLayout(props: SlideRendererProps) {
  const { slide, colors, fontFamily, isEditing, onStartEdit, onTextChange, onEndEdit, slideIndex, totalSlides, isThumbnail } = props
  const IconComponent = iconMap[slide.icon] || Zap

  return (
    <>
      {/* Top decorative line */}
      <svg className="absolute top-0 left-0 w-full" height="4">
        <rect width="100%" height="4" fill={colors.accent} opacity="0.6" />
      </svg>
      {/* Bottom decorative line */}
      <svg className="absolute bottom-0 left-0 w-full" height="4">
        <rect width="100%" height="4" fill={colors.accent} opacity="0.6" />
      </svg>
      {/* Corner accents */}
      <svg className="absolute top-4 left-4" width="24" height="24" viewBox="0 0 24 24">
        <path d="M0 12 L0 0 L12 0" fill="none" stroke={colors.accent} strokeWidth="2" opacity="0.4" />
      </svg>
      <svg className="absolute bottom-4 right-4" width="24" height="24" viewBox="0 0 24 24">
        <path d="M24 12 L24 24 L12 24" fill="none" stroke={colors.accent} strokeWidth="2" opacity="0.4" />
      </svg>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${colors.accent}25` }}>
          <IconComponent className="h-7 w-7" style={{ color: colors.accent }} />
        </div>

        <EditableText
          value={slide.headline}
          field="headline"
          isEditing={isEditing?.field === 'headline'}
          onStartEdit={() => onStartEdit?.('headline')}
          onTextChange={(v) => onTextChange?.('headline', v)}
          onEndEdit={onEndEdit}
          className="mt-6 text-2xl font-bold leading-tight"
          style={{ color: colors.secondary, fontFamily }}
          isThumbnail={isThumbnail}
        />
        <EditableText
          value={slide.body}
          field="body"
          isEditing={isEditing?.field === 'body'}
          onStartEdit={() => onStartEdit?.('body')}
          onTextChange={(v) => onTextChange?.('body', v)}
          onEndEdit={onEndEdit}
          className="mt-4 text-sm leading-relaxed opacity-70 max-w-[85%]"
          style={{ color: colors.secondary, fontFamily }}
          rows={4}
          isThumbnail={isThumbnail}
        />
      </div>

      <SlideFooter slideIndex={slideIndex} totalSlides={totalSlides} textColor={colors.secondary} accentColor={colors.accent} />
    </>
  )
}

function SplitLayout(props: SlideRendererProps) {
  const { slide, colors, fontFamily, isEditing, onStartEdit, onTextChange, onEndEdit, slideIndex, totalSlides, isThumbnail } = props
  const IconComponent = iconMap[slide.icon] || Zap

  return (
    <>
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl" style={{ backgroundColor: colors.accent }} />
      {/* Diagonal decorative line */}
      <svg className="absolute top-0 right-0 w-full h-full overflow-hidden" preserveAspectRatio="none">
        <line x1="60%" y1="0" x2="100%" y2="100%" stroke={colors.accent} strokeWidth="1" opacity="0.1" />
        <line x1="65%" y1="0" x2="105%" y2="100%" stroke={colors.accent} strokeWidth="1" opacity="0.06" />
      </svg>

      <div className="relative z-10 flex gap-5 flex-1">
        <div className="flex flex-col items-center pt-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${colors.accent}20` }}>
            <IconComponent className="h-6 w-6" style={{ color: colors.accent }} />
          </div>
          <div className="mt-3 w-px flex-1" style={{ backgroundColor: `${colors.secondary}15` }} />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <EditableText
            value={slide.headline}
            field="headline"
            isEditing={isEditing?.field === 'headline'}
            onStartEdit={() => onStartEdit?.('headline')}
            onTextChange={(v) => onTextChange?.('headline', v)}
            onEndEdit={onEndEdit}
            className="text-2xl font-bold leading-tight"
            style={{ color: colors.secondary, fontFamily }}
            isThumbnail={isThumbnail}
          />
          <EditableText
            value={slide.body}
            field="body"
            isEditing={isEditing?.field === 'body'}
            onStartEdit={() => onStartEdit?.('body')}
            onTextChange={(v) => onTextChange?.('body', v)}
            onEndEdit={onEndEdit}
            className="mt-4 text-sm leading-relaxed opacity-70"
            style={{ color: colors.secondary, fontFamily }}
            rows={4}
            isThumbnail={isThumbnail}
          />
        </div>
      </div>

      <SlideFooter slideIndex={slideIndex} totalSlides={totalSlides} textColor={colors.secondary} accentColor={colors.accent} />
    </>
  )
}

function QuoteLayout(props: SlideRendererProps) {
  const { slide, colors, fontFamily, isEditing, onStartEdit, onTextChange, onEndEdit, slideIndex, totalSlides, isThumbnail } = props

  return (
    <>
      {/* Large decorative quote marks */}
      <svg className="absolute top-6 left-6" width="60" height="48" viewBox="0 0 60 48">
        <text x="0" y="48" fontSize="72" fill={colors.accent} opacity="0.2" fontFamily="Georgia, serif">&ldquo;</text>
      </svg>
      <svg className="absolute bottom-16 right-6" width="60" height="48" viewBox="0 0 60 48">
        <text x="0" y="48" fontSize="72" fill={colors.accent} opacity="0.2" fontFamily="Georgia, serif">&rdquo;</text>
      </svg>
      {/* Subtle background gradient */}
      <div className="absolute inset-0 rounded-2xl" style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent}10 100%)`
      }} />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-6">
        <EditableText
          value={slide.headline}
          field="headline"
          isEditing={isEditing?.field === 'headline'}
          onStartEdit={() => onStartEdit?.('headline')}
          onTextChange={(v) => onTextChange?.('headline', v)}
          onEndEdit={onEndEdit}
          className="text-xl font-bold leading-snug italic"
          style={{ color: colors.secondary, fontFamily }}
          isThumbnail={isThumbnail}
        />
        <div className="my-4 h-px w-16" style={{ backgroundColor: colors.accent }} />
        <EditableText
          value={slide.body}
          field="body"
          isEditing={isEditing?.field === 'body'}
          onStartEdit={() => onStartEdit?.('body')}
          onTextChange={(v) => onTextChange?.('body', v)}
          onEndEdit={onEndEdit}
          className="text-sm leading-relaxed opacity-70"
          style={{ color: colors.secondary, fontFamily }}
          rows={4}
          isThumbnail={isThumbnail}
        />
      </div>

      <SlideFooter slideIndex={slideIndex} totalSlides={totalSlides} textColor={colors.secondary} accentColor={colors.accent} />
    </>
  )
}

function StatsLayout(props: SlideRendererProps) {
  const { slide, colors, fontFamily, isEditing, onStartEdit, onTextChange, onEndEdit, slideIndex, totalSlides, isThumbnail } = props
  const IconComponent = iconMap[slide.icon] || TrendingUp

  return (
    <>
      {/* Background grid pattern */}
      <svg className="absolute inset-0 w-full h-full" opacity="0.04">
        <defs>
          <pattern id={`grid-${slide.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={colors.secondary} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${slide.id})`} />
      </svg>
      {/* Accent circle behind stat */}
      <svg className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2" width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="70" fill={colors.accent} opacity="0.08" />
        <circle cx="70" cy="70" r="50" fill={colors.accent} opacity="0.05" />
      </svg>

      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${colors.accent}20` }}>
        <IconComponent className="h-5 w-5" style={{ color: colors.accent }} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        <EditableText
          value={slide.headline}
          field="headline"
          isEditing={isEditing?.field === 'headline'}
          onStartEdit={() => onStartEdit?.('headline')}
          onTextChange={(v) => onTextChange?.('headline', v)}
          onEndEdit={onEndEdit}
          className="text-4xl font-bold leading-none"
          style={{ color: colors.accent, fontFamily }}
          isThumbnail={isThumbnail}
        />
        <EditableText
          value={slide.body}
          field="body"
          isEditing={isEditing?.field === 'body'}
          onStartEdit={() => onStartEdit?.('body')}
          onTextChange={(v) => onTextChange?.('body', v)}
          onEndEdit={onEndEdit}
          className="mt-4 text-sm leading-relaxed opacity-70 max-w-[85%]"
          style={{ color: colors.secondary, fontFamily }}
          rows={4}
          isThumbnail={isThumbnail}
        />
      </div>

      <SlideFooter slideIndex={slideIndex} totalSlides={totalSlides} textColor={colors.secondary} accentColor={colors.accent} />
    </>
  )
}

function CtaLayout(props: SlideRendererProps) {
  const { slide, colors, fontFamily, isEditing, onStartEdit, onTextChange, onEndEdit, slideIndex, totalSlides, isThumbnail } = props

  return (
    <>
      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-2xl" style={{
        background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.accent}18 100%)`
      }} />
      {/* Decorative rings */}
      <svg className="absolute bottom-0 right-0" width="200" height="200" viewBox="0 0 200 200">
        <circle cx="180" cy="180" r="80" fill="none" stroke={colors.accent} strokeWidth="1" opacity="0.15" />
        <circle cx="180" cy="180" r="120" fill="none" stroke={colors.accent} strokeWidth="1" opacity="0.08" />
        <circle cx="180" cy="180" r="160" fill="none" stroke={colors.accent} strokeWidth="1" opacity="0.04" />
      </svg>
      <svg className="absolute top-0 left-0" width="80" height="80" viewBox="0 0 80 80">
        <circle cx="0" cy="0" r="60" fill="none" stroke={colors.accent} strokeWidth="1" opacity="0.1" />
      </svg>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <EditableText
          value={slide.headline}
          field="headline"
          isEditing={isEditing?.field === 'headline'}
          onStartEdit={() => onStartEdit?.('headline')}
          onTextChange={(v) => onTextChange?.('headline', v)}
          onEndEdit={onEndEdit}
          className="text-2xl font-bold leading-tight"
          style={{ color: colors.secondary, fontFamily }}
          isThumbnail={isThumbnail}
        />
        <EditableText
          value={slide.body}
          field="body"
          isEditing={isEditing?.field === 'body'}
          onStartEdit={() => onStartEdit?.('body')}
          onTextChange={(v) => onTextChange?.('body', v)}
          onEndEdit={onEndEdit}
          className="mt-4 text-sm leading-relaxed opacity-70 max-w-[85%]"
          style={{ color: colors.secondary, fontFamily }}
          rows={4}
          isThumbnail={isThumbnail}
        />

        {!isThumbnail && (
          <div
            className="mt-6 rounded-full px-8 py-3 text-sm font-bold"
            style={{
              backgroundColor: colors.accent,
              color: colors.primary,
            }}
          >
            Comienza ahora
          </div>
        )}
      </div>

      <SlideFooter slideIndex={slideIndex} totalSlides={totalSlides} textColor={colors.secondary} accentColor={colors.accent} />
    </>
  )
}

const layoutComponents: Record<SlideLayout, React.FC<SlideRendererProps>> = {
  hero: HeroLayout,
  centered: CenteredLayout,
  split: SplitLayout,
  quote: QuoteLayout,
  stats: StatsLayout,
  cta: CtaLayout,
}

export function SlideRenderer(props: SlideRendererProps) {
  const { slide, colors, format, isThumbnail } = props
  const layout = slide.layout || 'hero'
  const LayoutComponent = layoutComponents[layout] || HeroLayout

  return (
    <div
      className="rounded-2xl p-8 flex flex-col relative overflow-hidden"
      style={{
        width: isThumbnail ? '100%' : '400px',
        height: isThumbnail ? '100%' : (format === '1:1' ? '400px' : '500px'),
        backgroundColor: colors.primary,
        fontFamily: props.fontFamily,
      }}
    >
      <LayoutComponent {...props} />
    </div>
  )
}
