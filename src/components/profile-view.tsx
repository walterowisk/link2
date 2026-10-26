"use client";

import React from "react";
import { Profile, LinkItem, ThemeConfig } from "@/types/database";
import { RenderIcon } from "./icons";
import { ExternalLink, Share2, Sparkles } from "lucide-react";

interface ProfileViewProps {
  profile: Profile;
  links: LinkItem[];
  isPreview?: boolean;
  onLinkClick?: (linkId: string) => void;
}

export function ProfileView({
  profile,
  links,
  isPreview = false,
  onLinkClick,
}: ProfileViewProps) {
  const theme = profile.theme_config;

  // Determinar o estilo de fundo
  const getBackgroundStyle = () => {
    if (theme.bg_type === "gradient") {
      return { className: `bg-gradient-to-br ${theme.bg_value}` };
    }
    if (theme.bg_type === "image") {
      return {
        style: {
          backgroundImage: `url(${theme.bg_value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        },
      };
    }
    return {
      style: { backgroundColor: theme.bg_value || theme.bg_color || "#09090b" },
    };
  };

  // Determinar formato do botão
  const getButtonRadiusClass = () => {
    switch (theme.button_radius) {
      case "none":
        return "rounded-none";
      case "md":
        return "rounded-xl";
      case "full":
      default:
        return "rounded-full";
    }
  };

  // Determinar família tipográfica
  const getFontFamilyClass = () => {
    switch (theme.font_family) {
      case "serif":
        return "font-serif";
      case "mono":
        return "font-mono";
      case "heading":
        return "font-semibold tracking-wide";
      case "sans":
      default:
        return "font-sans";
    }
  };

  // Determinar classes e estilos dos botões de link
  const getButtonStyle = () => {
    const radius = getButtonRadiusClass();
    const isGlass = theme.button_style === "glass";
    const isOutline = theme.button_style === "outline";
    const isShadow = theme.button_style === "shadow";
    const isSoft = theme.button_style === "soft";

    if (isGlass) {
      return {
        className: `w-full py-3.5 px-5 flex items-center justify-between backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 shadow-lg shadow-black/10 transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] group ${radius}`,
        style: {
          color: theme.button_text_color || "#ffffff",
        },
      };
    }

    if (isOutline) {
      return {
        className: `w-full py-3.5 px-5 flex items-center justify-between border-2 bg-transparent hover:bg-white/5 transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] group ${radius}`,
        style: {
          borderColor: theme.button_color || "#ffffff",
          color: theme.button_text_color || "#ffffff",
        },
      };
    }

    if (isShadow) {
      return {
        className: `w-full py-3.5 px-5 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150 group ${radius}`,
        style: {
          backgroundColor: theme.button_color || "#ffffff",
          color: theme.button_text_color || "#09090b",
        },
      };
    }

    if (isSoft) {
      return {
        className: `w-full py-3.5 px-5 flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] group ${radius}`,
        style: {
          color: theme.button_text_color || "#ffffff",
        },
      };
    }

    // Default: 'filled'
    return {
      className: `w-full py-3.5 px-5 flex items-center justify-between shadow-md hover:shadow-xl transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] group ${radius}`,
      style: {
        backgroundColor: theme.button_color || "#ffffff",
        color: theme.button_text_color || "#09090b",
      },
    };
  };

  const bgProps = getBackgroundStyle();
  const buttonStyle = getButtonStyle();
  const fontClass = getFontFamilyClass();

  // Filtrar apenas links ativos no modo não-preview
  const activeLinks = isPreview ? links : links.filter((l) => l.is_active);

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: profile.display_name,
          text: profile.bio || `Links de ${profile.display_name}`,
          url: window.location.href,
        });
      } catch {
        // Usuário cancelou ou navegador não suportou
      }
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  return (
    <div
      className={`min-h-full w-full flex flex-col items-center justify-start py-8 px-4 sm:px-6 relative selection:bg-indigo-500 selection:text-white ${
        bgProps.className || ""
      } ${fontClass}`}
      style={bgProps.style}
    >
      {/* Botão de compartilhar topo direito */}
      {!isPreview && (
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 backdrop-blur-md shadow-md transition-all active:scale-90"
          title="Compartilhar perfil"
          aria-label="Compartilhar perfil"
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}

      {/* Conteúdo Centralizado */}
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-6 animate-in fade-in duration-300">
        {/* Foto de Perfil */}
        <div className="relative group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl overflow-hidden">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-full h-full object-cover rounded-full bg-zinc-900"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center text-white text-2xl font-bold">
                {profile.display_name?.slice(0, 2).toUpperCase() || "L2"}
              </div>
            )}
          </div>
        </div>

        {/* Informações do Usuário */}
        <div className="space-y-1.5 px-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm flex items-center justify-center gap-1.5">
            {profile.display_name}
            <Sparkles className="w-4 h-4 text-amber-400 inline shrink-0" />
          </h1>
          <p className="text-xs sm:text-sm font-medium text-white/70">
            @{profile.username}
          </p>
          {profile.bio && (
            <p className="text-sm text-white/85 max-w-sm mx-auto leading-relaxed pt-1">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Lista de Links */}
        <div className="w-full space-y-3 pt-2">
          {activeLinks.map((link) => {
            const isExternal = link.open_in_new_tab;

            const content = (
              <div
                className={buttonStyle.className}
                style={buttonStyle.style}
              >
                {/* Ícone à esquerda */}
                <div className="w-8 flex items-center justify-start shrink-0">
                  <RenderIcon iconId={link.icon} className="w-5 h-5" />
                </div>

                {/* Título do link no centro */}
                <span className="text-sm sm:text-base font-medium flex-1 text-center truncate px-2">
                  {link.title}
                </span>

                {/* Indicador de abertura à direita */}
                <div className="w-8 flex items-center justify-end shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                  {isExternal ? (
                    <ExternalLink className="w-4 h-4" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current opacity-40" />
                  )}
                </div>
              </div>
            );

            if (isPreview) {
              return (
                <div
                  key={link.id}
                  className="cursor-pointer"
                  onClick={() => onLinkClick?.(link.id)}
                >
                  {content}
                </div>
              );
            }

            return (
              <a
                key={link.id}
                href={link.url}
                target={link.open_in_new_tab ? "_blank" : "_self"}
                rel={link.open_in_new_tab ? "noopener noreferrer" : undefined}
                onClick={() => onLinkClick?.(link.id)}
                className="block"
              >
                {content}
              </a>
            );
          })}

          {activeLinks.length === 0 && (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-white/60 text-sm">
              Nenhum link adicionado ainda.
            </div>
          )}
        </div>

        {/* Rodapé sutil com branding */}
        <div className="pt-8 pb-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-[11px] font-semibold tracking-wider text-white/70 uppercase">
            ⚡ Powered by Link2
          </span>
        </div>
      </div>
    </div>
  );
}
