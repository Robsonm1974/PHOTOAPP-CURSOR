PHOTO MANAGER de ser um webapp, tipo saas, multi-tenant, onde cada tenant (fotógrafo), possui seus eventos, escolas e participantes, e são isolados de outros tenants
Principais funcionalidades:
Administrar eventos fotográficos, chamados DIA DA FOTO, realizado em escolas;
Administrar e inserir participantes que pertencem aos eventos, através de lista csv ou manualmente. 
Fornecer exportação da lista de participantes do evento em csv
INserir fotos nos participantes individualmente e em lote
Gerar um qrcode com 6 dígitos numéricos aleatórios únicos, para cada participante
Imprimir ou exportar lista de participantes relacionados ao evento
Relacionar nome do arquivo da foto com número do qrcode de cada participante
Deve ter uma página pública, acessível sem precisar logar, para localizar participantes por qr code, relativo a cada tenant
Próximo ao botão localizar deve ter um botão com opção para solicitar qrcode por whatsapp,caso não saiba. Ao clicar, aparece um pop up para colocar nome, turma e escola do participante, que vão servir para compor a mensagem do whatsapp
Deve ter um campo na área de configurações para inserir o whatsapp do tenant
Cada tenant deve ter uma área de configurações para configurar o link público da sua página de localizar, que mostra apenas seus participantes
Cada Tenant deve poder inserir informacoes suas completas, inclusive redes sociais, tokens para pagamento tipo pagar.me e pagseguro
Cada escola também gera uma página pública com as informações da tabela escola
Deve ter CRUD DE EVENTOS, ESCOLAS, PARTICIPANTES
Deve ser possível configurar e vender produtos fotográficos
No perfil do participante, quando visualizado publicamente, deve aparecer as fotos disponíveis, como produto com preço e botao adicionar ao carrinho
As fotos devem ter marca d'água configurada nas configurações do app
Considere uma maneira econômica de persistir as fotos em banco de dados
Deve ter apresentação moderna, opção para tema escuro. Se possível usar componentes SHADCN 
Sempre usar MCP context7



Sugestão para campos das tabelas, adicione as Tenant ID’s e relacionamentos que você julgar necessário, adaptando à funcionalidade de saas

Campos das tabelas

EVENTOS:

DATA DE CRIAÇÃO
DATA DE REALIZAÇÃO (1 dia ou período) - Deve abrir calendário para escolha da data. o Calendário deve mostrar em destaque os feriados nacionais, sábado e domingos ( Dias que não fotografamos) 
NOME DA ESCOLA  -> Escolhe uma escola ou ADD escola - Abre o CRUD de escolas
CONTATO PARA O DIA DA FOTO
TELEFONE DO CONTATO
VALOR DE COMISSÃO (Em %. Geralmente 10%. Valor base para cálculo sobre as vendas das fotos dos participantes deste evento apenas, a ser repassado para escola)
STATUS  (Agendado, realizado, finalizado)
NOTAS (Campo para observações)
DOCUMENTOS (Campo para upload do contrato de serviço da escola, lista CSV, etc)


ESCOLAS:

NOME DA ESCOLA 
ENDEREÇO
CIDADE (lista autocomplete)
ESTADO (lista autocomplete)
CNPJ (Não obrigatório)
CHAVE PIX (Não obrigatório)
TELEFONE
TIPO (Pública ou Privada) 
ENSINO (Poder assinalar os 3: Educação Infantil, Ensino Fundamental e Ensino Médio)
QUANTIDADE DE ALUNOS 
CAMPO PARA ANOTAÇÕES 
INSTAGRAM
FACEBOOK
WHATSAPP (Para atendimento)
DIREÇÃO - NOME
MENSAGEM DA DIREÇÃO 
IMAGEM DA ESCOLA
IMAGEM DA DIREÇÃO
IMAGENS EM DESTAQUE 

PARTICIPANTES: 

NOME COMPLETO
TURMA (Autocomplete baseado nas entradas)
TIPO ( Aluno por padrão, professor(a), diretora, cozinheira, colaboradora)
STATUS (Se fotografou SIM ou Não - SIM por padrão)
 FOTOS - Deve ser possível fazer o upload de 1 ou até 6 fotos para cada participante - Deve ser possível escolher a foto favorita, para o perfil do participante)
