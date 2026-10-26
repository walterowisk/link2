import React, { Suspense } from "react";
import { connection } from "next/server";
import { Profile, LinkItem, DEFAULT_THEME } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { ProfileView } from "@/components/profile-view";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} | Link2`,
    description: `Confira os links oficiais de ${username} no Link2.`,
    openGraph: {
      title: `${username} | Link2`,
      description: `Confira os links de ${username} agregados em uma única página elegante.`,
    },
  };
}

async function ProfileLoader({ params }: PageProps) {
  // Indica ao Next.js que a busca dos dados do Supabase ocorre em tempo de requisição
  await connection();
  const { username } = await params;

  let profile: Profile | null = null;
  let links: LinkItem[] = [];

  try {
    const supabase = await createClient();

    // Buscar perfil pelo username
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username.toLowerCase())
      .single();

    if (profileData) {
      profile = profileData as Profile;

      // Buscar links ativos ordenados
      const { data: linksData } = await supabase
        .from("links")
        .select("*")
        .eq("profile_id", profile.id)
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (linksData) {
        links = linksData as LinkItem[];
      }
    }
  } catch (err) {
    console.warn("Supabase fetch failed or not configured, using mock profile:", err);
  }

  // Se não encontrou no banco (ou Supabase não configurado ainda), exibe perfil demonstrativo
  if (!profile) {
    profile = {
      id: "demo-user",
      username: username,
      display_name: username.charAt(0).toUpperCase() + username.slice(1),
      bio: "Criador de conteúdo, inovador digital & entusiasta de tecnologia.",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      theme_config: {
        ...DEFAULT_THEME,
      },
    };

    links = [
      {
        id: "l1",
        profile_id: "demo-user",
        title: "Meu Canal no YouTube",
        url: "https://youtube.com",
        icon: "youtube",
        open_in_new_tab: true,
        order_index: 0,
        is_active: true,
        clicks_count: 142,
      },
      {
        id: "l2",
        profile_id: "demo-user",
        title: "Siga no Instagram",
        url: "https://instagram.com",
        icon: "instagram",
        open_in_new_tab: true,
        order_index: 1,
        is_active: true,
        clicks_count: 98,
      },
      {
        id: "l3",
        profile_id: "demo-user",
        title: "Código Fonte no GitHub",
        url: "https://github.com",
        icon: "github",
        open_in_new_tab: true,
        order_index: 2,
        is_active: true,
        clicks_count: 67,
      },
      {
        id: "l4",
        profile_id: "demo-user",
        title: "Meu Site & Portfólio",
        url: "https://google.com",
        icon: "globe",
        open_in_new_tab: false,
        order_index: 3,
        is_active: true,
        clicks_count: 310,
      },
    ];
  }

  return <ProfileView profile={profile} links={links} isPreview={false} />;
}

export default function PublicProfilePage(props: PageProps) {
  return (
    <main className="min-h-screen w-full flex flex-col flex-1">
      <Suspense
        fallback={
          <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 space-y-4 bg-slate-950">
            <div className="w-24 h-24 rounded-full bg-zinc-800 animate-pulse" />
            <div className="w-32 h-6 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="w-48 h-4 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="w-full max-w-md space-y-3 pt-4">
              <div className="w-full h-12 bg-zinc-850 rounded-xl animate-pulse" />
              <div className="w-full h-12 bg-zinc-850 rounded-xl animate-pulse" />
              <div className="w-full h-12 bg-zinc-850 rounded-xl animate-pulse" />
            </div>
          </div>
        }
      >
        <ProfileLoader {...props} />
      </Suspense>
    </main>
  );
}
