# Marco 02 — Automação Codex de governança

## Objetivo

Automatizar o ciclo operacional do Codex para tarefas do projeto Xadrez Medieval, garantindo que `.plan`, GitHub issues, Project 14, PRs e merge seguro permaneçam sincronizados sem depender de decisões manuais repetitivas.

## Contexto

A governança inicial já criou `.plan/`, Issue #1, PR #2 e vínculo com Project 14. O próximo passo é transformar as regras em artefatos executáveis: instruções repo-locais, scripts idempotentes, validações e workflows que impedem PRs sem rastreabilidade e preservam a rota global obrigatória de ProjectV2 via wrapper.

## Escopo

- Criar `AGENTS.md` repo-local com regras de controle automático por Codex.
- Criar `.codex/project-governance.json` como configuração versionada do projeto.
- Criar scripts em `scripts/codex/` para validar `.plan`, sincronizar issue, abrir/atualizar PR e preparar merge seguro.
- Criar GitHub Actions de validação de governança e auto-merge seguro.
- Criar issue detalhada para a automação e sincronizá-la com Project 14.
- Registrar evidências de hook global ProjectV2, wrapper e validação local.

## Fora de escopo

- Alterar gameplay, i18n, backend, banco, autenticação, Stockfish ou UI do jogo.
- Ignorar branch protection ou checks obrigatórios.
- Resolver conflito semântico sem validação verde.
- Expor, imprimir ou persistir tokens.

## Issues vinculadas

| Issue                         | Arquivo detalhado                                                                                        | GitHub                                                 | Project 14                                                  | PR                                                |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------- |
| Automação Codex de governança | [`../issues/issue-002-automacao-codex-governanca.md`](../issues/issue-002-automacao-codex-governanca.md) | [Issue #3](https://github.com/Malnati/xadrez/issues/3) | [Project 14](https://github.com/users/Malnati/projects/14/) | [PR #2](https://github.com/Malnati/xadrez/pull/2) |

## Ordem de execução

1. Atualizar `.plan/README.md` e Issue 001 com a rota global ProjectV2 final.
2. Criar este marco.
3. Criar Issue 002 detalhada.
4. Criar instruções repo-locais `AGENTS.md`.
5. Criar `.codex/project-governance.json`.
6. Criar scripts `scripts/codex/*.mjs` com `--dry-run`.
7. Criar workflows `.github/workflows/*.yml`.
8. Validar scripts e plano localmente.
9. Criar GitHub Issue 002 e adicionar ao Project 14 via wrapper.
10. Atualizar PR #2 com referência à Issue 002 e evidências.
11. Commitar, publicar branch e atualizar `.plan` com links reais.

## Critérios de conclusão

- `AGENTS.md` repo-local existe e exige `.plan` antes de issue/PR.
- `.codex/project-governance.json` existe e declara Project 14, branch padrão, branch prefix, validações e política de merge.
- Scripts Codex existem, têm `--dry-run` e não usam ProjectV2 fora dos wrappers globais.
- `validate-plan-links.mjs` falha quando issue `.plan` obrigatória está incompleta.
- GitHub Actions de governança existem.
- Issue 002 existe no GitHub e referencia `.plan/issues/issue-002-automacao-codex-governanca.md`.
- Issue 002 foi adicionada ao Project 14 por `/Users/mal/.codex/bin/mbra-projects-gh`, ou blocker explícito foi documentado.
- PR #2 referencia Issue 001, Issue 002, marcos, `.plan` e Project 14.
- Validações locais passam.

## Dependências

- Node.js disponível pelo ambiente do projeto.
- `pnpm` configurado no repo.
- GitHub CLI autenticado localmente para operações repo normais.
- Wrapper global `/Users/mal/.codex/bin/mbra-projects-gh` disponível para ProjectV2.
- Hook global `/Users/mal/.codex/hooks/github_projects_pat_gate.py` ativo.

## Riscos

| Risco                                          | Impacto                                     | Mitigação                                                                     |
| ---------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------- |
| `gh project` direto ser tentado                | Hook bloqueia e fluxo para                  | Usar somente wrappers ProjectV2 em docs/scripts                               |
| GitHub Actions não possuir wrapper local       | ProjectV2 não pode ser atualizado na Action | ProjectV2 fica como operação local Codex; Action valida rastreabilidade local |
| Auto-merge com conflito semântico              | Regressão no produto                        | Exigir validação verde; caso contrário registrar blocker                      |
| PR existente #2 acumular Issue 001 e Issue 002 | Escopo maior da PR                          | Atualizar corpo da PR e `.plan` explicitando ambos os escopos                 |

## Evidências esperadas

- Saída de `node scripts/codex/validate-plan-links.mjs`.
- Saída de `node scripts/codex/validate-plan-links.mjs --self-test`.
- Saída de `python3 -B /Users/mal/.codex/hooks/github_projects_pat_gate.py --self-test`.
- Prova wrapper Project 14 por `/Users/mal/.codex/bin/mbra-projects-gh project view 14 --owner Malnati --format json`.
- Prova de bloqueio de `gh project view 14 --owner Malnati` pelo hook.
- URL da GitHub Issue 002.
- Confirmação da Issue 002 no Project 14.
- PR #2 atualizado.

## Links

- Project 14: [Malnati / xadrez](https://github.com/users/Malnati/projects/14/)
- Issue GitHub: [Issue #3](https://github.com/Malnati/xadrez/issues/3).
- PR GitHub: [PR #2](https://github.com/Malnati/xadrez/pull/2).
