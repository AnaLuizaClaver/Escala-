# Escalaê

Aplicação frontend em React, TypeScript e Vite. As telas usam dados de demonstração em `src/mocks/`, mantidos somente em memória. Recarregar a página descarta as alterações. Não é necessário configurar variáveis de ambiente ou serviços externos.

## Executar

Requer Node.js 24 ou superior.

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

Veja `docs/LIMPEZA-FRONTEND.md` para o inventário da limpeza e os resultados de validação.

Design de origem: [Figma](https://www.figma.com/design/ndHKbtj0cpkcONd9xX7GGN/Escala%C3%AA).
