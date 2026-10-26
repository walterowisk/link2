"use client";

import React from "react";
import { Profile, LinkItem } from "@/types/database";
import { ProfileView } from "./profile-view";
import { ExternalLink, Copy, Check } from "lucide-react";

interface PreviewScreenProps {
  profile: Profile;
  links: LinkItem[];
}

export function PreviewScreen({ profile, links }: PreviewScreenProps) {
  const [copied, setCopied] = React.useState(false);
  const publicUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/${profile.username}` 
    : `/${profile.username}`;

  const copyUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full sticky top-8">
      {/* Barra de ação rápida do link público */}
      <div className="w-full max-w-[340px] mb-4 flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-md shadow-lg">
        <span className="text-xs text-zinc-400 truncate pl-1 font-mono">
          link2.app/{profile.username}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={copyUrl}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title="Copiar URL"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            title="Abrir página pública"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Frame do Smartphone */}
      <div className="relative w-[320px] h-[640px] rounded-[48px] border-[10px] border-zinc-800 bg-zinc-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-zinc-700/50 flex flex-col">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
          <div className="w-2 h-2 rounded-full bg-indigo-950/60 ring-1 ring-indigo-500/20" />
        </div>

        {/* Conteúdo com rolagem interna */}
        <div className="w-full h-full overflow-y-auto no-scrollbar pt-4">
          <ProfileView profile={profile} links={links} isPreview={true} />
        </div>

        {/* Barra inferior Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-30 pointer-events-none" />
      </div>
    </div>
  );
}
