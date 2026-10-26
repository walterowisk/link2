"use client";

import React from "react";
import {
  ThemeConfig,
  THEME_PRESETS,
  BackgroundType,
  ButtonStyle,
  ButtonRadius,
  FontFamily,
} from "@/types/database";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sparkles, Palette, Layers, Type, Check } from "lucide-react";

interface AppearanceManagerProps {
  theme: ThemeConfig;
  onChange: (updatedTheme: ThemeConfig) => void;
}

const GRADIENT_PRESETS = [
  { name: "Deep Midnight", value: "from-slate-950 via-slate-900 to-indigo-950" },
  { name: "Purple Nebula", value: "from-slate-950 via-purple-950 to-slate-900" },
  { name: "Cyber Emerald", value: "from-zinc-950 via-black to-emerald-950" },
  { name: "Sunset Blaze", value: "from-rose-600 via-orange-500 to-amber-500" },
  { name: "Oceanic Wave", value: "from-cyan-900 via-blue-900 to-slate-950" },
  { name: "Rose Velvet", value: "from-pink-900 via-rose-950 to-zinc-950" },
  { name: "Aurora Night", value: "from-teal-900 via-emerald-950 to-zinc-950" },
  { name: "Solar Flare", value: "from-amber-600 via-red-600 to-zinc-950" },
];

export function AppearanceManager({ theme, onChange }: AppearanceManagerProps) {
  const updateTheme = (partial: Partial<ThemeConfig>) => {
    onChange({ ...theme, ...partial });
  };

  const applyPreset = (presetId: string) => {
    const found = THEME_PRESETS.find((p) => p.id === presetId);
    if (found) {
      onChange(found.theme);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Presets Prontos */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Temas Prontos (1-Clique)</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {THEME_PRESETS.map((preset) => {
            const isCurrent =
              theme.bg_value === preset.theme.bg_value &&
              theme.button_style === preset.theme.button_style;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={`relative p-3 rounded-2xl border text-left transition-all overflow-hidden ${
                  isCurrent
                    ? "border-indigo-500 ring-2 ring-indigo-500/30"
                    : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/60"
                }`}
              >
                <div
                  className={`w-full h-10 rounded-xl mb-2 flex items-center justify-center ${preset.preview}`}
                >
                  {isCurrent && (
                    <div className="w-5 h-5 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-zinc-200 block truncate">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Fundo da Página */}
      <div className="space-y-4 p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Fundo da Página</h3>
        </div>

        {/* Tipo de Fundo */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
          {(["gradient", "color", "image"] as BackgroundType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateTheme({ bg_type: type })}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium capitalize transition-all ${
                theme.bg_type === type
                  ? "bg-indigo-600 text-white shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {type === "gradient" ? "Gradiente" : type === "color" ? "Cor Sólida" : "Imagem"}
            </button>
          ))}
        </div>

        {/* Opções conforme o tipo */}
        {theme.bg_type === "gradient" && (
          <div className="space-y-3 pt-2">
            <Label className="text-xs text-zinc-400">Gradientes Modernos</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GRADIENT_PRESETS.map((grad) => {
                const isSelected = theme.bg_value === grad.value;
                return (
                  <button
                    key={grad.name}
                    type="button"
                    onClick={() => updateTheme({ bg_value: grad.value })}
                    className={`h-12 rounded-xl bg-gradient-to-br ${grad.value} border transition-all flex items-center justify-center ${
                      isSelected
                        ? "border-white ring-2 ring-indigo-500 scale-105"
                        : "border-white/10 hover:border-white/30"
                    }`}
                    title={grad.name}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {theme.bg_type === "color" && (
          <div className="space-y-3 pt-2">
            <Label className="text-xs text-zinc-400">Cor de Fundo Sólida</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.bg_value || "#09090b"}
                onChange={(e) => updateTheme({ bg_value: e.target.value })}
                className="w-12 h-10 rounded-xl cursor-pointer bg-transparent border border-zinc-700"
              />
              <Input
                value={theme.bg_value || "#09090b"}
                onChange={(e) => updateTheme({ bg_value: e.target.value })}
                placeholder="#09090b"
                className="font-mono text-xs"
              />
            </div>
          </div>
        )}

        {theme.bg_type === "image" && (
          <div className="space-y-3 pt-2">
            <Label className="text-xs text-zinc-400">URL da Imagem de Fundo</Label>
            <Input
              value={theme.bg_value || ""}
              onChange={(e) => updateTheme({ bg_value: e.target.value })}
              placeholder="https://exemplo.com/background.jpg"
              className="text-xs"
            />
            <p className="text-[11px] text-zinc-500">
              Insira o link de uma imagem de alta resolução (Unsplash, etc.).
            </p>
          </div>
        )}
      </div>

      {/* 3. Estilo dos Botões */}
      <div className="space-y-4 p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Estilo dos Botões</h3>
        </div>

        {/* Formato / Raio */}
        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">Formato dos Cantos</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "none", label: "Reto", class: "rounded-none" },
              { id: "md", label: "Arredondado", class: "rounded-xl" },
              { id: "full", label: "Pílula", class: "rounded-full" },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => updateTheme({ button_radius: r.id as ButtonRadius })}
                className={`py-2 px-3 border text-xs font-medium transition-all ${r.class} ${
                  theme.button_radius === r.id
                    ? "bg-indigo-600 text-white border-indigo-500"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tipo de Efeito do Botão */}
        <div className="space-y-2 pt-2">
          <Label className="text-xs text-zinc-400">Efeito Visual</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: "glass", label: "Glassmorphism" },
              { id: "filled", label: "Preenchido (Flat)" },
              { id: "outline", label: "Contorno (Outline)" },
              { id: "shadow", label: "Sombra 3D" },
              { id: "soft", label: "Suave Translúcido" },
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => updateTheme({ button_style: style.id as ButtonStyle })}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-center ${
                  theme.button_style === style.id
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cores dos Botões */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <Label className="text-xs text-zinc-400 block mb-1.5">Cor do Botão</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.button_color || "#ffffff"}
                onChange={(e) => updateTheme({ button_color: e.target.value })}
                className="w-10 h-9 rounded-lg cursor-pointer bg-transparent border border-zinc-700"
              />
              <Input
                value={theme.button_color || "#ffffff"}
                onChange={(e) => updateTheme({ button_color: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-zinc-400 block mb-1.5">Cor do Texto & Ícone</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.button_text_color || "#ffffff"}
                onChange={(e) => updateTheme({ button_text_color: e.target.value })}
                className="w-10 h-9 rounded-lg cursor-pointer bg-transparent border border-zinc-700"
              />
              <Input
                value={theme.button_text_color || "#ffffff"}
                onChange={(e) => updateTheme({ button_text_color: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tipografia */}
      <div className="space-y-4 p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Tipografia</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: "sans", label: "Moderna (Sans)", class: "font-sans" },
            { id: "heading", label: "Marcante", class: "font-semibold tracking-wide" },
            { id: "serif", label: "Elegante (Serif)", class: "font-serif" },
            { id: "mono", label: "Tech (Mono)", class: "font-mono" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => updateTheme({ font_family: f.id as FontFamily })}
              className={`p-3 rounded-xl border text-xs transition-all ${f.class} ${
                theme.font_family === f.id
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20"
                  : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
