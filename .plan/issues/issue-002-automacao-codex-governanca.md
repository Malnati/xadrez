# Issue 002 — Automação Codex de governança

## Objetivo

Automatizar o ciclo Codex para que tarefas, issues, Project 14, PRs, `.plan` e merge seguro permaneçam sincronizados no projeto Xadrez Medieval.

## Contexto

A governança inicial criou a estrutura `.plan`, Issue #1 e PR #2. A thread de ajustes globais do Codex também consolidou a rota correta para GitHub ProjectV2: todo ProjectV2 deve usar `/Users/mal/.codex/bin/mbra-projects-gh` ou `/Users/mal/.codex/bin/mbra-projects-github-env -- <command>`, sem `gh project` direto e sem fallback por admin/keyring. Esta issue transforma essas regras em artefatos repo-locais executáveis.

## Escopo

- Criar `AGENTS.md` no repositório com regras obrigatórias para Codex.
- Criar `.codex/project-governance.json` com configuração de governança.
- Criar scripts em `scripts/codex/` para:
  - validar links e seções `.plan`;
  - criar/sincronizar GitHub issue a partir de `.plan`;
  - criar/atualizar PR vinculada;
  - preparar merge seguro e auto-merge quando permitido.
- Criar workflows `.github/workflows/codex-governance.yml` e `.github/workflows/codex-auto-merge.yml`.
- Atualizar `.plan/README.md` com Issue 002.
- Sincronizar Issue 002 com GitHub e Project 14.

## Fora de escopo

- Alterar gameplay, i18n, backend, autenticação, banco ou UI.
- Criar nova tela ou screenshot de produto.
- Bypassar branch protection ou checks obrigatórios.
- Forçar merge se houver conflito semântico ou validação vermelha.
- Expor tokens ou alterar credenciais globais.

## Marco

- Arquivo: [`../marcos/marco-02-automacao-codex-governanca.md`](../marcos/marco-02-automacao-codex-governanca.md)
- Nome: Marco 02 — Automação Codex de governança
- ProjectV2: [Project 14](https://github.com/users/Malnati/projects/14/)

## Critérios de aceite

- `AGENTS.md` repo-local existe e instrui Codex a controlar tarefas por `.plan`, GitHub issues, Project 14 e PRs.
- `.codex/project-governance.json` declara repo, Project 14, branch padrão, prefixo `codex/`, validações e política de merge.
- `scripts/codex/validate-plan-links.mjs` valida se issues `.plan` contêm seções e links obrigatórios.
- `scripts/codex/github-sync-issue.mjs` possui `--dry-run`, cria/atualiza issue a partir de `.plan` e usa wrapper para Project 14.
- `scripts/codex/github-open-pr.mjs` possui `--dry-run`, cria/atualiza PR vinculada à issue e usa wrapper para Project 14.
- `scripts/codex/auto-merge-pr.mjs` possui `--dry-run` e bloqueia merge quando checks, branch sync ou validações falham.
- Workflows GitHub validam rastreabilidade `.plan` em PR.
- Issue 002 existe no GitHub e referencia este arquivo.
- Issue 002 está no Project 14 via wrapper, salvo blocker explícito.
- PR #2 referencia Issue 001, Issue 002, marcos, `.plan` e Project 14.
- Validações locais passam.

## Plano de execução

1. Atualizar `.plan/README.md` com rota ProjectV2 final e Issue 002.
2. Criar marco `marco-02-automacao-codex-governanca.md`.
3. Criar este arquivo detalhado.
4. Criar `AGENTS.md` repo-local.
5. Criar `.codex/project-governance.json`.
6. Implementar `validate-plan-links.mjs` e self-test.
7. Implementar `github-sync-issue.mjs` com `--dry-run` e wrapper ProjectV2.
8. Implementar `github-open-pr.mjs` com `--dry-run` e wrapper ProjectV2.
9. Implementar `auto-merge-pr.mjs` com `--dry-run` e bloqueios seguros.
10. Criar workflows GitHub.
11. Rodar validações locais.
12. Criar GitHub Issue 002.
13. Adicionar Issue 002 ao Project 14 pelo wrapper.
14. Atualizar `.plan` com links reais.
15. Atualizar PR #2 com Issue 002 e evidências.
16. Commitar e publicar branch.

## Validação/testes

```bash
git diff --check
node scripts/codex/validate-plan-links.mjs
node scripts/codex/validate-plan-links.mjs --self-test
node scripts/codex/github-sync-issue.mjs --dry-run .plan/issues/issue-002-automacao-codex-governanca.md
node scripts/codex/github-open-pr.mjs --dry-run --issue 2
node scripts/codex/auto-merge-pr.mjs --dry-run --pr 2
pnpm test
pnpm typecheck
pnpm build
python3 -B /Users/mal/.codex/hooks/github_projects_pat_gate.py --self-test
/Users/mal/.codex/bin/mbra-projects-gh project view 14 --owner Malnati --format json
```

Resultado esperado:

- Todos os comandos locais terminam com exit code 0, exceto prova de bloqueio intencional do hook.
- Dry-runs mostram ações planejadas sem mutar GitHub.
- Project 14 é acessível pelo wrapper.
- `gh project` direto é bloqueado pelo hook global.

## Evidências esperadas

- Commit com `AGENTS.md`, `.codex/project-governance.json`, scripts e workflows.
- URL da GitHub Issue 002.
- Confirmação de item da Issue 002 no Project 14.
- PR #2 atualizado com Issue 002.
- Saídas das validações locais.
- Evidência de hook global ProjectV2.

## Links

- Project 14: [Malnati / xadrez](https://github.com/users/Malnati/projects/14/)
- Marco: [`../marcos/marco-02-automacao-codex-governanca.md`](../marcos/marco-02-automacao-codex-governanca.md)
- GitHub issue: [Issue #3](https://github.com/Malnati/xadrez/issues/3).
- Pull request: [PR #2](https://github.com/Malnati/xadrez/pull/2).

## Status operacional

- Estado: Em implementação.
- Sincronização Project 14: Issue adicionada ao Project 14 via `/Users/mal/.codex/bin/mbra-projects-gh` em 2026-06-25.
- Evidência visual: Não aplicável; mudança de governança sem tela de produto.

## Evidência de execução

- GitHub issue criada: [Issue #3](https://github.com/Malnati/xadrez/issues/3).
- Issue adicionada ao Project 14 por `node scripts/codex/github-sync-issue.mjs .plan/issues/issue-002-automacao-codex-governanca.md`.
- PR alvo para esta continuação: [PR #2](https://github.com/Malnati/xadrez/pull/2).
- `git diff --check` passou em 2026-06-25.
- `node scripts/codex/validate-plan-links.mjs` passou em 2026-06-25.
- `node scripts/codex/validate-plan-links.mjs --self-test` passou em 2026-06-25.
- `node scripts/codex/github-sync-issue.mjs --dry-run .plan/issues/issue-002-automacao-codex-governanca.md` passou em 2026-06-25.
- `node scripts/codex/github-open-pr.mjs --dry-run --issue 3` passou em 2026-06-25.
- `node scripts/codex/auto-merge-pr.mjs --dry-run --pr 2` passou em 2026-06-25; PR #2 está aberta, draft, mergeable e clean.
- `pnpm test` passou em 2026-06-25: 4 arquivos de teste, 6 testes aprovados.
- `pnpm typecheck` passou em 2026-06-25.
- `pnpm build` passou em 2026-06-25; Vite emitiu apenas aviso de chunk grande já existente.
- `python3 -B /Users/mal/.codex/hooks/github_projects_pat_gate.py --self-test` passou em 2026-06-25 com 8 testes.
- `/Users/mal/.codex/bin/mbra-projects-gh project view 14 --owner Malnati --format json` confirmou Project 14 `xadrez`.
- Simulação de `gh project view 14 --owner Malnati` foi bloqueada pelo hook global com exit 2 e orientação para o wrapper ProjectV2.
- Project 14 item-list confirmou Issue #1, PR #2 e Issue #3 no quadro.
