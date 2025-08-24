-- ===================================================================
-- PHOTOAPP - CONFIGURAÇÃO DO STORAGE (BUCKETS)
-- ===================================================================
-- Execute este script após criar as tabelas principais
-- ===================================================================

-- 1. Criar buckets para armazenamento de arquivos
-- ===================================================================
-- NOTA: Os buckets devem ser criados através da interface do Supabase
-- Vá para Storage > Buckets e crie os seguintes buckets:

-- Bucket: 'event-photos'
-- - Público: false
-- - Upload permitido para usuários autenticados
-- - Para fotos dos participantes nos eventos

-- Bucket: 'profile-avatars' 
-- - Público: true
-- - Para avatares de usuários

-- Bucket: 'company-logos'
-- - Público: true  
-- - Para logos das empresas/fotógrafos

-- 2. Configurar políticas de acesso para buckets
-- ===================================================================

-- Políticas para bucket 'event-photos'
-- Usuários autenticados podem fazer upload
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-photos',
  'event-photos', 
  false,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Políticas para bucket 'profile-avatars'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-avatars',
  'profile-avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Políticas para bucket 'company-logos'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-logos',
  'company-logos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']::text[]
) ON CONFLICT (id) DO NOTHING;

-- 3. Criar políticas de acesso aos objetos
-- ===================================================================

-- Política para upload de fotos de eventos (apenas usuários autenticados)
CREATE POLICY "Authenticated users can upload event photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-photos' 
    AND auth.role() = 'authenticated'
  );

-- Política para visualizar fotos de eventos (apenas usuários autenticados)
CREATE POLICY "Authenticated users can view event photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'event-photos' 
    AND auth.role() = 'authenticated'
  );

-- Política para atualizar fotos de eventos
CREATE POLICY "Authenticated users can update event photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'event-photos' 
    AND auth.role() = 'authenticated'
  );

-- Política para deletar fotos de eventos
CREATE POLICY "Authenticated users can delete event photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'event-photos' 
    AND auth.role() = 'authenticated'
  );

-- Políticas para avatars de perfil
CREATE POLICY "Anyone can view profile avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-avatars');

CREATE POLICY "Authenticated users can upload profile avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-avatars' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own profile avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own profile avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Políticas para logos de empresas
CREATE POLICY "Anyone can view company logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'company-logos');

CREATE POLICY "Authenticated users can upload company logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'company-logos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own company logo" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'company-logos' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own company logo" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'company-logos' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4. Funções utilitárias para URLs de imagens
-- ===================================================================

-- Função para gerar URL pública de avatar
CREATE OR REPLACE FUNCTION get_avatar_url(user_id UUID, filename TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT storage.url(bucket_id, name)
    FROM storage.objects
    WHERE bucket_id = 'profile-avatars'
    AND name = user_id::text || '/' || filename
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar URL de logo da empresa
CREATE OR REPLACE FUNCTION get_company_logo_url(user_id UUID, filename TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT storage.url(bucket_id, name)
    FROM storage.objects
    WHERE bucket_id = 'company-logos'
    AND name = user_id::text || '/' || filename
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger para limpar arquivos órfãos
-- ===================================================================

-- Função para deletar fotos quando participante é removido
CREATE OR REPLACE FUNCTION cleanup_participant_photos()
RETURNS TRIGGER AS $$
BEGIN
  -- Deletar fotos do storage quando participante é removido
  DELETE FROM storage.objects
  WHERE bucket_id = 'event-photos'
  AND name LIKE 'participant-' || OLD.id::text || '/%';
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para cleanup automático
CREATE TRIGGER cleanup_participant_photos_trigger
  AFTER DELETE ON participants
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_participant_photos();

-- ===================================================================
-- INSTRUÇÕES PARA CONFIGURAÇÃO MANUAL
-- ===================================================================

/*
APÓS EXECUTAR ESTE SCRIPT, CONFIGURE MANUALMENTE NO SUPABASE:

1. Vá para Storage > Settings
2. Configure o tamanho máximo de upload (recomendado: 50MB)
3. Configure tipos MIME permitidos
4. Ative a otimização automática de imagens (se disponível)

5. Para testar o upload:
   - Use a aplicação Next.js
   - Teste upload de fotos de participantes
   - Teste upload de avatar do perfil
   - Teste upload de logo da empresa

6. URLs de exemplo que serão geradas:
   - Avatar: https://seu-projeto.supabase.co/storage/v1/object/public/profile-avatars/uuid/avatar.jpg
   - Logo: https://seu-projeto.supabase.co/storage/v1/object/public/company-logos/uuid/logo.png
   - Foto: https://seu-projeto.supabase.co/storage/v1/object/sign/event-photos/participant-uuid/photo.jpg
*/
