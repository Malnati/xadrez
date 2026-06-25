# Issue 001 — Governança `.plan` + GitHub Project 14

## Objetivo

Criar a base de governança do projeto Xadrez Medieval por arquivos Markdown versionados em `.plan/` e sincronização operacional com GitHub Project 14.

## Contexto

O projeto precisa de controle explícito de marcos, issues e PRs. A documentação profunda deve ficar no disco para ser revisada por humanos, reutilizada por Codex e versionada junto com o produto. O GitHub Project 14 deve refletir o andamento operacional de issues e PRs, mas não substituir a especificação detalhada do repositório.

## Escopo

- Criar `.plan/README.md` como índice e guia operacional.
- Criar `.plan/marcos/marco-01-governanca-plan-project14.md`.
- Criar este arquivo em `.plan/issues/issue-001-governanca-plan-project14.md`.
- Criar GitHub issue para esta tarefa, referenciando este arquivo.
- Adicionar a GitHub issue ao Project 14.
- Criar PR para os arquivos `.plan`.
- Adicionar o PR ao Project 14.
- Atualizar os arquivos `.plan` com links reais de issue e PR.

## Fora de escopo

- Implementar funcionalidade nova no jogo.
- Modificar API, frontend, banco, schema, IA ou Playwright.
- Criar screenshots, porque não há mudança visual de produto nesta issue.
- Criar todos os marcos futuros do produto; esta issue cria apenas a governança inicial.

## Marco

- Arquivo: [`../marcos/marco-01-governanca-plan-project14.md`](../marcos/marco-01-governanca-plan-project14.md)
- Nome: Marco 01 — Governança `.plan` + GitHub Project 14
- ProjectV2: [Project 14](https://github.com/users/Malnati/projects/14/)

## Critérios de aceite

- `.plan/README.md` existe e explica a estrutura de governança.
- `.plan/marcos/` existe com pelo menos um marco detalhado.
- `.plan/issues/` existe com pelo menos esta issue detalhada.
- Cada issue Markdown contém objetivo, contexto, escopo, fora de escopo, marco, critérios de aceite, plano de execução, validação, evidências esperadas e links.
- Cada marco Markdown contém objetivo, issues vinculadas, ordem de execução, critérios de conclusão, dependências, riscos e evidências.
- GitHub issue criada referencia este arquivo detalhado.
- GitHub issue adicionada ao Project 14, salvo blocker documentado.
- PR criado referencia issue, marco, arquivo detalhado e Project 14.
- PR adicionado ao Project 14, salvo blocker documentado.
- `git diff --check` passa.
- `pnpm format` passa.

## Plano de execução

1. Criar diretórios `.plan/marcos/` e `.plan/issues/`.
2. Escrever `.plan/README.md` com índice, regras, checklists e validação padrão.
3. Escrever marco inicial com objetivo, escopo, ordem, riscos e evidências.
4. Escrever esta issue detalhada.
5. Validar que todos os links relativos entre `.plan/README.md`, marco e issue resolvem no repositório.
6. Rodar `git diff --check`.
7. Rodar `pnpm format`.
8. Commitar com Conventional Commit.
9. Publicar branch no GitHub.
10. Criar GitHub issue com corpo apontando para este arquivo.
11. Adicionar GitHub issue ao Project 14 usando comando ProjectV2 permitido localmente.
12. Criar PR com corpo apontando para issue, marco e este arquivo.
13. Adicionar PR ao Project 14 usando comando ProjectV2 permitido localmente.
14. Atualizar `.plan` com URLs reais de issue e PR.
15. Commitar e publicar atualização de links.

## Validação/testes

### Validação documental

```bash
git diff --check
pnpm format
```

Resultado esperado:

- `git diff --check` sem saída de erro.
- `pnpm format` finaliza com código 0.

### Validação GitHub

```bash
gh issue view <numero> --repo Malnati/xadrez --json url,title,state
/Users/mal/.codex/bin/mbra-projects-gh project view 14 --owner Malnati --format json
/Users/mal/.codex/bin/mbra-projects-gh project item-list 14 --owner Malnati --format json --limit 100
```

Resultado esperado:

- Issue existe no repositório.
- Project 14 existe e está acessível.
- Item da issue aparece no Project 14.
- Item do PR aparece no Project 14 após criação do PR.

## Evidências esperadas

- Commit com arquivos `.plan`.
- URL da GitHub issue.
- ID ou confirmação do item da issue no Project 14.
- URL do PR.
- ID ou confirmação do item do PR no Project 14.
- Saídas de validação documental.

## Links

- Project 14: [Malnati / xadrez](https://github.com/users/Malnati/projects/14/)
- Marco: [`../marcos/marco-01-governanca-plan-project14.md`](../marcos/marco-01-governanca-plan-project14.md)
- GitHub issue: [Issue #1](https://github.com/Malnati/xadrez/issues/1).
- Pull request: [PR #2](https://github.com/Malnati/xadrez/pull/2).

## Status operacional

- Estado: Em implementação.
- Sincronização Project 14: Issue adicionada; PR vinculado ao Project 14 e verificado via `gh pr view`.
- Evidência visual: Não aplicável; mudança documental sem tela de produto.

## Evidência de execução

- GitHub issue criada: [Issue #1](https://github.com/Malnati/xadrez/issues/1).
- Issue adicionada ao Project 14 e verificada por `project item-list` em 2026-06-25.
- Pull request criado: [PR #2](https://github.com/Malnati/xadrez/pull/2).
- Pull request vinculado ao Project 14 e verificado por `gh pr view --json projectItems` em 2026-06-25.
- `git diff --check` passou.
- `pnpm exec prettier --check .plan/README.md .plan/issues/issue-001-governanca-plan-project14.md .plan/marcos/marco-01-governanca-plan-project14.md` passou.
- `pnpm test` passou em 2026-06-25: 4 arquivos de teste, 6 testes aprovados.
- `pnpm format` global falhou por baseline preexistente fora de `.plan` com 53 arquivos já não formatados; código alheio não foi reformatado nesta issue documental.
