Crie um protótipo funcional de alta fidelidade para um produto chamado “Escalaê”.

O Escalaê é uma plataforma web responsiva com experiência de PWA/mobile app para gerenciamento de ministérios e voluntários de uma igreja.

IMPORTANTE:
- O produto deve parecer um aplicativo moderno, jovem e real.
- Não criar aparência de sistema administrativo/ERP tradicional.
- Priorizar experiência mobile.
- A interface desktop deve ser responsiva e aproveitar telas maiores sem perder a linguagem visual mobile.
- Criar componentes reutilizáveis e consistentes.
- Usar dados fictícios realistas para demonstrar o funcionamento.
- Não criar funcionalidades de chat privado.
- Não transformar o produto em uma rede social completa.
- O foco principal é organização de escalas, ministérios, repertórios e comunicação entre equipes.

IDENTIDADE DA MARCA

Nome: Escalaê

Personalidade:
- jovem
- acolhedora
- divertida
- moderna
- simples
- energética
- humana
- comunitária

O Escalaê deve transmitir a sensação de:
“Servir ficou mais simples.”

Tom da interface:
- brasileiro
- jovem
- descontraído
- claro
- amigável

Evitar linguagem burocrática.

Exemplos:
Em vez de “Solicitação enviada com sucesso”, usar “Pedido enviado pro líder 🙌”.

Em vez de “Escala incompleta”, usar “🔥 Falta gente nessa escala”.

Em vez de “Não existem escalas disponíveis”, usar “Nada por aqui ainda 😴”.

DIREÇÃO VISUAL

Criar uma identidade visual inspirada na combinação de:
- Duolingo
- Notion
- Spotify
- Discord
- aplicativos modernos de produtividade
- aplicativos modernos de comunidade

Não copiar nenhum desses produtos.

Características:
- minimalista
- clean
- jovem
- mobile first
- cards arredondados
- bastante espaço em branco
- hierarquia visual forte
- tipografia grande e legível
- ícones simples
- microinterações
- animações suaves
- componentes com aparência tátil

Evitar:
- excesso de sombras
- gradientes exagerados
- glassmorphism excessivo
- excesso de elementos na tela
- tabelas gigantes
- sidebar cheia de opções
- aparência corporativa
- aparência de software antigo de igreja

CORES

Criar suporte completo para tema claro e escuro.

Cor principal:
#C6FF4D

Tema claro:
- background principal: #F8F8F8
- superfícies: #FFFFFF
- texto principal: #1E1E1E
- texto secundário: cinza neutro
- verde principal: #C6FF4D

Tema escuro:
- background: #111111
- superfícies: #191919
- texto principal: #FFFFFF
- texto secundário: cinza claro
- verde principal: #C6FF4D

Permitir que o usuário escolha a cor de destaque do aplicativo posteriormente.

A cor escolhida pelo usuário deve afetar:
- botões
- indicadores
- elementos de destaque
- badges
- navegação ativa

Manter contraste e acessibilidade.

TIPOGRAFIA

Usar uma tipografia moderna e arredondada.

Preferência:
Poppins

Alternativas:
Satoshi
Inter
Nunito

Usar:
- títulos fortes
- textos curtos
- números grandes para métricas
- hierarquia visual clara

NAVEGAÇÃO

NO MOBILE:

Criar uma barra de navegação inferior fixa com:

Home
Escalas
Repertório
Feed
Perfil

Usar ícones + texto.

A aba ativa deve possuir destaque visual usando a cor principal.

No desktop:
adaptar para uma navegação lateral compacta ou superior, mantendo a mesma arquitetura de informação.

Não criar menus desnecessariamente complexos.

USUÁRIOS

Existem dois níveis principais:

ADMINISTRADOR
VOLUNTÁRIO

Um administrador também pode participar de ministérios normalmente.

Um administrador pode promover outro voluntário para administrador.

Um voluntário pode participar de mais de um ministério.

MINISTÉRIOS

Criar inicialmente dois ministérios:

🎵 Louvor
🎥 Mídia

IMPORTANTE:
As funções dos ministérios NÃO devem ser criadas automaticamente.

O administrador deverá criar manualmente as funções de cada ministério.

Exemplos fictícios para demonstração:
Louvor:
- Vocal
- Guitarra
- Teclado
- Bateria

Mídia:
- Câmera
- Telão
- Transmissão

Esses exemplos podem existir apenas como dados demonstrativos editáveis.

Cada ministério possui:
- nome
- descrição
- ícone
- cor
- membros
- funções
- escalas
- feed

O mesmo voluntário pode participar de vários ministérios.

HOME DO VOLUNTÁRIO

Criar uma Home extremamente visual.

Topo:
“Bom dia, Ana 👋”

Mostrar foto do usuário.

Principal card:

PRÓXIMO CULTO

Domingo
19:00

Ministério:
Louvor

Função:
Teclado

Status:
🟡 Aguardando confirmação

Botões:
[Confirmar presença]
[Solicitar troca]

Abaixo:

ESCALAS ABERTAS

Exemplo:

🔥 Precisamos de um tecladista

Domingo • 19:00
Louvor

[Quero servir]

Depois:

VOLUNTÁRIO DO MÊS

Mostrar:
- foto grande
- nome
- ministério
- pequena conquista
- quantidade de escalas cumpridas

Exemplo:
“João”
“12 escalas confirmadas”

Depois:

PRÓXIMOS ANIVERSÁRIOS

Mostrar cards horizontais com:
- foto
- nome
- data

Depois:

ÚLTIMOS AVISOS

Mostrar os posts mais recentes do ministério.

A Home deve ser a tela mais importante do aplicativo.

ESCALAS

A tela Escalas deve funcionar como uma agenda/lista mensal.

IMPORTANTE:
A visualização principal deve ser LISTA, não um calendário complexo.

Criar filtros:
- Todas
- Próximas
- Confirmadas
- Pendentes
- Passadas

Cada escala deve aparecer como um card.

Exemplo:

DOMINGO
17 AGO
19:00

Culto de Celebração

Louvor

🎹 Teclado — Ana
🎤 Vocal — João

Status:
🟢 Confirmada

Permitir duplicar escalas para administradores.

DETALHES DA ESCALA

Ao clicar em uma escala:

Mostrar:

Nome do evento
Data
Horário
Ministério

Equipe:

🎹 Teclado
Ana

🎤 Vocal
João

🥁 Bateria
Maria

Mostrar status individual de confirmação.

Se for o usuário logado:
mostrar:

[Confirmar presença]

[Solicitar troca]

Se houver repertório:
mostrar:

REPERTÓRIO

Lista de músicas.

SOLICITAÇÃO DE TROCA

Criar uma tela/modal simples.

Título:
“Precisa trocar essa escala?”

Campos:
- justificativa
- possível substituto

Botão:
[Enviar pedido]

Mensagem após envio:
“Pedido enviado pro líder 🙌”

O administrador deverá receber uma notificação.

O administrador poderá:
- aprovar
- recusar

ESCALAS INCOMPLETAS

Criar forte destaque visual para escalas incompletas.

Estados:

🟢 Completa
🟡 Falta alguém
🔴 Crítica

Exemplo:

🔥 ESCALA ABERTA

Domingo • 19:00

Mídia

Falta:
📹 1 câmera

[Quero servir]

O voluntário pode se candidatar.

O administrador recebe a solicitação.

REPERTÓRIO

Criar uma aba de Repertório.

Tela principal:

PLAYLISTS / REPERTÓRIOS

Exemplos:
- Domingo 17/08
- Culto de Jovens
- Conferência
- Ensaio

Cada playlist mostra:
- nome
- data
- quantidade de músicas

Ao abrir:

Lista de músicas.

Cada música deve mostrar:
- nome
- artista
- tom
- BPM
- quem canta/ministra

Ações:
- Cifra Club
- YouTube

Não abrir sites externos automaticamente.

Criar botões claramente identificados.

DETALHES DA MÚSICA

Tela:

Nome da música
Artista

Tom:
G

BPM:
128

Ministro:
João

Botões:
[Cifra Club]
[YouTube]

Observações:

Campo para observações do ministério.

FEED

O feed é separado por ministério.

O usuário só deve ver o feed dos ministérios dos quais participa.

Criar posts:

📢 Aviso

🎉 Aniversário

🔥 Escala aberta

🏆 Voluntário do mês

📅 Evento

Posts devem aceitar reações:

❤️
🔥
🙏
🎶

Não criar comentários ou mensagens privadas nesta primeira versão.

PERFIL

Tela do perfil:

Foto grande

Nome:
Ana Luiza

Nível:
Servo Fiel

🔥 Sequência:
6 escalas

Ministérios:
- Louvor
- Mídia

Mostrar:

HISTÓRICO

Escalas concluídas
Presenças
Participações

CONQUISTAS

Mostrar badges.

DISPONIBILIDADE

Mostrar resumo dos dias/horários disponíveis.

DISPONIBILIDADE

Criar tela para o voluntário informar:

Dias da semana:
Domingo
Segunda
Terça
Quarta
Quinta
Sexta
Sábado

Horários disponíveis.

Usar uma interface visual simples, como seleção de blocos de horário.

Esses dados futuramente poderão ser utilizados para ajudar administradores a montar escalas.

GAMIFICAÇÃO

Criar uma área visual de conquistas.

Inspirar-se na sensação de progressão do Duolingo, sem copiar sua interface.

Mostrar:

Nível atual
Barra de progresso
Sequência

Badges:

🔥 Escala em sequência
⏰ Pontualidade
🙌 Ajuda em escala aberta
🎵 Muitas escalas
🏆 Voluntário do mês

Usar cards colecionáveis.

A gamificação deve ser positiva e comunitária.

Não criar ranking competitivo agressivo.

NOTIFICAÇÕES

Criar tela de notificações.

Tipos:

📅 Nova escala
🔄 Pedido de troca
✅ Troca aprovada
🔥 Escala aberta
📢 Novo aviso
🎂 Aniversário

Mostrar lidas/não lidas.

CONFIGURAÇÕES

Criar:

Tema:
Claro / Escuro

Cor de destaque:
seleção visual

Notificações:
- Push
- WhatsApp

Conta:
- nome
- telefone
- e-mail
- foto

Sair.

ADMIN — DASHBOARD

Criar uma experiência administrativa diferente da Home do voluntário.

O Dashboard deve permitir que o administrador entenda a situação dos ministérios rapidamente.

Topo:

“Bom dia, Ana 👋”

Resumo:

ESCALAS PRÓXIMAS
5

CONFIRMAÇÕES PENDENTES
3

TROCAS PENDENTES
1

ESCALAS INCOMPLETAS
2

Abaixo:

PENDÊNCIAS

- 3 pessoas ainda não confirmaram
- 1 pedido de troca
- 2 vagas abertas

Botão:
[Resolver pendências]

Depois:

PRÓXIMAS ESCALAS

Mostrar cards.

Depois:

VOLUNTÁRIO DO MÊS

Mostrar foto e destaque.

ADMIN — MINISTÉRIOS

Lista de ministérios.

Cada card:
- ícone
- nome
- quantidade de membros
- quantidade de escalas próximas

Botão:
[Adicionar ministério]

ADMIN — CRIAR MINISTÉRIO

Campos:

Nome
Descrição
Ícone
Cor

Botão:
[Criar ministério]

ADMIN — FUNÇÕES

Dentro de cada ministério:

Lista de funções.

Exemplo:

🎹 Teclado
👤 1 pessoa
Limite: 1

Botão:
[Adicionar função]

Funções são totalmente manuais.

Administrador poderá:
- criar
- editar
- excluir
- definir quantidade máxima de pessoas

ADMIN — VOLUNTÁRIOS

Lista de voluntários.

Pesquisar.

Filtros:
- Ministério
- Função
- Administradores

Cada usuário mostra:
- foto
- nome
- ministério
- função
- status

ADMIN — PERFIL DO VOLUNTÁRIO

Mostrar:

Foto
Nome
Telefone
E-mail

Ministérios

Funções

Histórico

Badges

Presença

Botão:
[Promover a administrador]

ADMIN — CRIAR ESCALA

Fluxo:

1. Selecionar ministério
2. Selecionar data
3. Selecionar horário
4. Definir nome/evento
5. Adicionar funções
6. Adicionar voluntários em cada função
7. Definir limite de pessoas
8. Vincular repertório
9. Salvar ou publicar

IMPORTANTE:
A escala é criada DENTRO de um ministério.

O administrador deve entrar no ministério correspondente antes de criar sua escala.

Exemplo:

Ministério:
Louvor

Data:
17/08

Horário:
19:00

Funções:

🎹 Teclado → Ana
🎤 Vocal → João
🥁 Bateria → Maria

ADMIN — ESCALAS

Lista mensal de escalas.

Filtros:
- Ministério
- Status
- Data

Ações:
- visualizar
- editar
- duplicar
- excluir

Mostrar indicadores:

🟢 Completa
🟡 Incompleta
🔴 Crítica

ADMIN — RECORRÊNCIA

Permitir criar escalas recorrentes.

Exemplos:

Toda quinta-feira
Domingo de manhã
Domingo à noite

O administrador escolhe:
- dia
- horário
- período
- ministério

Não assumir horários fixos.

O administrador sempre escolhe o horário.

ADMIN — REPERTÓRIOS

Criar:

Playlist
Nome
Descrição
Data

Adicionar músicas.

Reordenar músicas.

Vincular playlist à escala.

ADMIN — BIBLIOTECA MUSICAL

CRUD de músicas.

Campos:

Nome
Artista
Tom
BPM
Quem canta/ministra
Cifra Club
YouTube
Observações

Pesquisar e filtrar.

ADMIN — FEED

Criar post.

Tipos:
- Aviso
- Evento
- Escala aberta
- Voluntário do mês
- Aniversário

Adicionar:
- texto
- imagem

Selecionar ministério.

ADMIN — SOLICITAÇÕES

Central de solicitações.

Categorias:

ENTRADA EM MINISTÉRIO

TROCA DE ESCALA

QUERO SERVIR

Cada solicitação mostra:

Pessoa
Ministério
Escala
Data
Justificativa
Data da solicitação

Ações:
[Aprovar]
[Recusar]

ADMIN — RELATÓRIOS

Criar uma tela simples de indicadores.

Mostrar:

- escalas realizadas
- confirmações
- recusas
- trocas
- participação
- voluntários ativos
- escalas incompletas

Usar gráficos simples e visualmente leves.

Não transformar o dashboard em uma central de BI complexa.

PRIMEIRO ACESSO E ENTRADA EM MINISTÉRIOS

IMPORTANTE:

Um usuário não deve ficar bloqueado simplesmente porque ainda não pertence a um ministério.

O fluxo deve ser:

Cadastro
↓
Onboarding
↓
Visualizar ministérios existentes
↓
Escolher “Quero Servir”
↓
Solicitação enviada
↓
Administrador recebe notificação
↓
Administrador aprova
↓
Usuário entra no ministério

O usuário pode solicitar entrada em mais de um ministério.

Criar tela:
“Seu pedido foi enviado 🙌”

Mostrar status:
Pendente
Aprovado
Recusado

Enquanto aguarda aprovação, o usuário ainda pode:
- acessar perfil
- configurar tema
- configurar disponibilidade
- visualizar o onboarding
- visualizar ministérios disponíveis

Não mostrar conteúdo interno dos ministérios aos quais ainda não pertence.

RESPONSIVIDADE

Prioridade:

1. Mobile
2. Tablet
3. Desktop

Mobile:
- largura confortável
- navegação inferior
- cards
- ações com uma mão
- botões grandes
- textos legíveis

Desktop:
- aproveitar espaço
- dashboard em grid
- navegação lateral
- múltiplas colunas quando fizer sentido

Não simplesmente esticar a versão mobile.

Criar layouts responsivos verdadeiros.

COMPONENTES

Criar componentes reutilizáveis:

- Button
- Card
- Avatar
- Badge
- Status
- Bottom Navigation
- Sidebar
- Modal
- Drawer
- Input
- Select
- Date Picker
- Time Picker
- Tabs
- Toast
- Notification Item
- Schedule Card
- Ministry Card
- Song Card
- Playlist Card
- Feed Post
- Achievement Card
- Volunteer of the Month Card
- Empty State
- Loading State
- Error State

ESTADOS

Toda tela importante deve considerar:

- carregando
- vazio
- erro
- sucesso
- pendente
- completo

Criar empty states amigáveis.

Exemplo:

“Nada por aqui ainda 😴”

ACESSIBILIDADE

- contraste adequado
- textos legíveis
- áreas de toque grandes
- não depender somente de cor para status
- labels claros
- foco visível

MICROINTERAÇÕES

Usar animações leves para:

- confirmação de escala
- conclusão de tarefa
- conquista desbloqueada
- troca aprovada
- reação no feed
- mudança de tema

As animações devem ser rápidas e não atrapalhar a utilização.

DADOS DEMONSTRATIVOS

Utilizar dados fictícios para que o protótipo pareça completo.

Exemplo de voluntários:
- Ana
- João
- Maria
- Lucas
- Júlia

Exemplo de ministérios:
- Louvor
- Mídia

Criar algumas escalas futuras, músicas, posts, notificações e conquistas para demonstrar os fluxos.

REGRAS IMPORTANTES

- Um usuário pode participar de vários ministérios.
- Cada ministério possui seu próprio feed.
- Cada ministério possui suas próprias escalas.
- Funções são criadas manualmente.
- Escalas são criadas dentro de um ministério.
- Administradores também podem ser voluntários.
- Administradores podem promover outros usuários.
- Trocas precisam de aprovação do administrador.
- Candidaturas para escalas abertas precisam de aprovação.
- Solicitações de entrada em ministérios precisam de aprovação.
- O usuário deve escolher se deseja tema claro ou escuro.
- A cor de destaque deve ser personalizável.
- O app deve ser jovem e descontraído.
- Não criar chat privado.
- Não criar sistema multi-igreja nesta versão.
- Não criar financeiro.
- Não criar funcionalidades que não estejam relacionadas ao propósito principal.

RESULTADO ESPERADO

Criar um protótipo de alta fidelidade do Escalaê que pareça um produto real pronto para ser desenvolvido.

A prioridade é:

1. Clareza
2. Simplicidade
3. Experiência mobile
4. Organização
5. Comunidade
6. Engajamento
7. Aparência moderna

O Escalaê deve parecer um aplicativo que os voluntários realmente gostariam de abrir no celular, e não um sistema administrativo obrigatório.

Criar todas as telas e fluxos principais descritos acima, conectando a navegação entre elas e utilizando componentes consistentes.