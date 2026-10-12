# Escalae — aplicação frontend local

As três interfaces funcionam com dados locais, sem serviço de dados remoto, validação externa de credenciais ou implantação de infraestrutura de servidor.

## Interfaces

- `src/`: aplicativo React com TypeScript, Tailwind, React Router e Zustand. As alterações ficam no armazenamento do navegador. O botão de exportação baixa uma cópia JSON; a importação ainda não está implementada nessa interface.
- `rebuild/web/`: interface alternativa com exemplos em memória. Executar `npm run dev:rebuild`. Não compartilha os dados do aplicativo React.
- `rebuild/pessoal/Escalae.html`: interface independente, com exemplos em memória e ações manuais de exportação e importação. Não compartilha dados com as outras interfaces.

As áreas administrativas e de voluntários são formas de explorar a interface. As telas de login, cadastro e recuperação não validam credenciais nem enviam mensagens. O perfil inicial é de exemplo.

## Execução e verificações

Requer Node.js 24 ou superior e dependências instaladas.

```sh
npm run dev
npm run typecheck
npm test
npm run lint
npm run build:verify
```

Quando o carregamento padrão da configuração Vite encontra uma restrição de acesso no ambiente, a compilação pode ser verificada com `npx vite build --configLoader native`. A interface alternativa já utiliza esse carregamento.

As fontes, imagens e links públicos preservados podem precisar de internet. Esses recursos visuais não são serviços de armazenamento ou autenticação do aplicativo.

## Dados locais

Na interface React, recarregar a página preserva os registros salvos nesse navegador. Limpar os dados do site pode apagá-los. Baixe uma cópia antes dessa operação. Falhas ao salvar desfazem a alteração e exibem um aviso; conteúdo salvo ilegível é preservado e bloqueia novas gravações.

Não há sincronização entre dispositivos, navegadores ou interfaces. Nenhuma variável de ambiente de serviço remoto é necessária para executar as interfaces.
