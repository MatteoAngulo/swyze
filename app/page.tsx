import Link from "next/link";
import { Sparkles, Zap, Settings, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 lg:px-16">
        <Link
          href="/"
          className="font-heading text-2xl font-bold text-foreground"
        >
          Swyze
        </Link>
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/waitlist"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Waitlist
          </Link>
        </nav>
        <nav className="flex items-center gap-6">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
          >
            Log in
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover">
              Prueba gratis
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center px-8 pt-16 lg:pt-24">
        {/* Badge */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-border bg-surface-1 px-4 py-2">
          <Sparkles className="h-4 w-4 text-cyan" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            AI-Powered Carousel Generator
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-center font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
          Carruseles con tu marca,{" "}
          <span className="text-cyan">en minutos.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 max-w-xl text-center text-lg text-muted-foreground">
          Generados por IA con tus colores y tipografías exactas. Listos para
          publicar.
        </p>

        {/* Generator Card */}
        <div className="mt-12 w-full max-w-2xl rounded-2xl border border-border bg-surface-1 p-6">
          <Input
            placeholder="Describe el tema de tu carrusel..."
            className="mb-4 h-14 border-none bg-surface-2 text-foreground placeholder:text-muted-foreground focus-visible:ring-cyan"
          />
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <Select defaultValue="5">
                <SelectTrigger className="w-[120px] border-none bg-transparent text-foreground">
                  <SelectValue placeholder="Slides" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Slides</SelectItem>
                  <SelectItem value="5">5 Slides</SelectItem>
                  <SelectItem value="7">7 Slides</SelectItem>
                  <SelectItem value="10">10 Slides</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
              <Select defaultValue="linkedin">
                <SelectTrigger className="w-[140px] border-none bg-transparent text-foreground">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="ml-auto bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover">
              GENERAR GRATIS
              <Zap className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Trust badge */}
        <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
          Sin tarjeta de crédito . Sin instalación.
        </p>

        {/* Social Proof */}
        <div className="mt-24 flex flex-col items-center">
          <div className="flex -space-x-3">
            <Avatar className="h-10 w-10 border-2 border-background">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" />
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <Avatar className="h-10 w-10 border-2 border-background">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" />
              <AvatarFallback>U2</AvatarFallback>
            </Avatar>
            <Avatar className="h-10 w-10 border-2 border-background">
              <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" />
              <AvatarFallback>U3</AvatarFallback>
            </Avatar>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-surface-2 text-xs font-semibold text-muted-foreground">
              +10k
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Más de 10,000 carruseles generados esta semana
          </p>
        </div>

        {/* CTA Section */}
        <section className="mt-32 flex flex-col items-center pb-24">
          <h2 className="text-center font-heading text-3xl font-bold text-foreground md:text-4xl">
            Comienza a crear hoy.
          </h2>
          <Link href="/auth/signup" className="mt-8">
            <Button className="bg-cyan text-primary-foreground font-semibold hover:bg-cyan/90 glow-cyan-hover px-8 py-6 text-base">
              GENERAR MI PRIMER CARRUSEL
            </Button>
          </Link>
          <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
            Gratis para empezar · Sin tarjeta · Cancela cuando quieras
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-surface-0 px-8 py-8 lg:px-16">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="font-heading text-lg font-bold text-foreground">
              Swyze
            </p>
            <p className="text-xs text-muted-foreground">
              Carruseles con identidad de marca, generados por IA.
            </p>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            © 2024 Swyze AI. The Sophisticated Catalyst for Creators.
          </p>
        </div>
      </footer>
    </div>
  );
}
