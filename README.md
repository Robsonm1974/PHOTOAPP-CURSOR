# 📸 PhotoApp - Sistema de Gerenciamento de Eventos Fotográficos

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)

## 🎯 Sobre o Projeto

**PhotoApp** é uma aplicação web completa para gerenciamento de eventos fotográficos escolares. Sistema moderno e intuitivo que permite organizadores fotografarem eventos, gerenciar participantes, e facilitar a venda de fotos com QR codes únicos.

### 🌟 Principais Funcionalidades

- 📊 **Dashboard Avançado** - Métricas visuais e analytics em tempo real
- 👥 **Gestão de Participantes** - Cadastro, edição e organização de estudantes/funcionários
- 📷 **Upload de Fotos** - Sistema de upload individual e em lote
- 🔍 **Busca Avançada** - Filtros por escola, status, data, preço e mais
- 📱 **QR Codes** - Geração e impressão de QR codes únicos para cada participante
- 💰 **Sistema de Vendas** - Carrinho de compras e gestão financeira
- 📋 **Exportação** - Listas de participantes em CSV para Excel
- 🌙 **Modo Escuro/Claro** - Interface adaptável ao usuário
- 📱 **PWA** - Instalável como app nativo

## 🚀 Demonstração

### 🖥️ Desktop
![Dashboard](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Dashboard+PhotoApp)

### 📱 Mobile
![Mobile](https://via.placeholder.com/300x600/10B981/FFFFFF?text=Mobile+PhotoApp)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Shadcn/UI](https://ui.shadcn.com/)** - Componentes UI modernos
- **[Radix UI](https://www.radix-ui.com/)** - Primitivas acessíveis
- **[Lucide React](https://lucide.dev/)** - Ícones elegantes

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security** - Segurança nativa do Supabase

### Ferramentas & Deployment
- **[Vercel](https://vercel.com/)** - Deploy e hosting
- **[PNPM](https://pnpm.io/)** - Gerenciador de pacotes
- **ESLint & Prettier** - Qualidade de código

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- PNPM (recomendado)
- Conta no Supabase

### 1. Clone o repositório
```bash
git clone https://github.com/Robsonm1974/PHOTOAPP-CURSOR.git
cd PHOTOAPP-CURSOR
```

### 2. Instale as dependências
```bash
pnpm install
```

### 3. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp config.env.example .env.local

# Edite o .env.local com suas credenciais do Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Configure o banco de dados
```bash
# Execute os scripts SQL do Supabase (consulte SUPABASE_SETUP.md)
```

### 5. Inicie o servidor de desenvolvimento
```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 🏗️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento
pnpm build        # Build de produção
pnpm start        # Inicia servidor de produção
pnpm lint         # Executa ESLint
pnpm type-check   # Verifica tipos TypeScript
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # Componentes base (Shadcn/UI)
│   │   ├── auth/          # Componentes de autenticação
│   │   ├── events/        # Componentes de eventos
│   │   └── dashboard/     # Componentes do dashboard
│   ├── contexts/          # Contextos React (State Management)
│   ├── hooks/             # Hooks customizados
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Dashboard principal
│   ├── event/             # Páginas de eventos
│   └── globals.css        # Estilos globais
├── lib/                   # Utilitários e configurações
│   ├── supabase.ts        # Cliente Supabase
│   └── utils.ts           # Funções utilitárias
└── public/                # Assets estáticos
    ├── manifest.json      # PWA manifest
    └── sw.js             # Service Worker
```

## 🎨 Features em Destaque

### 📊 Dashboard Inteligente
- Métricas visuais em tempo real
- Gráficos interativos de performance
- Cards informativos com animações

### 🔐 Autenticação Robusta
- Login/Registro com Supabase Auth
- Proteção de rotas automática
- Gerenciamento de sessão

### 📱 Responsividade Total
- Design mobile-first
- Componentes adaptativos
- PWA instalável

### ⚡ Performance Otimizada
- Lazy loading com `next/dynamic`
- Memoização com `React.memo`
- Otimização de imagens automática

## 🔧 Configuração Avançada

### Supabase Setup
Consulte o arquivo `SUPABASE_SETUP.md` para configuração completa do banco de dados.

### PWA Configuration
O app é configurado como PWA e pode ser instalado:
- Ícones adaptáveis para diferentes dispositivos
- Service Worker para funcionamento offline
- Manifest.json configurado

### Variáveis de Ambiente
```env
# Obrigatórias
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Opcionais
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_PROJECT_ID=
```

## 🧪 Testando a Aplicação

### Usuário de Teste
Use as credenciais no arquivo `INSTRUCOES_USUARIO_TESTE.md`:
- Email: `admin@photoapp.com`
- Senha: `123456`

### Dados de Exemplo
O arquivo `exemplo_participantes.csv` contém dados para teste.

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Conecte com GitHub e faça deploy automático
vercel --prod
```

### Outras Plataformas
- Netlify
- Railway
- DigitalOcean

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Robson Machado**
- GitHub: [@Robsonm1974](https://github.com/Robsonm1974)
- Email: robsonm1974@gmail.com

## 🙏 Agradecimentos

- [Shadcn/UI](https://ui.shadcn.com/) pela excelente biblioteca de componentes
- [Supabase](https://supabase.com/) pelo backend poderoso e simples
- [Vercel](https://vercel.com/) pela plataforma de deploy

---

⭐ **Se este projeto te ajudou, deixe uma estrela no repositório!**

📧 **Dúvidas?** Abra uma [issue](https://github.com/Robsonm1974/PHOTOAPP-CURSOR/issues)