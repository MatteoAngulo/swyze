'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Video, 
  Mail,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const faqItems = [
  {
    question: '¿Cómo genero mi primer carrusel?',
    answer: 'Simplemente ve al Dashboard, escribe el tema de tu carrusel en el campo de texto, selecciona la cantidad de slides y la plataforma, y haz clic en "Generar carrusel". La IA creará el contenido automáticamente usando tu Brand Kit.'
  },
  {
    question: '¿Cómo configuro mi Brand Kit?',
    answer: 'Ve a la sección "Brand Kit" en el menú lateral. Allí podrás subir tu logo, definir los colores de tu marca, y seleccionar las tipografías. Estos elementos se aplicarán automáticamente a todos tus carruseles.'
  },
  {
    question: '¿Qué son los tokens y cómo funcionan?',
    answer: 'Los tokens son créditos que se consumen cada vez que generas un carrusel con IA. Cada plan incluye una cantidad mensual de tokens. Puedes ver tu uso actual en la sección "Billing & Tokens" y comprar más si los necesitas.'
  },
  {
    question: '¿Puedo editar un carrusel después de generarlo?',
    answer: 'Sí, una vez generado el carrusel puedes editarlo completamente. Puedes modificar textos, imágenes, colores, y el orden de los slides. También puedes duplicar slides o agregar nuevos manualmente.'
  },
  {
    question: '¿En qué formatos puedo exportar mis carruseles?',
    answer: 'Puedes exportar tus carruseles como imágenes PNG o JPG individuales, como PDF para presentaciones, o descargarlos optimizados directamente para Instagram, LinkedIn o TikTok con las dimensiones correctas.'
  },
  {
    question: '¿Cómo invito a miembros de mi equipo?',
    answer: 'En la sección "Invitar colegas" del menú lateral, puedes generar un enlace de referido o enviar invitaciones por email. Por cada colega que se una, ambos recibirán tokens extra.'
  },
]

const helpResources = [
  {
    title: 'Centro de Ayuda',
    description: 'Guías detalladas y tutoriales paso a paso',
    icon: Book,
    href: '#',
  },
  {
    title: 'Video Tutoriales',
    description: 'Aprende visualmente con nuestros videos',
    icon: Video,
    href: '#',
  },
  {
    title: 'Chat en Vivo',
    description: 'Habla con nuestro equipo de soporte',
    icon: MessageCircle,
    href: '#',
  },
  {
    title: 'Enviar Email',
    description: 'soporte@swyze.ai',
    icon: Mail,
    href: 'mailto:soporte@swyze.ai',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-foreground"
      >
        <span className="font-medium text-foreground">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        )}
      >
        <p className="text-muted-foreground">{answer}</p>
      </div>
    </div>
  )
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFAQ = faqItems.filter(
    item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold italic text-foreground">
          Centro de Ayuda
        </h1>
        <p className="mt-2 text-muted-foreground">
          Encuentra respuestas a tus preguntas o contacta con nuestro equipo de soporte.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar en las preguntas frecuentes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-14 pl-12 border-border bg-surface-1 text-foreground placeholder:text-muted-foreground focus-visible:ring-cyan"
        />
      </div>

      {/* Help Resources Grid */}
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        {helpResources.map((resource) => (
          <Link
            key={resource.title}
            href={resource.href}
            className="flex items-start gap-4 rounded-xl border border-border bg-surface-1 p-5 transition-all hover:border-cyan/50 hover:bg-surface-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2">
              <resource.icon className="h-5 w-5 text-cyan" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{resource.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="rounded-2xl border border-border bg-surface-1 p-6">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-5 w-5 text-cyan" />
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Preguntas Frecuentes
          </h2>
        </div>

        {filteredFAQ.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredFAQ.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No se encontraron resultados para tu búsqueda.</p>
            <Button
              variant="link"
              onClick={() => setSearchQuery('')}
              className="mt-2 text-cyan"
            >
              Ver todas las preguntas
            </Button>
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div className="mt-8 rounded-2xl border border-border bg-surface-1 p-6 text-center">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          ¿No encuentras lo que buscas?
        </h3>
        <p className="mt-2 text-muted-foreground">
          Nuestro equipo de soporte está disponible para ayudarte.
        </p>
        <Button className="mt-4 bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover">
          <MessageCircle className="mr-2 h-4 w-4" />
          Iniciar Chat
        </Button>
      </div>
    </div>
  )
}
