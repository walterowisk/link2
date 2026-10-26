-- ==========================================
-- LINK2 DATABASE SCHEMA (SUPABASE)
-- Execute este script no SQL Editor do Supabase
-- ==========================================

-- 1. Habilitar extensões úteis
create extension if not exists "uuid-ossp";

-- 2. Tabela de Perfis
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text not null,
  bio text,
  avatar_url text,
  theme_config jsonb default '{
    "bg_type": "gradient",
    "bg_value": "from-slate-950 via-slate-900 to-indigo-950",
    "bg_color": "#090d16",
    "button_style": "glass",
    "button_color": "#ffffff",
    "button_text_color": "#ffffff",
    "button_radius": "full",
    "font_family": "sans",
    "card_glass": true
  }'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint username_length check (char_length(username) >= 3 and char_length(username) <= 30),
  constraint username_format check (username ~* '^[a-zA-Z0-9_-]+$')
);

-- 3. Tabela de Links
create table if not exists public.links (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  url text not null,
  icon text,
  open_in_new_tab boolean default true not null,
  order_index integer default 0 not null,
  is_active boolean default true not null,
  clicks_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices para performance
create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_links_profile_id on public.links(profile_id);
create index if not exists idx_links_order on public.links(profile_id, order_index asc);

-- 4. Função e Trigger para criar perfil automaticamente no cadastro
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_username text;
  unique_username text;
  count_exists int;
begin
  -- Tenta pegar username do metadata ou gerar a partir do email
  raw_username := coalesce(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1)
  );
  
  -- Sanitiza o username (apenas letras, números, hífen e underscore)
  raw_username := regexp_replace(raw_username, '[^a-zA-Z0-9_-]', '', 'g');
  if raw_username = '' or raw_username is null then
    raw_username := 'user';
  end if;

  unique_username := raw_username;
  select count(*) into count_exists from public.profiles where username = unique_username;
  
  -- Se já existir username igual, adiciona sufixo numérico
  if count_exists > 0 then
    unique_username := raw_username || '_' || floor(random() * 8999 + 1000)::text;
  end if;

  insert into public.profiles (id, username, display_name, bio, avatar_url)
  values (
    new.id,
    lower(unique_username),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'Bem-vindo(a) ao meu Link2!',
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  );
  
  -- Inserir alguns links de boas-vindas como exemplo
  insert into public.links (profile_id, title, url, icon, open_in_new_tab, order_index)
  values 
    (new.id, 'Meu Website Oficial', 'https://github.com', 'globe', true, 0),
    (new.id, 'Instagram', 'https://instagram.com', 'instagram', true, 1);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger disparado após inserção em auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.links enable row level security;

-- Políticas para Profiles
create policy "Perfis são visíveis publicamente" 
  on public.profiles for select 
  using (true);

create policy "Usuários podem atualizar seus próprios perfis" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Usuários podem inserir seu próprio perfil" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- Políticas para Links
create policy "Links ativos são visíveis publicamente" 
  on public.links for select 
  using (is_active = true or auth.uid() = profile_id);

create policy "Usuários podem gerenciar seus próprios links" 
  on public.links for all 
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- 6. Storage Bucket para Avatares
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatares são publicamente acessíveis"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Usuários autenticados podem fazer upload de avatares"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Usuários podem atualizar/deletar seus próprios avatares"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- 7. Função RPC para incrementar contagem de cliques com segurança
create or replace function public.increment_link_clicks(link_id uuid)
returns void as $$
begin
  update public.links
  set clicks_count = clicks_count + 1
  where id = link_id;
end;
$$ language plpgsql security definer;
