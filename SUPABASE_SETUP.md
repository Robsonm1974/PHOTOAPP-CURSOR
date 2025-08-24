# Configuração do Supabase - Dia da Foto

Este guia irá ajudá-lo a configurar o Supabase para o projeto Dia da Foto.

## 🚀 Passo 1: Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com sua conta GitHub ou Google
4. Clique em "New Project"
5. Escolha sua organização ou crie uma nova
6. Preencha as informações:
   - **Name**: `dia-da-foto` (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte (guarde-a!)
   - **Region**: Escolha a região mais próxima (ex: São Paulo)
7. Clique em "Create new project"
8. Aguarde a criação (pode levar alguns minutos)

## 🔑 Passo 2: Obter Credenciais

1. No seu projeto, vá para **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (ex: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 📊 Passo 3: Criar Tabelas

1. No seu projeto, vá para **SQL Editor**
2. Clique em **New Query**
3. Cole e execute o seguinte SQL:

```sql
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de eventos
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  school TEXT NOT NULL,
  contact TEXT NOT NULL,
  phone TEXT NOT NULL,
  commission DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de participantes
CREATE TABLE participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  type TEXT NOT NULL,
  qr_code TEXT UNIQUE NOT NULL,
  photos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de perfil do fotógrafo
CREATE TABLE photographer_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  logo_url TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de templates de produtos
CREATE TABLE product_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_school ON events(school);
CREATE INDEX idx_participants_event_id ON participants(event_id);
CREATE INDEX idx_participants_qr_code ON participants(qr_code);
CREATE INDEX idx_participants_name ON participants(name);
```

## 🔐 Passo 4: Configurar Autenticação

1. Vá para **Authentication** → **Settings**
2. Em **Site URL**, adicione: `http://localhost:3000`
3. Em **Redirect URLs**, adicione:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
4. Clique em **Save**

### Configurar Google OAuth (Opcional)

1. Vá para **Authentication** → **Providers**
2. Clique em **Google**
3. Ative o toggle
4. Configure no [Google Cloud Console](https://console.cloud.google.com):
   - Crie um projeto
   - Ative Google+ API
   - Crie credenciais OAuth 2.0
   - Adicione URIs de redirecionamento
5. Cole o **Client ID** e **Client Secret** no Supabase
6. Clique em **Save**

## 🛡️ Passo 5: Configurar Row Level Security (RLS)

1. No **SQL Editor**, execute:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE photographer_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_templates ENABLE ROW LEVEL SECURITY;

-- Políticas para eventos (usuários podem ver apenas seus próprios eventos)
CREATE POLICY "Users can view own events" ON events
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own events" ON events
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid()::text = id::text);

-- Políticas para participantes
CREATE POLICY "Users can view participants of own events" ON participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = participants.event_id 
      AND events.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert participants to own events" ON participants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = participants.event_id 
      AND events.id::text = auth.uid()::text
    )
  );

-- Políticas para perfil do fotógrafo
CREATE POLICY "Users can view own profile" ON photographer_profile
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON photographer_profile
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Políticas para templates de produtos
CREATE POLICY "Users can view all product templates" ON product_templates
  FOR SELECT USING (true);
```

## 🔧 Passo 6: Configurar Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🧪 Passo 7: Testar a Configuração

1. Execute o projeto: `pnpm dev`
2. Acesse [http://localhost:3000](http://localhost:3000)
3. Tente criar uma conta
4. Verifique se os dados estão sendo salvos no Supabase

## 📱 Passo 8: Configurar Storage (Opcional)

Para upload de fotos e logos:

1. Vá para **Storage** → **Buckets**
2. Crie buckets:
   - `photos` - para fotos dos participantes
   - `logos` - para logos das empresas
3. Configure políticas de acesso:

```sql
-- Política para bucket de fotos
CREATE POLICY "Users can upload photos to own events" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view photos from own events" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 🚨 Solução de Problemas

### Erro de CORS
- Verifique se as URLs estão configuradas corretamente em Authentication → Settings

### Erro de RLS
- Certifique-se de que as políticas estão criadas corretamente
- Verifique se o usuário está autenticado

### Erro de Conexão
- Verifique se as credenciais estão corretas
- Confirme se o projeto está ativo

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do Supabase
2. Consulte a [documentação oficial](https://supabase.com/docs)
3. Abra uma issue no GitHub do projeto

---

**🎉 Parabéns! Seu Supabase está configurado e pronto para uso!**




