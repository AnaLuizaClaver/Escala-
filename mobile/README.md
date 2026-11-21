# Escalaê mobile

Primeira sprint do aplicativo do voluntário, com dados de demonstração. O progresso da fase e a confirmação da escala permanecem em memória enquanto o aplicativo está aberto. A autenticação real será integrada ao Supabase em uma etapa posterior.

## Prévia no VS Code e no telefone

No terminal da raiz do repositório:

```powershell
npm --prefix mobile ci
npm run dev:mobile
```

Abra o QR code com um Expo Go compatível com o SDK 54. Deixe o computador e o celular na mesma rede. Para testar em um emulador Android já configurado, pressione `a` no terminal do Expo.

Para uma prévia local no computador, pressione `w` e abra o endereço indicado no navegador ou no **Simple Browser: Show** do VS Code. O jogo pertence à pasta mobile. O site administrativo continua sendo servido pelos comandos da raiz e tem sua própria implantação.

## O que testar

1. Toque em **Entrar na demonstração**.
2. Abra **Escalas**, confira o ingresso e confirme presença. O estado também muda no **Início**.
3. Abra **Jogar**, inicie a aula no mapa e acerte o quiz. Na missão, escolha uma foto ou vídeo, ou use a evidência de exemplo. Envie e toque em **Simular aprovação** para ver **Subiu de nível**. A figurinha e os 120 XP aparecem no jogo e no **Perfil**. Os arquivos selecionados ficam no aparelho nesta demonstração.
4. Em **Perfil**, toque em **Sair da demonstração** para retornar à tela inicial.

## App instalável

O GitHub Pages publica a versão web desta pasta em `/app/` dentro do endereço do Escalaê. No iPhone, abra o endereço no Safari e use **Compartilhar → Adicionar à Tela de Início**. No Android, abra no Chrome e procure **Instalar app** no menu.

Para gerar a pasta estática localmente, rode `npm --prefix mobile run build:pwa` na raiz. O resultado fica em `mobile/dist/pwa`. A variável `ESCALAE_PWA_BASE` define o subcaminho em produção. O app publicado ainda opera em modo demonstração.
