import React from "react";
import Link from "next/link";
import {
  Link2,
  Sparkles,
  Palette,
  ExternalLink,
  Shield,
  Smartphone,
  Zap,
  ArrowRight,
  Layers,
  MousePointerClick,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Elementos de Iluminação e Gradientes de Fundo */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/25 to-pink-500/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-600/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Barra de Navegação */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Link2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">Link2</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth">
            <Button variant="ghost" className="text-zinc-300 hover:text-white text-sm">
              Entrar
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/25 text-sm font-semibold">
              Criar Página <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Seção Hero */}
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-24 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 text-xs font-medium text-indigo-300 shadow-inner">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>A nova geração de agregadores de links para criadores</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400">
          Todos os seus links em um único lugar elegante.
        </h1>

        <p className="mt-6 text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Crie sua página de bio com fotos de perfil, botões com ícones de redes sociais, temas com gradientes vibrantes e controle total sobre como seus links são abertos.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl h-13 px-8 text-base shadow-xl shadow-indigo-600/30">
              Começar Agora Gratuitamente <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <Link href="/marcosdev" target="_blank" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-zinc-800 hover:bg-white/5 text-zinc-300 rounded-2xl h-13 px-7 text-base"
            >
              Ver Exemplo de Perfil <ExternalLink className="w-4 h-4 ml-1.5 text-zinc-400" />
            </Button>
          </Link>
        </div>

        {/* Badges de recursos rápidos */}
        <div className="mt-14 pt-10 border-t border-zinc-900 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
            <Palette className="w-5 h-5 text-indigo-400 mb-2" />
            <h4 className="text-sm font-semibold text-white">Temas & Cores</h4>
            <p className="text-xs text-zinc-400 mt-1">Gradientes, cores sólidas e imagens de fundo.</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
            <Layers className="w-5 h-5 text-purple-400 mb-2" />
            <h4 className="text-sm font-semibold text-white">Botões & Ícones</h4>
            <p className="text-xs text-zinc-400 mt-1">Mais de 20 ícones e estilos com efeito vidro ou sombra.</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
            <ExternalLink className="w-5 h-5 text-emerald-400 mb-2" />
            <h4 className="text-sm font-semibold text-white">Controle de Abas</h4>
            <p className="text-xs text-zinc-400 mt-1">Decida se o link abre na mesma aba ou em outra.</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
            <Smartphone className="w-5 h-5 text-amber-400 mb-2" />
            <h4 className="text-sm font-semibold text-white">Live Preview</h4>
            <p className="text-xs text-zinc-400 mt-1">Visualize suas edições em um smartphone em tempo real.</p>
          </div>
        </div>
      </header>

      {/* Rodapé */}
      <footer className="w-full border-t border-zinc-900 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 Link2. Construído com Next.js, Supabase e Tailwind CSS.</p>
      </footer>
    </div>
  );
}
