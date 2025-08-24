-- ===================================================================
-- PHOTOAPP - MIGRAÇÕES COMPLETAS DO SUPABASE
-- ===================================================================
-- Execute este script no SQL Editor do Supabase para criar toda a estrutura
-- do banco de dados do PhotoApp
-- ===================================================================

-- 1. Habilitar extensões necessárias
-- ===================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar tabelas principais
-- ===================================================================

-- Tabela de eventos
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  school TEXT NOT NULL,
  contact TEXT NOT NULL,
  phone TEXT NOT NULL,
  commission DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  photo_price DECIMAL(10,2) NOT NULL DEFAULT 8.00,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
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
  type TEXT NOT NULL DEFAULT 'student' CHECK (type IN ('student', 'teacher', 'staff')),
  qr_code TEXT UNIQUE,
  photos TEXT[],
  profile_photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de vendas de fotos
CREATE TABLE photo_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  photos TEXT[] NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  payment_method TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de perfil do usuário/fotógrafo
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  company_name TEXT,
  website TEXT,
  bio TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 15.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices para performance
-- ===================================================================

CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_school ON events(school);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_participants_event_id ON participants(event_id);
CREATE INDEX idx_participants_qr_code ON participants(qr_code);
CREATE INDEX idx_participants_name ON participants(name);
CREATE INDEX idx_participants_type ON participants(type);
CREATE INDEX idx_photo_sales_participant_id ON photo_sales(participant_id);
CREATE INDEX idx_photo_sales_event_id ON photo_sales(event_id);
CREATE INDEX idx_photo_sales_status ON photo_sales(status);

-- 4. Habilitar Row Level Security (RLS)
-- ===================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas de segurança (RLS Policies)
-- ===================================================================

-- Políticas para eventos
CREATE POLICY "Users can view all events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert events" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update events they created" ON events
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete events they created" ON events
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas para participantes
CREATE POLICY "Users can view all participants" ON participants
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert participants" ON participants
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update participants" ON participants
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete participants" ON participants
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas para vendas de fotos
CREATE POLICY "Users can view all photo sales" ON photo_sales
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert photo sales" ON photo_sales
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update photo sales" ON photo_sales
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Políticas para perfis
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 6. Criar triggers para updated_at
-- ===================================================================

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para todas as tabelas
CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER participants_updated_at
  BEFORE UPDATE ON participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER photo_sales_updated_at
  BEFORE UPDATE ON photo_sales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 7. Criar função para gerar QR codes únicos
-- ===================================================================

CREATE OR REPLACE FUNCTION generate_qr_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar QR code automaticamente
CREATE OR REPLACE FUNCTION set_participant_qr_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.qr_code IS NULL OR NEW.qr_code = '' THEN
    NEW.qr_code = generate_qr_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER participants_qr_code
  BEFORE INSERT ON participants
  FOR EACH ROW
  EXECUTE FUNCTION set_participant_qr_code();

-- 8. Inserir dados de exemplo
-- ===================================================================

-- Evento de exemplo
INSERT INTO events (
  id,
  title,
  start_date,
  end_date,
  school,
  contact,
  phone,
  commission,
  photo_price,
  status,
  notes
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Fotos da Turma 2024 - Demonstração',
  '2024-12-15',
  '2024-12-15',
  'Escola Municipal Exemplo',
  'Maria Silva',
  '(11) 99999-9999',
  15.00,
  8.00,
  'active',
  'Evento de demonstração para testar o sistema PhotoApp'
);

-- Participantes de exemplo
INSERT INTO participants (
  event_id,
  name,
  class,
  type,
  qr_code,
  photos
) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'João Silva', '3º Ano A', 'student', 'JOAO2024', ARRAY['foto1.jpg', 'foto2.jpg']),
  ('00000000-0000-0000-0000-000000000001', 'Maria Santos', '3º Ano A', 'student', 'MARIA024', ARRAY['foto3.jpg']),
  ('00000000-0000-0000-0000-000000000001', 'Pedro Costa', '3º Ano B', 'student', 'PEDRO024', ARRAY[]::TEXT[]),
  ('00000000-0000-0000-0000-000000000001', 'Ana Oliveira', '3º Ano B', 'student', 'ANA2024A', ARRAY['foto4.jpg', 'foto5.jpg', 'foto6.jpg']),
  ('00000000-0000-0000-0000-000000000001', 'Carlos Lima', '3º Ano C', 'student', 'CARLOS24', ARRAY['foto7.jpg']),
  ('00000000-0000-0000-0000-000000000001', 'Prof. Eduardo', 'Professor', 'teacher', 'PROF2024', ARRAY['prof1.jpg']),
  ('00000000-0000-0000-0000-000000000001', 'Sra. Fernanda', 'Secretaria', 'staff', 'STAFF024', ARRAY[]::TEXT[]);

-- Vendas de exemplo
INSERT INTO photo_sales (
  participant_id,
  event_id,
  photos,
  total_amount,
  commission_amount,
  status,
  payment_method
) SELECT 
  p.id,
  p.event_id,
  p.photos,
  CASE 
    WHEN array_length(p.photos, 1) IS NULL THEN 0
    ELSE array_length(p.photos, 1) * 8.00
  END,
  CASE 
    WHEN array_length(p.photos, 1) IS NULL THEN 0
    ELSE array_length(p.photos, 1) * 8.00 * 0.15
  END,
  CASE 
    WHEN array_length(p.photos, 1) > 0 THEN 'paid'
    ELSE 'pending'
  END,
  CASE 
    WHEN array_length(p.photos, 1) > 0 THEN 'pix'
    ELSE NULL
  END
FROM participants p
WHERE p.event_id = '00000000-0000-0000-0000-000000000001';

-- 9. Verificar estrutura criada
-- ===================================================================

-- Verificar tabelas criadas
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

-- ===================================================================
-- FIM DAS MIGRAÇÕES
-- ===================================================================

-- Para testar, execute:
-- SELECT * FROM events;
-- SELECT * FROM participants LIMIT 5;
-- SELECT * FROM photo_sales LIMIT 5;
