# 🧪 Criando Usuário de Teste - Dia da Foto

## 📧 Credenciais de Teste
- **Email**: `robsonm1974@gmail.com`
- **Senha**: `1234`

## 🚀 Passo a Passo para Criar o Usuário

### 1. Acessar o Supabase
1. Vá para [https://supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Acesse seu projeto `dia-da-foto`

### 2. Criar Usuário através da Interface
1. No painel do Supabase, vá para **Authentication** → **Users**
2. Clique em **Add User**
3. Preencha os campos:
   - **Email**: `robsonm1974@gmail.com`
   - **Password**: `1234`
   - **Email Confirm**: `robsonm1974@gmail.com`
4. Clique em **Create User**

### 3. Executar Script SQL
1. Vá para **SQL Editor**
2. Clique em **New Query**
3. Cole o conteúdo do arquivo `CRIAR_USUARIO_TESTE.sql`
4. Clique em **Run** para executar

### 4. Verificar Criação
1. Vá para **Table Editor**
2. Verifique se as tabelas foram criadas:
   - `photographer_profile` - deve ter 1 registro
   - `events` - deve ter 1 evento de teste
   - `participants` - deve ter 5 participantes
   - `product_templates` - deve ter 4 templates

## 🔐 Testando o Login

### 1. Acessar a Aplicação
1. Abra [http://localhost:3001](http://localhost:3001)
2. Clique em **Entrar**
3. Use as credenciais:
   - Email: `robsonm1974@gmail.com`
   - Senha: `1234`

### 2. Verificar Dashboard
Após o login, você deve ver:
- Estatísticas com 1 evento
- Evento "Fotos da Turma 2024 - Teste"
- 5 participantes cadastrados

## 🛠️ Solução de Problemas

### Usuário não consegue fazer login
1. Verifique se o usuário foi criado em **Authentication** → **Users**
2. Confirme se a senha está correta
3. Verifique se o email foi confirmado

### Dados não aparecem no dashboard
1. Execute novamente o script SQL
2. Verifique se as tabelas têm dados em **Table Editor**
3. Confirme se as políticas RLS estão configuradas

### Erro de conexão
1. Verifique se as variáveis de ambiente estão corretas
2. Confirme se o projeto Supabase está ativo
3. Teste a conexão em **API** → **Test**

## 📱 Dados de Teste Criados

### Evento
- **Título**: Fotos da Turma 2024 - Teste
- **Data**: 15/12/2024
- **Escola**: Escola Municipal de Teste
- **Contato**: Maria Silva
- **Comissão**: R$ 15,00

### Participantes
1. João Silva - 3º Ano A (2 fotos)
2. Maria Santos - 3º Ano A (1 foto)
3. Pedro Costa - 3º Ano B (sem fotos)
4. Ana Oliveira - 3º Ano B (3 fotos)
5. Carlos Lima - 3º Ano C (1 foto)

### Templates de Produtos
1. Pacote Básico - R$ 25,00
2. Pacote Premium - R$ 45,00
3. Foto Individual - R$ 8,00
4. Álbum Personalizado - R$ 35,00

## 🎯 Próximos Passos

1. **Testar todas as funcionalidades**:
   - Criar novo evento
   - Adicionar participantes
   - Gerar QR codes
   - Fazer upload de fotos

2. **Personalizar dados**:
   - Editar perfil do fotógrafo
   - Adicionar logo
   - Configurar templates de produtos

3. **Testar responsividade**:
   - Acessar em diferentes dispositivos
   - Testar impressão
   - Verificar exportação CSV

---

**🎉 Agora você tem um usuário de teste completo para explorar todas as funcionalidades do sistema!**




