# Limpeza do backend — 12/10/2026

## Resultado

As três interfaces existentes foram preservadas. A interface React abre sem autenticação e mantém a navegação de voluntário e administrador. Dados e alterações permanecem em memória, sem localStorage, sessionStorage ou IndexedDB. Fontes, imagens e links públicos já presentes continuam disponíveis.

## Arquivos excluídos

- `src/lib/supabase.ts`
- `src/lib/firebase/config.ts`, `src/lib/firebase/runtime.ts`
- `src/services/auth/contracts.ts`, `src/services/auth/firebaseAuthService.ts`
- `src/services/firestore/ministryRepository.ts`
- `src/context/AuthContext.tsx`, `src/hooks/useAuth.ts`
- `src/app/AdminDashboardView.tsx`: placeholder vazio, sem consumidores; o dashboard efetivo continua em App.tsx.
- `rebuild/database/bootstrap.mjs`, `commands.mjs`, `database.test.mjs`, `firebase.e2e.test.mjs`, `functions.mjs`, `runtime.mjs`, `server.mjs`, `service.mjs`, `package.json`, `package-lock.json`
- `scripts/firebase-local.mjs`, `scripts/firebase-rebuild.mjs`
- `tests/firebase-config.test.ts`, `tests/firebase.integration.test.ts`, `tests/firestore.business.test.ts`
- `firebase.json`, `firebase.business.json`, `firebase.rebuild.json`, `.firebaserc`
- `firestore.rules`, `firestore.business.rules`, `firestore.indexes.json`, `firestore.business.indexes.json`
- `supabase_schema.sql`
- `.env`, `.env.firebase.cloud.local`, `.env.firebase.example`
- `tsconfig.tests.json`, `tsconfig.node.tsbuildinfo`, `firestore-debug.log`
- `docs/ETAPA-3-PLANO.md`, `docs/FIREBASE-BANCO-20261011.md`, `docs/FIREBASE-CLOUD.md`, `docs/FIREBASE-LOCAL.md`, `docs/FIREBASE-MODELAGEM.md`, `docs/VSCODE-FIREBASE.md`
- `.firebase/`: cache dos emuladores, configurações e build antigo.

Diretórios esvaziados de serviços, bibliotecas e scripts foram removidos. `.git` e os arquivos históricos de `.stabilization-backup/` não foram alterados; estes últimos não participam da aplicação.

## Arquivos modificados

- `src/app/App.tsx`: 102 operações externas substituídas por ações locais; removidos o provider externo, o bloqueio de login inicial e estados obsoletos.
- `src/app/components/ui/sidebar.tsx`: persistência da barra lateral por cookie removida, mantendo o estado React.
- `src/app/LoginView.tsx`: login como navegação visual; recuperação sem envio de e-mail; acesso sem credenciais.
- `rebuild/web/main.ts`: dados e ações locais, sem SDKs ou funções remotas; páginas e templates preservados.
- `rebuild/web/tsconfig.json`: referências de tipos atualizadas.
- `rebuild/pessoal/Escalae.html`: leitura e escrita persistentes removidas; estado apenas em memória.
- `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`: dependências, scripts e lockfiles limpos.
- `.vscode/tasks.json`, `.gitignore`: tarefas e configurações obsoletas removidas.
- `README.md`: instruções atuais de execução, validação e limitações.

Os builds atualizam os artefatos gerados em `dist/` e `rebuild/web/dist/`.

## Arquivos criados

- `src/mocks/previewData.ts`
- `src/mocks/rebuildPreview.ts`
- `src/context/PreviewContext.tsx`
- `src/hooks/usePreview.ts`
- `tests/frontend.test.ts`
- `tests/navigation.test.ts`
- Este relatório.

## Dependências removidas

- `firebase`
- `firebase-tools`
- `@firebase/rules-unit-testing`
- `@supabase/supabase-js`

`npm install --ignore-scripts --no-audit --no-fund` removeu 711 pacotes desnecessários, incluindo dependências transitivas. O lockfile pnpm foi sincronizado com `pnpm import`. Nenhum novo serviço ou banco foi instalado.

## Componentes adaptados

Home, escalas e detalhes, repertório, feed, ministérios, conquistas, notificações, perfil, disponibilidade e configurações usam mocks locais. O mesmo vale para dashboards, gestão de ministérios e funções, voluntários, escalas e criação de escalas, solicitações de entrada e troca, relatórios, repertório e feed administrativos. Na interface alternativa, visão geral, ministérios, pessoas, eventos, escalas e disponibilidade usam dados locais.

Login, cadastro, seleção de ministério, aprovação e recuperação de senha mantêm suas telas. Não há autenticação, confirmação de e-mail, envio de recuperação ou autorização real. Formulários de gestão podem modificar exemplos em memória; esses dados desaparecem ao recarregar. Exportação manual da interface pessoal não representa gravação automática nem compartilhamento.

## Validação

- TypeScript: aprovado para React, configuração Vite e interface alternativa.
- Testes: 6 aprovados — datas no fuso de São Paulo, dados relacionados, criação/edição/exclusão em memória, confirmação de escala, publicação de escala alternativa e renderização de suas seis páginas.
- Lint: não configurado originalmente; nenhuma configuração adicionada.
- Build principal: aprovado, com aviso de tamanho do bundle acima de 500 kB.
- Build alternativo: aprovado.
- HTTP local: status 200.
- Navegação: seletores e páginas React preservados por inspeção; seis páginas alternativas verificadas por teste com DOM mínimo. A inspeção visual automatizada no navegador não foi concluída: abertura inicialmente recusada e posterior tentativa excedeu o tempo disponível. Não foi realizada comparação visual pixel a pixel.
- Auditoria das fontes, configurações e lockfiles: sem referências ativas aos SDKs removidos e sem mecanismos de persistência no navegador.

O esbuild precisou ser executado fora do sandbox, pois a leitura de caminhos recebeu acesso negado. Os builds posteriores com permissão foram aprovados. O índice Git já apresentava corrupção antes da limpeza; nenhuma tentativa de reparo ou alteração em `.git` foi feita.

