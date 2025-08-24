-- ===================================================================
-- PHOTOAPP - CONFIGURAÇÃO DE AUTENTICAÇÃO
-- ===================================================================
-- Execute este script para configurar autenticação e usuários de teste
-- ===================================================================

-- 1. Configurar função para criar perfil automaticamente
-- ===================================================================

-- Função para criar perfil quando usuário se registra
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, phone, company_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'company_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_new_user();

-- 2. Inserir usuário de teste (EXECUTE APENAS UMA VEZ)
-- ===================================================================

-- IMPORTANTE: Este usuário deve ser criado através da interface do Supabase
-- ou API de autenticação. Este script é apenas para referência.

/*
USUÁRIO DE TESTE PARA CRIAR MANUALMENTE:

1. Vá para Authentication > Users no painel do Supabase
2. Clique em "Add user"
3. Preencha:
   - Email: admin@photoapp.com
   - Password: PhotoApp2024!
   - Email confirmed: true
   - User metadata:
     {
       "name": "Administrador PhotoApp",
       "phone": "(11) 99999-9999", 
       "company_name": "PhotoApp Demo"
     }

OU use a API:

curl -X POST 'https://seu-projeto.supabase.co/auth/v1/admin/users' \
-H "apikey: sua-service-role-key" \
-H "Authorization: Bearer sua-service-role-key" \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@photoapp.com",
  "password": "PhotoApp2024!",
  "email_confirm": true,
  "user_metadata": {
    "name": "Administrador PhotoApp",
    "phone": "(11) 99999-9999",
    "company_name": "PhotoApp Demo"
  }
}'
*/

-- 3. Inserir perfil de teste manualmente (após criar usuário)
-- ===================================================================

-- SUBSTITUA o UUID abaixo pelo UUID real do usuário criado
INSERT INTO profiles (
  id,
  name,
  email,
  phone,
  company_name,
  bio,
  commission_rate
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- SUBSTITUA pelo UUID real
  'Administrador PhotoApp',
  'admin@photoapp.com',
  '(11) 99999-9999',
  'PhotoApp Demo',
  'Usuário de demonstração do sistema PhotoApp',
  15.00
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  company_name = EXCLUDED.company_name,
  bio = EXCLUDED.bio,
  commission_rate = EXCLUDED.commission_rate,
  updated_at = NOW();

-- 4. Funções auxiliares para autenticação
-- ===================================================================

-- Função para verificar se usuário é administrador
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND email LIKE '%admin%'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter dados completos do usuário
CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  company_name TEXT,
  website TEXT,
  bio TEXT,
  commission_rate DECIMAL,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.email,
    p.phone,
    p.avatar_url,
    p.company_name,
    p.website,
    p.bio,
    p.commission_rate,
    p.created_at,
    p.updated_at
  FROM profiles p
  WHERE p.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Configurar politicas de segurança mais específicas
-- ===================================================================

-- Atualizar política de eventos para verificar ownership
DROP POLICY IF EXISTS "Users can update events they created" ON events;
CREATE POLICY "Users can update events they created" ON events
  FOR UPDATE USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Política para permitir que usuários vejam estatísticas
CREATE POLICY "Users can view event statistics" ON photo_sales
  FOR SELECT USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- 6. Views úteis para relatórios
-- ===================================================================

-- View para estatísticas de eventos
CREATE OR REPLACE VIEW event_statistics AS
SELECT 
  e.id,
  e.title,
  e.school,
  e.start_date,
  e.status,
  COUNT(p.id) as total_participants,
  COUNT(CASE WHEN array_length(p.photos, 1) > 0 THEN 1 END) as participants_with_photos,
  COALESCE(SUM(ps.total_amount), 0) as total_revenue,
  COALESCE(SUM(ps.commission_amount), 0) as total_commission,
  COUNT(ps.id) FILTER (WHERE ps.status = 'paid') as paid_sales,
  COUNT(ps.id) FILTER (WHERE ps.status = 'pending') as pending_sales
FROM events e
LEFT JOIN participants p ON e.id = p.event_id
LEFT JOIN photo_sales ps ON e.id = ps.event_id
GROUP BY e.id, e.title, e.school, e.start_date, e.status;

-- View para dashboard do usuário
CREATE OR REPLACE VIEW user_dashboard AS
SELECT 
  COUNT(DISTINCT e.id) as total_events,
  COUNT(DISTINCT p.id) as total_participants,
  COALESCE(SUM(ps.total_amount), 0) as total_revenue,
  COALESCE(SUM(ps.commission_amount), 0) as total_commission,
  COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'active') as active_events,
  COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'upcoming') as upcoming_events,
  COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'completed') as completed_events
FROM events e
LEFT JOIN participants p ON e.id = p.event_id
LEFT JOIN photo_sales ps ON e.id = ps.event_id;

-- 7. Políticas para as views
-- ===================================================================

-- Permitir que usuários autenticados vejam estatísticas
CREATE POLICY "Authenticated users can view event statistics" ON event_statistics
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ===================================================================
-- CONFIGURAÇÕES MANUAIS NECESSÁRIAS NO PAINEL DO SUPABASE
-- ===================================================================

/*
APÓS EXECUTAR ESTE SCRIPT, CONFIGURE NO PAINEL:

1. Authentication > Settings:
   - Site URL: http://localhost:3000
   - Redirect URLs: 
     * http://localhost:3000/auth/callback
     * http://localhost:3000/dashboard
     * https://seu-dominio.com/auth/callback (produção)
   - Enable email confirmations: true
   - Disable new user signups: false (ou true se quiser controlar)

2. Authentication > Email Templates:
   - Personalize os templates de email
   - Configure seu provedor de email (opcional)

3. Authentication > Providers:
   - Configure Google OAuth (opcional)
   - Configure outros provedores se necessário

4. IMPORTANTE - CREDENCIAIS DO USUÁRIO DE TESTE:
   Email: admin@photoapp.com
   Senha: PhotoApp2024!

5. Para criar usuários via código, use:
   const { data, error } = await supabase.auth.signUp({
     email: 'usuario@email.com',
     password: 'senha123',
     options: {
       data: {
         name: 'Nome do Usuário',
         phone: '(11) 99999-9999',
         company_name: 'Empresa'
       }
     }
   })

6. Testar login:
   const { data, error } = await supabase.auth.signInWithPassword({
     email: 'admin@photoapp.com',
     password: 'PhotoApp2024!'
   })
*/
