'use client'

import { useState } from 'react'
import { 
  Mail, 
  Users, 
  Zap, 
  Copy, 
  Check,
  MessageSquare,
  Calendar,
  AtSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const invitations = [
  { 
    email: 'alex.m@agency.com', 
    initials: 'AM',
    date: 'Hoy, 10:42 AM', 
    status: 'pending', 
    reward: null 
  },
  { 
    email: 'sarah.ruiz@design.studio', 
    initials: 'SR',
    date: 'Ayer', 
    status: 'registered', 
    reward: '+500' 
  },
]

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false)
  const referralLink = 'https://swyze.ai/ref/creator-pro-x92j'

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl">
      {/* Header Badge */}
      <div className="mb-6">
        <Badge variant="outline" className="border-border bg-surface-1 text-muted-foreground">
          <Zap className="mr-1 h-3 w-3" />
          Programa de Referidos V-14
        </Badge>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-foreground">
          Gana tokens gratis{' '}
          <span className="text-cyan">invitando colegas</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Acelera tu flujo de creación. Por cada colega que se registre y cree su primer carrusel, ambos recibirán un bonus de 500 tokens de IA. No hay límite de invitaciones.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {/* Invited */}
        <div className="rounded-2xl border border-border bg-surface-1 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Invitados
              </p>
              <p className="font-heading text-4xl font-bold text-foreground">24</p>
            </div>
            <Mail className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        {/* Registered */}
        <div className="rounded-2xl border border-border bg-surface-1 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Registrados
              </p>
              <p className="font-heading text-4xl font-bold text-foreground">8</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        {/* Tokens Earned */}
        <div className="rounded-2xl border border-cyan/30 bg-cyan/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan mb-2">
                Tokens Ganados
              </p>
              <p className="font-heading text-4xl font-bold text-cyan">4,000</p>
            </div>
            <Zap className="h-8 w-8 text-cyan" />
          </div>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className="rounded-2xl border border-border bg-surface-1 p-6 mb-8">
        <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
          Tu enlace único
        </h2>
        <div className="flex gap-4">
          <Input
            value={referralLink}
            readOnly
            className="h-12 flex-1 border-border bg-surface-2 text-foreground font-mono"
          />
          <Button 
            onClick={handleCopy}
            className="h-12 px-6 bg-foreground text-background font-semibold hover:bg-foreground/90"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                COPY LINK
              </>
            )}
          </Button>
        </div>

        {/* Share Options */}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Compartir en:</span>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10 border-border bg-surface-2 hover:bg-surface-3">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 border-border bg-surface-2 hover:bg-surface-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 border-border bg-surface-2 hover:bg-surface-3">
              <AtSign className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* Invitations Table */}
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
          Estado de invitaciones
        </h2>
        <div className="rounded-2xl border border-border bg-surface-1 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Colega
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Fecha
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Estado
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                  Recompensa
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((inv, i) => (
                <TableRow key={i} className="border-border hover:bg-surface-2/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-amber text-primary-foreground text-xs font-semibold">
                          {inv.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground">{inv.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                  <TableCell>
                    {inv.status === 'pending' ? (
                      <Badge variant="outline" className="border-amber/50 bg-amber/10 text-amber">
                        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-amber" />
                        Pendiente
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-cyan/50 bg-cyan/10 text-cyan">
                        <Check className="mr-1 h-3 w-3" />
                        Registrado
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {inv.reward ? (
                      <span className="font-semibold text-cyan">{inv.reward}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
