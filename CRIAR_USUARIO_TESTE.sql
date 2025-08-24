-- Script para criar usuário de teste no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos criar o usuário através da API de autenticação
-- (Isso deve ser feito através da interface do Supabase ou API)

-- 2. Depois, vamos inserir o perfil do fotógrafo
INSERT INTO photographer_profile (
  id,
  name,
  email,
  phone,
  company_name,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- ID fixo para facilitar testes
  'Robson Martins',
  'robsonm1974@gmail.com',
  '(11) 99999-9999',
  'Fotografia Profissional',
  NOW(),
  NOW()
);

-- 3. Vamos inserir alguns templates de produtos de exemplo
INSERT INTO product_templates (
  name,
  description,
  price,
  category,
  created_at,
  updated_at
) VALUES 
  ('Pacote Básico', '5 fotos digitais + 1 impressa', 25.00, 'pacote', NOW(), NOW()),
  ('Pacote Premium', '10 fotos digitais + 3 impressas + álbum', 45.00, 'pacote', NOW(), NOW()),
  ('Foto Individual', '1 foto digital de alta resolução', 8.00, 'individual', NOW(), NOW()),
  ('Álbum Personalizado', 'Álbum com 20 fotos selecionadas', 35.00, 'álbum', NOW(), NOW());

-- 4. Vamos criar um evento de exemplo
INSERT INTO events (
  id,
  title,
  start_date,
  end_date,
  school,
  contact,
  phone,
  commission,
  notes,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Fotos da Turma 2024 - Teste',
  '2024-12-15',
  '2024-12-15',
  'Escola Municipal de Teste',
  'Maria Silva',
  '(11) 88888-8888',
  15.00,
  'Evento de teste para demonstração do sistema',
  NOW(),
  NOW()
);

-- 5. Vamos criar alguns participantes de exemplo
INSERT INTO participants (
  event_id,
  name,
  class,
  type,
  qr_code,
  photos,
  created_at,
  updated_at
) VALUES 
  ('00000000-0000-0000-0000-000000000002', 'João Silva', '3º Ano A', 'aluno', '123456', ARRAY['foto1.jpg', 'foto2.jpg'], NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'Maria Santos', '3º Ano A', 'aluno', '234567', ARRAY['foto3.jpg'], NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'Pedro Costa', '3º Ano B', 'aluno', '345678', ARRAY[], NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'Ana Oliveira', '3º Ano B', 'aluno', '456789', ARRAY['foto4.jpg', 'foto5.jpg', 'foto6.jpg'], NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'Carlos Lima', '3º Ano C', 'aluno', '567890', ARRAY['foto7.jpg'], NOW(), NOW());

-- 6. Verificar se tudo foi criado corretamente
SELECT 'Eventos criados:' as info, COUNT(*) as total FROM events;
SELECT 'Participantes criados:' as info, COUNT(*) as total FROM participants;
SELECT 'Templates de produtos:' as info, COUNT(*) as total FROM product_templates;
SELECT 'Perfil do fotógrafo:' as info, COUNT(*) as total FROM photographer_profile;




