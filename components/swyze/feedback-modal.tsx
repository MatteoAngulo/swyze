"use client"

import { useState } from "react"
import { X, Layout } from "lucide-react"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [selected, setSelected] = useState<string | null>(null)

  if (!isOpen) return null

  const options = [
    { id: "perfect", label: "Si, perfecto" },
    { id: "adjustments", label: "Con pequenos ajustes" },
    { id: "needs-work", label: "No, necesita mucho trabajo" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-swyze-surface-dark border border-swyze-border p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-swyze-text-muted hover:text-swyze-text-primary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-swyze-surface-light">
            <Layout className="h-6 w-6 text-swyze-text-muted" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-swyze-text-primary font-sans">
              Publicarias este carrusel tal como esta?
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`w-full flex items-center gap-4 rounded-xl border p-4 transition-all ${
                selected === option.id
                  ? "border-swyze-cyan bg-swyze-cyan/10"
                  : "border-swyze-border bg-swyze-surface-light hover:border-swyze-text-muted"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                  selected === option.id
                    ? "border-swyze-cyan"
                    : "border-swyze-text-muted"
                }`}
              >
                {selected === option.id && (
                  <div className="h-2.5 w-2.5 rounded-full bg-swyze-cyan" />
                )}
              </div>
              <span className="text-swyze-text-primary font-medium">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
