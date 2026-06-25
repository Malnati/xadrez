# Issue 003 — i18n e E2E multilíngue

## Objetivo

Implementar a camada multilíngue do frontend e validar o início de partida convidado contra computador em `pt-BR`, `en-US` e `es-419`, mantendo o plano profundo, rastreável e sincronizado com GitHub Issue, Project 14 e PR Codex.

## Contexto

O MVP atual permite jogar como convidado contra o computador, escolher cor e executar o primeiro lance sem autenticação. A próxima atualização planejada é internacionalizar a experiência inicial sem alterar autenticação, backend ou persistência remota. A UI deve continuar usando linguagem de produto, sem expor detalhes de implementação ou fornecedores, e deve preservar o estado do jogo quando o idioma muda.

## Escopo

- Criar dicionários `pt-BR`, `en-US` e `es-419` para textos e labels acessíveis do fluxo principal.
- Criar provedor/hook de idioma com fallback seguro para `pt-BR`.
- Criar escolha inicial obrigatória de idioma quando não houver idioma salvo.
- Persistir idioma em `localStorage` com chave versionada.
- Atualizar `html[lang]` conforme idioma ativo.
- Adicionar seletor de idioma no cabeçalho após a escolha inicial.
- Traduzir:
  - cabeçalho e botão público `Entrar`;
  - status de turno e pensamento do oponente;
  - seleção de modo e seleção de cor;
  - relógio;
  - histórico, posição atual e partidas salvas;
  - labels acessíveis do tabuleiro e casas;
  - estados vazios e mensagens de apoio.
- Garantir que trocar idioma não reinicie jogo, histórico local do lance, posição ou relógio.
- Atualizar testes unitários de render e i18n.
- Expandir Playwright para início de partida nos três idiomas, persistência após reload e troca sem reset.
- Corrigir automação Codex se algum script repo-local bloquear PR/Project 14 seguro.

## Fora de escopo

- Implementar login, Google Authentication, backend obrigatório ou Postgres para o fluxo convidado.
- Criar servidor de tradução ou detectar idioma por geolocalização.
- Alterar engine do computador ou regra de xadrez.
- Mudar visual medieval aprovado além do necessário para encaixar idiomas.
- Traduzir a marca `Xadrez Medieval` se ela estiver sendo usada como nome do produto.
- Salvar screenshots de sucesso dentro do repo; Playwright pode gerar artefatos apenas em falha.

## Marco

- Arquivo: [`../marcos/marco-03-i18n-e2e-multilingue.md`](../marcos/marco-03-i18n-e2e-multilingue.md)
- Nome: Marco 03 — i18n e E2E multilíngue
- ProjectV2: [Project 14](https://github.com/users/Malnati/projects/14/)

## Critérios de aceite

- Sem `localStorage` de idioma, a primeira tela exibe a escolha de idioma e não mostra os controles de jogo antes da escolha.
- Escolher português exibe `Entrar`, `Você joga com as brancas`, `Turno das brancas` e permite `e2 -> e4`.
- Escolher inglês exibe `Sign in`, `You play as White`, `White to move` e permite `e2 -> e4`.
- Escolher espanhol latino-americano exibe `Entrar`, `Juegas con blancas`, `Turno de blancas` e permite `e2 -> e4`.
- Nos três idiomas, o histórico registra `e4`, o computador responde com um lance válido e o turno retorna para as brancas.
- O botão público de acesso continua visível e não é clicado pelo E2E.
- O fluxo convidado não exige token, callback, login, API, banco ou servidor externo.
- Reload preserva o idioma escolhido e mantém `html[lang]` correto.
- Trocar idioma pelo cabeçalho após o lance `e4` preserva o histórico e a posição atual.
- E2E EN/ES não encontra os textos controlados em português `Nova partida`, `Você joga`, `Turno das`, `Histórico`, exceto o nome do produto quando aplicável.
- Unitários validam chaves completas dos dicionários e fallback.
- `pnpm format`, `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build` e `pnpm test:e2e` passam.

## Plano de execução

1. Criar este arquivo detalhado e o Marco 03 antes de alterar código.
2. Atualizar `.plan/README.md` com Issue 003, Marco 03, status e links pendentes.
3. Rodar `node scripts/codex/validate-plan-links.mjs --allow-pending-github --allow-pending-pr`.
4. Rodar `node scripts/codex/github-sync-issue.mjs --dry-run .plan/issues/issue-003-i18n-e2e-multilingue.md`.
5. Sincronizar GitHub Issue 003 real e adicionar ao Project 14 pelo wrapper.
6. Atualizar `.plan` com URL real da issue.
7. Implementar arquivos de i18n:
   - `apps/web/src/i18n/locales.ts`;
   - `apps/web/src/i18n/messages.ts`;
   - `apps/web/src/i18n/locale-provider.tsx`;
   - `apps/web/src/components/i18n/LanguageGate.tsx`.
8. Envolver o app com o provedor no entrypoint.
9. Atualizar `App.tsx` para gate inicial, seletor de idioma e textos traduzidos.
10. Atualizar componentes de jogo para usar dicionário e labels traduzidos.
11. Atualizar testes unitários existentes para escolher idioma antes do render principal.
12. Criar testes unitários específicos de dicionário e fallback.
13. Expandir `apps/web/e2e/computer-opening.spec.ts` para cenários multilíngues.
14. Corrigir scripts Codex detectados como quebrados durante dry-run/PR, mantendo `--dry-run`.
15. Rodar validações completas.
16. Abrir PR draft/ready com `Closes #N`, links `.plan`, Marco 03 e Project 14.
17. Adicionar PR ao Project 14 pelo wrapper.
18. Aguardar checks remotos; mesclar automaticamente se seguro.
19. Atualizar `.plan` com evidências finais e status.

## Validação/testes

```bash
git diff --check
node scripts/codex/validate-plan-links.mjs
node scripts/codex/validate-plan-links.mjs --self-test
node scripts/codex/github-sync-issue.mjs --dry-run .plan/issues/issue-003-i18n-e2e-multilingue.md
node scripts/codex/github-open-pr.mjs --dry-run --issue 4
node scripts/codex/auto-merge-pr.mjs --dry-run --pr <PR>
pnpm format
pnpm lint
pnpm test
pnpm typecheck
pnpm build
pnpm test:e2e
python3 -B /Users/mal/.codex/hooks/github_projects_pat_gate.py --self-test
/Users/mal/.codex/bin/mbra-projects-gh project view 14 --owner Malnati --format json
```

Resultado esperado:

- Todos os comandos aplicáveis terminam com exit code 0.
- Dry-runs mostram ações sem mutar GitHub.
- E2E executa início de partida nos três idiomas.
- Nenhum teste depende de autenticação.
- Nenhuma rota ProjectV2 proibida é usada.

## Evidências esperadas

- GitHub issue criada e adicionada ao Project 14.
- PR criada, vinculada à issue e adicionada ao Project 14.
- Saída das validações locais completas.
- Saída do E2E mostrando cenários multilíngues aprovados.
- Confirmação de que o botão `Entrar`/`Sign in` permanece visível e sem clique no E2E.
- Screenshot de evidência visual para PR de UI se necessário, armazenado em `docs/assets/issues/...` somente se for exigido para fechamento.

## Links

- Project 14: [Malnati / xadrez](https://github.com/users/Malnati/projects/14/)
- Marco: [`../marcos/marco-03-i18n-e2e-multilingue.md`](../marcos/marco-03-i18n-e2e-multilingue.md)
- GitHub issue: [Issue #4](https://github.com/Malnati/xadrez/issues/4).
- Pull request: [PR #5](https://github.com/Malnati/xadrez/pull/5).

## Orientação visual

Usar como referência de orientação o visual medieval já versionado no MVP:

<p align="center">
  <a href="https://github.com/Malnati/xadrez/blob/main/docs/assets/issues/mvp/xadrez-medieval-mvp.png" target="_blank" rel="noopener noreferrer">
    <img src="https://github.com/Malnati/xadrez/raw/main/docs/assets/issues/mvp/xadrez-medieval-mvp.png" alt="Tela principal do Xadrez Medieval com tabuleiro, painéis e HUD" width="50%">
  </a>
</p>

<p align="center">
  <a href="https://github.com/Malnati/xadrez/blob/main/docs/assets/issues/mvp/xadrez-medieval-mvp.png" target="_blank" rel="noopener noreferrer">Abrir imagem em nova aba/janela</a>
</p>

## Status operacional

- Estado: Implementado localmente; PR #5 aberta.
- Sincronização Project 14: Issue adicionada via `/Users/mal/.codex/bin/mbra-projects-gh` em 2026-06-25.
- Evidência visual: referência existente do MVP; evidência final será anexada à PR se a validação visual exigir.

## Evidência de execução

- GitHub issue criada: [Issue #4](https://github.com/Malnati/xadrez/issues/4).
- Issue adicionada ao Project 14 por `node scripts/codex/github-sync-issue.mjs .plan/issues/issue-003-i18n-e2e-multilingue.md` em 2026-06-25.
- Browser interno validou o fluxo renderizado em `http://127.0.0.1:5173/` com `html[lang]="en-US"`, dois lances no histórico, status `white to move · Ready for your move` e console sem erros/warnings relevantes.
- Evidência visual versionada: [`../../docs/assets/issues/004/i18n-multilingue-evidence.png`](../../docs/assets/issues/004/i18n-multilingue-evidence.png).
- `git diff --check` passou em 2026-06-25.
- `node scripts/codex/validate-plan-links.mjs --allow-pending-github --allow-pending-pr` passou em 2026-06-25 antes da PR existir.
- `node scripts/codex/validate-plan-links.mjs --self-test` passou em 2026-06-25.
- `node scripts/codex/github-sync-issue.mjs --dry-run .plan/issues/issue-003-i18n-e2e-multilingue.md` passou em 2026-06-25.
- `node scripts/codex/github-open-pr.mjs --dry-run --issue 4 --title "feat(web): add multilingual game flow"` passou em 2026-06-25.
- `pnpm format` passou em 2026-06-25.
- `pnpm lint` passou em 2026-06-25.
- `pnpm test` passou em 2026-06-25: shared 4 testes, api 1 teste, web 6 testes.
- `pnpm typecheck` passou em 2026-06-25.
- `pnpm build` passou em 2026-06-25; Vite manteve apenas aviso de chunk grande já existente.
- `pnpm test:e2e` passou em 2026-06-25: 7 testes Chromium cobrindo gate de idioma, `pt-BR`, `en-US`, `es-419`, persistência, troca sem reset e ausência de vazamento de português em EN/ES.
