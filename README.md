# ⚡ Link2

> Um agregador de links moderno, rápido e personalizável (estilo Linktree), construído com Next.js 16, TypeScript, Tailwind CSS v4, Radix UI / ShadCN e Supabase.

---

## ✨ Funcionalidades

- 🎨 **Customização Completa de Aparência**:
  - Fundos com gradientes vibrantes, cores sólidas ou imagem de fundo.
  - Estilos de botões variados: Flat (Preenchido), Glassmorphism (Efeito vidro translúcido), Outline (Contorno), Sombra 3D e Suave.
  - Ajuste de cantos (Reto, Arredondado suave ou Pílula).
  - Tipografias personalizadas (Sans, Heading, Serif, Mono).
  - Presets de temas prontos com 1 clique (*Midnight Glow*, *Cyberpunk Neon*, *Sunset Horizon*, etc.).
- 🔗 **Botões com Ícones**:
  - Suporte a ícones para redes sociais e links gerais (Instagram, YouTube, GitHub, Twitter/X, LinkedIn, WhatsApp, Twitch, Discord, Spotify, etc.).
  - Seletor visual interativo de ícones com busca em tempo real.
- 🔀 **Controle de Abertura de Abas**:
  - Opção para abrir o link em uma nova aba (`target="_blank"`) ou na mesma aba (`target="_self"`).
- 👤 **Foto de Perfil & Bio**:
  - Suporte a upload direto para o bucket `avatars` no Supabase Storage ou URL de imagem.
  - Nome de exibição, biografia e username único para a URL pública.
- 📱 **Live Preview no Dashboard (Split-Screen)**:
  - Mockup realista de smartphone que reflete todas as modificações em tempo real.
- 📊 **Métricas de Acesso**:
  - Contador de cliques integrado com RPC no PostgreSQL.
- 🔒 **Segurança & Performance**:
  - Row Level Security (RLS) no Supabase.
  - Server Components e Streaming com Suspense no Next.js App Router.

---

## 🛠️ Stack Tecnológica

- **Linguagem**: TypeScript
- **Framework**: Next.js (App Router, Turbopack)
- **Estilização**: Tailwind CSS v4
- **Componentes**: Radix UI Primitives / ShadCN UI
- **Ícones**: Lucide Icons & Custom SVGs
- **Backend & Banco de Dados**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage)

---

## 🚀 Começando

### 1. Clonar o repositório
```bash
git clone https://github.com/walterowisk/link2.git
cd link2
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto baseado no `.env.example`:
```bash
cp .env.example .env.local
```

Preencha com as credenciais do seu projeto Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### 4. Configurar o Banco de Dados no Supabase
Execute o script [supabase/schema.sql](supabase/schema.sql) no SQL Editor do painel do Supabase para criar as tabelas `profiles`, `links`, o bucket `avatars`, o trigger de criação de conta e as políticas de segurança RLS.

### 5. Executar o servidor local
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📄 Licença

Este projeto é open-source sob a licença [MIT](LICENSE).
