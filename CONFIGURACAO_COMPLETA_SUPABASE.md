# 🚀 Configuração Completa do Supabase - PhotoApp

## 📋 Checklist de Configuração

### ✅ Status da Conexão
- **✅ Projeto Supabase**: `bteauqydefstutlzzctz` - Conectado
- **✅ URL do Projeto**: `https://bteauqydefstutlzzctz.supabase.co`
- **✅ Chave Anônima**: Obtida com sucesso
- **✅ Scripts SQL**: Criados e prontos para execução

---

## 🎯 PASSOS OBRIGATÓRIOS PARA VOCÊ EXECUTAR

### 1. 📝 Criar arquivo .env.local

**Execute este comando no PowerShell:**

```powershell
@"
NEXT_PUBLIC_SUPABASE_URL=https://bteauqydefstutlzzctz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0ZWF1cXlkZWZzdHV0bHp6Y3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5ODQ2NTMsImV4cCI6MjA3MTU2MDY1M30.i9hDgw-EVmuh0N2vbMiL9V9xLNqt9EnJaGj02rtmLho
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_PROJECT_ID=bteauqydefstutlzzctz
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
```

### 2. 🗄️ Executar Scripts no Supabase

Acesse: [https://supabase.com/dashboard/project/bteauqydefstutlzzctz/sql](https://supabase.com/dashboard/project/bteauqydefstutlzzctz/sql)

**Execute os scripts nesta ordem:**

#### 2.1 **Script Principal** (supabase_migrations.sql)
```sql
-- Copie e cole todo o conteúdo do arquivo supabase_migrations.sql
-- Este script cria:
-- ✅ Tabelas (events, participants, photo_sales, profiles)
-- ✅ Índices para performance
-- ✅ Políticas RLS
-- ✅ Triggers
-- ✅ Dados de exemplo
```

#### 2.2 **Configuração de Storage** (supabase_storage_setup.sql)
```sql
-- Copie e cole todo o conteúdo do arquivo supabase_storage_setup.sql
-- Este script configura:
-- ✅ Buckets para imagens
-- ✅ Políticas de acesso a arquivos
-- ✅ Funções utilitárias
```

#### 2.3 **Configuração de Autenticação** (supabase_auth_setup.sql)
```sql
-- Copie e cole todo o conteúdo do arquivo supabase_auth_setup.sql
-- Este script configura:
-- ✅ Criação automática de perfis
-- ✅ Views para relatórios
-- ✅ Funções auxiliares
```

### 3. 👤 Criar Usuário de Teste

1. Vá para **Authentication > Users** no Supabase
2. Clique em **"Add user"**
3. Preencha:
   - **Email**: `admin@photoapp.com`
   - **Password**: `PhotoApp2024!`
   - **Email confirmed**: ✅ Marcado
   - **User metadata**:
     ```json
     {
       "name": "Administrador PhotoApp",
       "phone": "(11) 99999-9999",
       "company_name": "PhotoApp Demo"
     }
     ```

### 4. 🔧 Configurações de Autenticação

1. Vá para **Authentication > Settings**
2. Configure:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/dashboard`

### 5. 📦 Criar Buckets de Storage

1. Vá para **Storage > Buckets**
2. Crie os buckets:

   **Bucket 1: event-photos**
   - Nome: `event-photos`
   - Público: ❌ false
   - Tamanho máximo: 50MB

   **Bucket 2: profile-avatars**
   - Nome: `profile-avatars`
   - Público: ✅ true
   - Tamanho máximo: 5MB

   **Bucket 3: company-logos**
   - Nome: `company-logos`
   - Público: ✅ true
   - Tamanho máximo: 5MB

---

## 🧪 Testar a Configuração

### 1. Executar a aplicação
```bash
pnpm dev
```

### 2. Acessar e testar
1. Acesse: [http://localhost:3000](http://localhost:3000)
2. Faça login com:
   - **Email**: `admin@photoapp.com`
   - **Password**: `PhotoApp2024!`
3. Teste criar um evento
4. Teste adicionar participantes

---

## 📊 Estrutura do Banco Criada

### Tabelas Principais:
- **✅ events** - Eventos fotográficos
- **✅ participants** - Participantes dos eventos
- **✅ photo_sales** - Vendas de fotos
- **✅ profiles** - Perfis dos usuários

### Dados de Exemplo:
- **✅ 1 evento** de demonstração
- **✅ 7 participantes** (5 alunos + 1 professor + 1 funcionário)
- **✅ Vendas** calculadas automaticamente

### Funcionalidades Automáticas:
- **✅ QR Codes** gerados automaticamente
- **✅ Timestamps** atualizados automaticamente
- **✅ Perfis** criados automaticamente no registro
- **✅ Limpeza** de arquivos órfãos

---

## 🔐 Segurança Configurada

### Row Level Security (RLS):
- **✅ Habilitado** em todas as tabelas
- **✅ Políticas** configuradas para acesso seguro
- **✅ Isolamento** de dados por usuário

### Storage Security:
- **✅ Upload** apenas para usuários autenticados
- **✅ Acesso** controlado por políticas
- **✅ Tipos de arquivo** restringidos

---

## 📈 Relatórios e Analytics

### Views Criadas:
- **✅ event_statistics** - Estatísticas por evento
- **✅ user_dashboard** - Dashboard do usuário

### Métricas Disponíveis:
- Total de eventos, participantes, vendas
- Receita total e comissões
- Status dos eventos
- Participantes com/sem fotos

---

## 🚨 Verificações Finais

Após executar todos os scripts, execute esta consulta para verificar:

```sql
-- Verificar estrutura criada
SELECT 
  'Tabelas criadas:' as tipo,
  COUNT(*) as quantidade
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('events', 'participants', 'photo_sales', 'profiles');

-- Verificar dados inseridos
SELECT 'Eventos' as tabela, COUNT(*) as registros FROM events
UNION ALL
SELECT 'Participantes' as tabela, COUNT(*) as registros FROM participants
UNION ALL
SELECT 'Vendas' as tabela, COUNT(*) as registros FROM photo_sales
UNION ALL
SELECT 'Perfis' as tabela, COUNT(*) as registros FROM profiles;
```

**Resultado esperado:**
- Tabelas criadas: 4
- Eventos: 1
- Participantes: 7
- Vendas: 7
- Perfis: 0 (será 1 após criar usuário)

---

## 🎉 Status Final

### ✅ Completado Automaticamente:
- Verificação da conexão Supabase
- Obtenção das credenciais
- Criação de todos os scripts SQL
- Configuração do projeto local

### 📋 Pendente (Sua Ação):
1. **Criar .env.local** (comando fornecido)
2. **Executar scripts SQL** (3 arquivos)
3. **Criar usuário de teste** (interface Supabase)
4. **Configurar autenticação** (URLs de redirect)
5. **Criar buckets de storage** (interface Supabase)

**🚀 Após completar esses passos, seu PhotoApp estará 100% funcional com Supabase!**
