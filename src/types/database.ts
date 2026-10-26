export type BackgroundType = 'color' | 'gradient' | 'image';
export type ButtonStyle = 'filled' | 'outline' | 'glass' | 'shadow' | 'soft';
export type ButtonRadius = 'none' | 'md' | 'full';
export type FontFamily = 'sans' | 'heading' | 'serif' | 'mono';

export interface ThemeConfig {
  bg_type: BackgroundType;
  bg_value: string; // Ex: '#09090b', 'from-violet-600 via-indigo-600 to-slate-900', URL da imagem
  bg_color?: string; // Cor sólida de fallback
  button_style: ButtonStyle;
  button_color: string; // Ex: '#ffffff' ou '#3b82f6'
  button_text_color: string; // Ex: '#000000' ou '#ffffff'
  button_radius: ButtonRadius;
  font_family: FontFamily;
  card_glass?: boolean;
}

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio?: string | null;
  avatar_url?: string | null;
  theme_config: ThemeConfig;
  created_at?: string;
  updated_at?: string;
}

export interface LinkItem {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  icon?: string | null;
  open_in_new_tab: boolean;
  order_index: number;
  is_active: boolean;
  clicks_count: number;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_THEME: ThemeConfig = {
  bg_type: 'gradient',
  bg_value: 'from-slate-950 via-slate-900 to-indigo-950',
  bg_color: '#090d16',
  button_style: 'glass',
  button_color: '#ffffff',
  button_text_color: '#ffffff',
  button_radius: 'full',
  font_family: 'sans',
  card_glass: true,
};

export interface ThemePreset {
  id: string;
  name: string;
  preview: string;
  theme: ThemeConfig;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'midnight-violet',
    name: 'Midnight Glow',
    preview: 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900',
    theme: {
      bg_type: 'gradient',
      bg_value: 'from-slate-950 via-purple-950 to-slate-900',
      bg_color: '#0f0728',
      button_style: 'glass',
      button_color: '#ffffff',
      button_text_color: '#ffffff',
      button_radius: 'full',
      font_family: 'sans',
      card_glass: true,
    },
  },
  {
    id: 'cyber-dark',
    name: 'Cyberpunk Neon',
    preview: 'bg-gradient-to-br from-zinc-950 via-black to-emerald-950',
    theme: {
      bg_type: 'gradient',
      bg_value: 'from-zinc-950 via-black to-emerald-950',
      bg_color: '#051b11',
      button_style: 'outline',
      button_color: '#10b981',
      button_text_color: '#10b981',
      button_radius: 'md',
      font_family: 'mono',
      card_glass: false,
    },
  },
  {
    id: 'sunset-vibes',
    name: 'Sunset Horizon',
    preview: 'bg-gradient-to-br from-rose-600 via-orange-500 to-amber-500',
    theme: {
      bg_type: 'gradient',
      bg_value: 'from-rose-600 via-orange-500 to-amber-500',
      bg_color: '#e11d48',
      button_style: 'filled',
      button_color: '#ffffff',
      button_text_color: '#1f2937',
      button_radius: 'full',
      font_family: 'sans',
      card_glass: false,
    },
  },
  {
    id: 'clean-minimal',
    name: 'Clean White',
    preview: 'bg-gradient-to-br from-slate-50 to-gray-200',
    theme: {
      bg_type: 'color',
      bg_value: '#f8fafc',
      bg_color: '#f8fafc',
      button_style: 'shadow',
      button_color: '#0f172a',
      button_text_color: '#ffffff',
      button_radius: 'md',
      font_family: 'sans',
      card_glass: false,
    },
  },
  {
    id: 'ocean-deep',
    name: 'Ocean Gradient',
    preview: 'bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-950',
    theme: {
      bg_type: 'gradient',
      bg_value: 'from-cyan-900 via-blue-900 to-slate-950',
      bg_color: '#082f49',
      button_style: 'glass',
      button_color: '#38bdf8',
      button_text_color: '#ffffff',
      button_radius: 'full',
      font_family: 'sans',
      card_glass: true,
    },
  },
];
