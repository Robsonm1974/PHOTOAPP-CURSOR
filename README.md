# 📸 PhotoApp - Sistema de Gerenciamento de Eventos Fotográficos

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Local_DB-blue)](https://sqlite.org/)
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
- **[SQLite](https://sqlite.org/)** - Banco de dados local para desenvolvimento
- **[Better-SQLite3](https://github.com/WiseLibs/better-sqlite3)** - Driver SQLite performático
- **Dados Locais** - Persistência offline para testes e desenvolvimento

### Ferramentas & Deployment
- **[Vercel](https://vercel.com/)** - Deploy e hosting
- **[PNPM](https://pnpm.io/)** - Gerenciador de pacotes
- **ESLint & Prettier** - Qualidade de código

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- PNPM (recomendado)

### 1. Clone o repositório
```bash
git clone https://github.com/Robsonm1974/PHOTOAPP-CURSOR.git
cd PHOTOAPP-CURSOR
```

### 2. Instale as dependências
```bash
pnpm install
```

### 3. Configure o banco de dados local
```bash
# O banco SQLite será criado automaticamente na primeira execução
# Arquivo criado: ./local-database.db
```

### 4. Inicie o servidor de desenvolvimento
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
│   ├── database.ts        # Cliente SQLite local
│   ├── supabase.ts        # Cliente de banco unificado
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

### 🔐 Autenticação Local
- Sistema de autenticação simplificado
- Proteção de rotas automática
- Gerenciamento de sessão local

### 📱 Responsividade Total
- Design mobile-first
- Componentes adaptativos
- PWA instalável

### ⚡ Performance Otimizada
- Lazy loading com `next/dynamic`
- Memoização com `React.memo`
- Otimização de imagens automática

## 🔧 Configuração Avançada

### Banco de Dados Local
O sistema usa SQLite local com dados de exemplo pré-carregados:
- Arquivo: `./local-database.db`
- Criado automaticamente na primeira execução
- Estrutura completa com relacionamentos

### PWA Configuration
O app é configurado como PWA e pode ser instalado:
- Ícones adaptáveis para diferentes dispositivos
- Service Worker para funcionamento offline
- Manifest.json configurado

### Variáveis de Ambiente
```env
# Desenvolvimento local
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Banco local (criado automaticamente)
# Arquivo: ./local-database.db
```

## 🧪 Testando a Aplicação

### Dados de Exemplo
O sistema cria automaticamente dados de teste:
- 1 usuário padrão para desenvolvimento
- 2 eventos de demonstração
- 6 participantes de exemplo
- 2 vendas de exemplo

### Arquivo CSV
O arquivo `exemplo_participantes.csv` contém dados para importação adicional.

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
- [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) pelo driver SQLite performático
- [Vercel](https://vercel.com/) pela plataforma de deploy

---

⭐ **Se este projeto te ajudou, deixe uma estrela no repositório!**

📧 **Dúvidas?** Abra uma [issue](https://github.com/Robsonm1974/PHOTOAPP-CURSOR/issues)