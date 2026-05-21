'use client'

import { 
  Crown, 
  Zap, 
  AlertTriangle, 
  CreditCard, 
  Download,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const invoices = [
  { date: 'Sep 24, 2024', amount: '$15.00', plan: 'Starter', status: 'Paid' },
  { date: 'Aug 24, 2024', amount: '$15.00', plan: 'Starter', status: 'Paid' },
  { date: 'Jul 24, 2024', amount: '$15.00', plan: 'Starter', status: 'Paid' },
]

export default function BillingPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold italic text-foreground">
          Billing & Tokens
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your subscription, monitor AI token usage, and view your billing history.
        </p>
      </div>

      {/* Plan & Tokens Row */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Current Plan */}
        <div className="rounded-2xl border border-border bg-surface-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Plan
              </span>
              <Badge className="bg-cyan text-primary-foreground font-semibold">
                STARTER
              </Badge>
            </div>
            <Crown className="h-5 w-5 text-amber" />
          </div>

          <div className="mb-6">
            <span className="font-heading text-4xl font-bold text-foreground">$15</span>
            <span className="text-muted-foreground">/mo</span>
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Renews on <span className="text-foreground font-medium">Oct 24, 2024</span>
            </p>
            <Button variant="outline" className="border-border bg-surface-2 text-foreground hover:bg-surface-3">
              Change Plan
            </Button>
          </div>
        </div>

        {/* AI Token Usage */}
        <div className="rounded-2xl border border-border bg-surface-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              AI Token Usage
            </span>
            <Zap className="h-5 w-5 text-cyan" />
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-heading text-4xl font-bold text-foreground">8,450</span>
            <span className="text-muted-foreground">of 10,000 available</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden mb-4">
            <div className="h-full w-[84.5%] rounded-full bg-cyan" />
          </div>

          <div className="flex items-center gap-2 text-amber mb-4">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Running low. 84% utilized.</span>
          </div>

          <Button className="w-full bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover">
            Buy More Tokens
          </Button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="rounded-2xl border border-border bg-surface-1 p-6 mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Payment Method
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-16 items-center justify-center rounded-lg border border-border bg-surface-2">
              <CreditCard className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Visa ending in 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/2026</p>
            </div>
          </div>
          <Button variant="link" className="text-cyan hover:text-cyan/80">
            Update
          </Button>
        </div>
      </div>

      {/* Invoice History */}
      <div className="rounded-2xl border border-border bg-surface-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Invoice History
          </h3>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Amount
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Plan
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice, i) => (
              <TableRow key={i} className="border-border hover:bg-surface-2/50">
                <TableCell className="text-foreground">{invoice.date}</TableCell>
                <TableCell className="text-foreground">{invoice.amount}</TableCell>
                <TableCell className="text-foreground">{invoice.plan}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400">
                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-400" />
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <FileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
