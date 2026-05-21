'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ChevronDown, Sparkles, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

const projects = [
  {
    id: 1,
    title: 'Tech Launch Q3',
    brand: 'Acme Corp',
    date: 'Oct 24, 2024',
    slides: 8,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=400&h=500&fit=crop',
  },
  {
    id: 2,
    title: 'Holiday Campaign',
    brand: 'Global Retail',
    date: 'Today',
    slides: 5,
    status: 'generating',
    progress: 45,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop',
  },
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-heading text-4xl font-bold text-foreground">Proyectos</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your recent carousels and drafts.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-12 border-border bg-surface-1 text-foreground placeholder:text-muted-foreground focus-visible:ring-cyan"
          />
        </div>

        <Select defaultValue="all">
          <SelectTrigger className="w-[120px] h-12 border-border bg-surface-1 text-foreground">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Brand</SelectItem>
            <SelectItem value="acme">Acme Corp</SelectItem>
            <SelectItem value="global">Global Retail</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[120px] h-12 border-border bg-surface-1 text-foreground">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Platform</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="recent">
          <SelectTrigger className="w-[120px] h-12 border-border bg-surface-1 text-foreground">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Date</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/dashboard/editor/${project.id}`}
            className="group relative overflow-hidden rounded-xl border border-border bg-surface-1 transition-all hover:border-cyan/50"
          >
            <div className="aspect-[4/5] overflow-hidden relative">
              <Image
                src={project.image}
                alt={project.title}
                width={400}
                height={500}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              
              {/* Slides Badge */}
              <div className="absolute right-3 top-3">
                <Badge variant="secondary" className="bg-cyan text-primary-foreground font-medium">
                  {project.slides} SLIDES
                </Badge>
              </div>

              {/* Generating Overlay */}
              {project.status === 'generating' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-0/80 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-cyan">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span className="text-sm font-medium">GENERATING</span>
                    <span className="text-sm">{project.progress}%</span>
                  </div>
                  <div className="mt-3 h-1 w-32 rounded-full bg-surface-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-cyan transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="p-4">
              <h3 className="font-medium text-foreground truncate">{project.title}</h3>
              <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                <span>{project.brand}</span>
                <span>{project.date}</span>
              </div>
            </div>
          </Link>
        ))}

        {/* Skeleton Cards */}
        {[1, 2].map((i) => (
          <div
            key={`skeleton-${i}`}
            className="rounded-xl border border-border bg-surface-1 overflow-hidden"
          >
            <div className="aspect-[4/5] bg-surface-2 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-24 rounded bg-surface-2 animate-pulse" />
              <div className="flex justify-between">
                <div className="h-3 w-16 rounded bg-surface-2 animate-pulse" />
                <div className="h-3 w-12 rounded bg-surface-2 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
