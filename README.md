# Escalaê

Aplicativo React, TypeScript e Vite. Na interface React, os dados ficam salvos neste navegador e permanecem ao recarregar. Use o botão de backup antes de limpar os dados do navegador. O perfil inicial é de exemplo; não há login real nem sincronização entre dispositivos. Nenhum serviço pago é necessário.

## Executar

Requer Node.js 24 ou superior.

Com a URL e a chave publicável do Supabase em `.env.local`, o app abre a
área de teste online com login, cadastro, ministérios e pedidos de entrada.
Sem essa configuração, abre a demonstração local descrita abaixo.

Para testar dois perfis, cadastre e confirme primeiro o e-mail principal.
No SQL Editor do Supabase, como administrador do banco, execute esta
instrução com o e-mail principal confirmado:

```sql
update public.profiles as profile
set role = 'admin'
from auth.users as account
where profile.id = account.id
  and account.email_confirmed_at is not null
  and lower(account.email) = lower('SEU_EMAIL_PRINCIPAL')
returning profile.id, profile.role;
```

Depois, entre com o segundo e-mail e peça entrada em um ministério. Em
outro perfil de navegador, entre com a conta principal e aprove o pedido.
Volte à conta de voluntário e clique em **Atualizar** para conferir o status.

O arquivo `supabase/schema.sql` é o esquema inicial. A pasta
`supabase/migrations/` contém as alterações posteriores aplicadas ao projeto.

```sh
npm install
npm run dev
```

A aplicação abre diretamente na área do voluntário. A alternância de perfil na barra lateral permite explorar as telas administrativas. O botão Sair abre a interface de login; nela, Explorar sem autenticação retorna à aplicação sem credenciais. Cadastro, seleção de ministério, aprovação e recuperação de senha continuam disponíveis como demonstrações visuais.

## Verificar

```sh
npm run typecheck
npm test
npm run build:verify
```

`build:verify` gera `dist/` e `rebuild/web/dist/`. Não há lint configurado.

## Interfaces preservadas

- `src/app/App.tsx`: aplicação React principal, com navegação por estado.
- `rebuild/web/`: interface alternativa; executar `npm run dev:rebuild` (porta 5174).
- `rebuild/pessoal/Escalae.html`: interface independente, também sem gravação no navegador. Exportar/importar uma cópia continua sendo uma ação manual.

Imagens, fontes e links de conteúdo existentes foram preservados; alguns são recursos públicos externos. Nenhuma tela consulta um serviço de dados ou autenticação.

## Organização dos dados

- `src/mocks/previewData.ts`: exemplos locais e ações sobre arrays em memória para a aplicação React.
- `src/mocks/rebuildPreview.ts`: exemplos e ações locais da interface alternativa.
- `src/context/PreviewContext.tsx`: alternância entre as interfaces de login e aplicação, sem autenticação.

A interface não valida credenciais, cria contas reais, envia e-mails, aplica permissões de segurança ou compartilha alterações. Uma nova arquitetura deverá implementar esses comportamentos explicitamente.

Veja `docs/FRONTEND-LOCAL.md` para orientações sobre as interfaces e os dados locais.

Design de origem: [Figma](https://www.figma.com/design/ndHKbtj0cpkcONd9xX7GGN/Escala%C3%AA).

## Armazenamento local da interface React

`src/shared/state/localData.ts` grava e exporta os dados locais. Falhas de gravação desfazem a alteração e exibem um aviso. Dados ilegíveis são preservados. A cópia exportada usa JSON; a interface React ainda não oferece importação. As interfaces alternativas continuam independentes.
