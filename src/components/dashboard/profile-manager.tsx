"use client";

import React, { useState } from "react";
import { Profile } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Camera, AtSign, AlignLeft, Upload, Link as LinkIcon, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ProfileManagerProps {
  profile: Profile;
  onChange: (updatedProfile: Profile) => void;
}

export function ProfileManager({ profile, onChange }: ProfileManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarMode, setAvatarMode] = useState<"upload" | "url">("upload");
  const [avatarInputUrl, setAvatarInputUrl] = useState(profile.avatar_url || "");

  const updateProfile = (partial: Partial<Profile>) => {
    onChange({ ...profile, ...partial });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Se tiver supabase configurado, tenta fazer upload no bucket 'avatars'
    try {
      setIsUploading(true);
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id || "temp"}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.warn("Upload no Supabase falhou, usando visualização local base64:", error);
        // Fallback para visualização local imediata
        const reader = new FileReader();
        reader.onloadend = () => {
          updateProfile({ avatar_url: reader.result as string });
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } else {
        const { data: publicData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        
        updateProfile({ avatar_url: publicData.publicUrl });
        setIsUploading(false);
      }
    } catch (err) {
      console.warn("Erro no upload:", err);
      // Fallback base64
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatar_url: reader.result as string });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (avatarInputUrl.trim()) {
      updateProfile({ avatar_url: avatarInputUrl.trim() });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Foto de Perfil */}
      <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-4">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Foto de Perfil</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl overflow-hidden shrink-0">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="w-full h-full object-cover rounded-full bg-zinc-900"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center text-white text-xl font-bold">
                  {profile.display_name?.slice(0, 2).toUpperCase() || "L2"}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div className="flex gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800 max-w-xs">
              <button
                type="button"
                onClick={() => setAvatarMode("upload")}
                className={`flex-1 py-1 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  avatarMode === "upload"
                    ? "bg-indigo-600 text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Upload className="w-3.5 h-3.5" /> Upload
              </button>
              <button
                type="button"
                onClick={() => setAvatarMode("url")}
                className={`flex-1 py-1 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  avatarMode === "url"
                    ? "bg-indigo-600 text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" /> URL Direta
              </button>
            </div>

            {avatarMode === "upload" ? (
              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium cursor-pointer border border-zinc-700 transition-colors">
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span>{isUploading ? "Enviando..." : "Escolher arquivo de imagem"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Recomendado: imagem quadrada (JPG, PNG ou WEBP) até 2MB.
                </p>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="https://exemplo.com/avatar.jpg"
                  value={avatarInputUrl}
                  onChange={(e) => setAvatarInputUrl(e.target.value)}
                  className="text-xs"
                />
                <Button size="sm" onClick={handleApplyUrl} className="bg-indigo-600">
                  Aplicar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Informações Públicas */}
      <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Dados da Página</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs text-zinc-400 block mb-1">Nome de Exibição</Label>
            <Input
              value={profile.display_name}
              onChange={(e) => updateProfile({ display_name: e.target.value })}
              placeholder="Ex: Dra. Larissa Silva, Lucas Tech, Estúdio Criativo..."
            />
          </div>

          <div>
            <Label className="text-xs text-zinc-400 block mb-1">Username (URL Pública)</Label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-xs text-zinc-500 font-mono">
                link2.app/
              </span>
              <Input
                value={profile.username}
                onChange={(e) =>
                  updateProfile({
                    username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
                  })
                }
                placeholder="seu-username"
                className="pl-24 font-mono text-sm"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Apenas letras minúsculas, números, sublinhados e hífens.
            </p>
          </div>

          <div>
            <Label className="text-xs text-zinc-400 block mb-1">Biografia / Descrição</Label>
            <textarea
              value={profile.bio || ""}
              onChange={(e) => updateProfile({ bio: e.target.value })}
              placeholder="Conte brevemente quem você é ou o que faz..."
              rows={3}
              className="w-full rounded-xl border border-zinc-700/50 bg-zinc-900/60 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
