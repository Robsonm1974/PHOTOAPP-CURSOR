# 📸 Guia de Imagens para Perfil da Escola

## Visão Geral
O sistema de perfil da escola agora suporta upload de imagens para criar uma apresentação visual profissional e atrativa. Estas imagens são utilizadas na página pública de perfil da escola.

## 🖼️ Tipos de Imagem Suportados

### 1. Foto do Diretor(a)
- **Tamanho recomendado**: 300x300 pixels
- **Formato**: JPG, PNG
- **Uso**: Exibida em formato circular no perfil da escola
- **Localização**: Card lateral direito da página de perfil

### 2. Imagem da Escola
- **Tamanho recomendado**: 800x400 pixels (proporção 2:1)
- **Formato**: JPG, PNG
- **Uso**: Banner principal da página de perfil
- **Localização**: Hero section no topo da página

## 📱 Responsividade

### Desktop (lg: 1024px+)
- **Foto do Diretor**: 128x128 pixels (w-32 h-32)
- **Imagem da Escola**: 800x400 pixels (h-80)

### Tablet (md: 768px - 1023px)
- **Foto do Diretor**: 96x96 pixels
- **Imagem da Escola**: 600x300 pixels (h-64)

### Mobile (sm: 640px - 767px)
- **Foto do Diretor**: 80x80 pixels
- **Imagem da Escola**: 400x200 pixels (h-64)

## 🎨 Recomendações de Design

### Foto do Diretor
- **Composição**: Retrato profissional, rosto bem iluminado
- **Fundo**: Neutro ou relacionado ao ambiente escolar
- **Vestimenta**: Profissional, adequada para direção escolar
- **Expressão**: Amigável e acessível

### Imagem da Escola
- **Composição**: Vista frontal ou fachada principal da escola
- **Enquadramento**: Horizontal, mostrando a arquitetura completa
- **Iluminação**: Natural, preferencialmente em horário de sol
- **Elementos**: Incluir elementos que identifiquem a escola (nome, logotipo)

## 🔧 Funcionalidades Técnicas

### Upload
- **Método**: FileReader API para preview imediato
- **Validação**: Aceita apenas arquivos de imagem
- **Armazenamento**: Base64 string no estado local
- **Limite**: Sem limite de tamanho (recomendado < 2MB)

### Preview
- **Foto do Diretor**: Preview circular com botão de remoção
- **Imagem da Escola**: Preview retangular com botão de remoção
- **Responsivo**: Adapta-se automaticamente ao tamanho da tela

### Fallbacks
- **Sem foto do diretor**: Avatar padrão com gradiente azul-roxo
- **Sem imagem da escola**: Banner com gradiente e nome da escola

## 📋 Checklist de Implementação

- [x] Campos de upload no formulário de escola
- [x] Preview das imagens com botão de remoção
- [x] Validação de tipos de arquivo
- [x] Integração com o contexto de escolas
- [x] Página pública de perfil responsiva
- [x] Botão "Ver Perfil" funcional
- [x] Fallbacks para imagens ausentes
- [x] Layout profissional e atrativo

## 🚀 Como Usar

1. **Acesse** a página de Escolas (`/escolas`)
2. **Clique** em "Nova Escola" ou "Editar" em uma escola existente
3. **Faça upload** das imagens nos campos apropriados
4. **Salve** as alterações
5. **Clique** em "Ver Perfil" para visualizar a página pública

## 💡 Dicas para Melhor Resultado

- **Qualidade**: Use imagens de alta resolução (mínimo 300 DPI)
- **Formato**: Prefira JPG para fotografias, PNG para imagens com transparência
- **Otimização**: Comprima as imagens para web (mantenha qualidade > 80%)
- **Consistência**: Mantenha um padrão visual entre as escolas
- **Teste**: Verifique como as imagens aparecem em diferentes dispositivos

## 🔮 Futuras Melhorias

- [ ] Redimensionamento automático de imagens
- [ ] Compressão automática para otimização
- [ ] Galeria de imagens da escola
- [ ] Filtros e efeitos de imagem
- [ ] Integração com CDN para melhor performance
- [ ] Sistema de backup de imagens




