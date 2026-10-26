"use client";

import React, { useState, useEffect } from "react";
import { Profile, LinkItem, DEFAULT_THEME } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LinksManager } from "@/components/dashboard/links-manager";
import { AppearanceManager } from "@/components/dashboard/appearance-manager";
import { ProfileManager } from "@/components/dashboard/profile-manager";
import { PreviewScreen } from "@/components/preview-screen";
import { Button } from "@/components/ui/button";
import {
  Link2 as Link2Icon,
  Palette,
  User,
  ExternalLink,
  Save,
  CheckCircle2,
  Sparkles,
  LogOut,
} from "lucide-react";
import Link from "next/link";

const INITIAL_PROFILE: Profile = {
  id: "demo-user",
  username: "marcosdev",
  display_name: "Marcos Ribeiro",
  bio: "Full Stack Engineer & Criador de Conteúdo. Transformando café em código e interfaces modernas.",
  avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
  theme_config: {
    ...DEFAULT_THEME,
  },
};

const INITIAL_LINKS: LinkItem[] = [
  {
    id: "link-1",
    profile_id: "demo-user",
    title: "Canal no YouTube (Tech & Dicas)",
    url: "https://youtube.com",
    icon: "youtube",
    open_in_new_tab: true,
    order_index: 0,
    is_active: true,
    clicks_count: 320,
  },
  {
    id: "link-2",
    profile_id: "demo-user",
    title: "Instagram com Bastidores",
    url: "https://instagram.com",
    icon: "instagram",
    open_in_new_tab: true,
    order_index: 1,
    is_active: true,
    clicks_count: 215,
  },
  {
    id: "link-3",
    profile_id: "demo-user",
    title: "Meu GitHub com Projetos Open Source",
    url: "https://github.com",
    icon: "github",
    open_in_new_tab: true,
    order_index: 2,
    is_active: true,
    clicks_count: 145,
  },
  {
    id: "link-4",
    profile_id: "demo-user",
    title: "Fale comigo no WhatsApp",
    url: "https://whatsapp.com",
    icon: "whatsapp",
    open_in_new_tab: true,
    order_index: 3,
    is_active: true,
    clicks_count: 89,
  },
];

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("links");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Carregar dados salvos no localStorage ou Supabase ao montar
  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUserEmail(session.user.email || null);

          // Buscar dados reais do Supabase
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profileData) {
            setProfile(profileData as Profile);
          }

          const { data: linksData } = await supabase
            .from("links")
            .select("*")
            .eq("profile_id", session.user.id)
            .order("order_index", { ascending: true });

          if (linksData && linksData.length > 0) {
            setLinks(linksData as LinkItem[]);
          }
          return;
        }
      } catch (e) {
        // Fallback para localStorage
      }

      // Se não há sessão Supabase, ler de localStorage (modo demo/offline)
      const localProfile = localStorage.getItem("link2_profile");
      const localLinks = localStorage.getItem("link2_links");

      if (localProfile) {
        try {
          setProfile(JSON.parse(localProfile));
        } catch {}
      }
      if (localLinks) {
        try {
          setLinks(JSON.parse(localLinks));
        } catch {}
      }
    }

    loadData();
  }, []);

  const handleSaveAll = async () => {
    setIsSaving(true);

    try {
      // 1. Salvar no localStorage sempre
      localStorage.setItem("link2_profile", JSON.stringify(profile));
      localStorage.setItem("link2_links", JSON.stringify(links));

      // 2. Se houver sessão Supabase, persistir no banco de dados
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Atualizar perfil
        await supabase
          .from("profiles")
          .update({
            username: profile.username,
            display_name: profile.display_name,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            theme_config: profile.theme_config,
            updated_at: new Date().toISOString(),
          })
          .eq("id", session.user.id);

        // Atualizar links
        // Deletar e reinserir para manter a ordem correta
        await supabase.from("links").delete().eq("profile_id", session.user.id);

        const linksToInsert = links.map((l, index) => ({
          profile_id: session.user.id,
          title: l.title,
          url: l.url,
          icon: l.icon,
          open_in_new_tab: l.open_in_new_tab,
          order_index: index,
          is_active: l.is_active,
        }));

        await supabase.from("links").insert(linksToInsert);
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.warn("Erro ao salvar:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Topo / Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Link2Icon className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Link2
            </span>
          </Link>
          <span className="hidden sm:inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-800/60 text-indigo-300">
            Painel do Criador
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Botão de Salvar Alterações */}
          <Button
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`transition-all rounded-xl text-xs font-semibold px-4 h-9 shadow-md flex items-center gap-1.5 ${
              isSaved
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25"
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Salvo!
              </>
            ) : isSaving ? (
              "Salvando..."
            ) : (
              <>
                <Save className="w-4 h-4" /> Salvar Tudo
              </>
            )}
          </Button>

          {/* Link para ver página pública */}
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-xs font-medium text-zinc-300 transition-colors"
          >
            <span>Ver Página</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Corpo Principal com Split-Screen */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna da Esquerda: Painel de Edição */}
        <div className="lg:col-span-7 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="links" className="flex items-center gap-2">
                <Link2Icon className="w-4 h-4" /> Links
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="w-4 h-4" /> Aparência
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" /> Perfil
              </TabsTrigger>
            </TabsList>

            {/* Aba 1: Links */}
            <TabsContent value="links">
              <LinksManager links={links} onChange={setLinks} />
            </TabsContent>

            {/* Aba 2: Aparência */}
            <TabsContent value="appearance">
              <AppearanceManager
                theme={profile.theme_config}
                onChange={(updatedTheme) =>
                  setProfile({ ...profile, theme_config: updatedTheme })
                }
              />
            </TabsContent>

            {/* Aba 3: Perfil */}
            <TabsContent value="profile">
              <ProfileManager profile={profile} onChange={setProfile} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Coluna da Direita: Mockup do Smartphone com Live Preview */}
        <div className="lg:col-span-5 hidden lg:flex justify-center">
          <PreviewScreen profile={profile} links={links} />
        </div>
      </div>
    </div>
  );
}
