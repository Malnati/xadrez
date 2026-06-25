# Marco 01 — Governança `.plan` + GitHub Project 14

## Objetivo

Estabelecer governança versionada para o projeto Xadrez Medieval, mantendo decisões profundas em `.plan/` e rastreio operacional no GitHub Project 14.

## Contexto

O projeto precisa de uma fonte de verdade local para marcos e issues, com vínculos explícitos para GitHub issues, PRs e ProjectV2. A gestão não deve depender apenas de textos soltos em issues, porque Codex e humanos precisam de especificações profundas, auditáveis e versionadas no repositório.

## Escopo

- Criar estrutura `.plan/marcos/` e `.plan/issues/`.
- Criar índice `.plan/README.md` com regras de governança.
- Criar marco detalhado inicial.
- Criar issue detalhada inicial.
- Criar GitHub issue apontando para o arquivo detalhado.
- Adicionar a GitHub issue ao Project 14.
- Criar PR apontando para a issue, o marco e o arquivo detalhado.
- Adicionar o PR ao Project 14.

## Fora de escopo

- Alterar regras de negócio do jogo.
- Alterar backend, frontend, banco, IA local ou testes E2E do produto.
- Criar screenshots de UI, porque esta mudança é documental e não altera telas.
- Criar marcos funcionais de gameplay além da governança inicial.

## Issues vinculadas

| Issue                           | Arquivo detalhado                                                                                      | GitHub                                                 | Project 14                                                  | PR                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------- |
| Governança `.plan` + Project 14 | [`../issues/issue-001-governanca-plan-project14.md`](../issues/issue-001-governanca-plan-project14.md) | [Issue #1](https://github.com/Malnati/xadrez/issues/1) | [Project 14](https://github.com/users/Malnati/projects/14/) | [PR #2](https://github.com/Malnati/xadrez/pull/2) |

## Ordem de execução

1. Criar estrutura `.plan/`.
2. Criar o índice de governança.
3. Criar este marco.
4. Criar issue detalhada correspondente.
5. Validar Markdown e ausência de links quebrados óbvios.
6. Commitar e publicar branch.
7. Criar GitHub issue com link para `.plan/issues/issue-001-governanca-plan-project14.md`.
8. Adicionar issue ao Project 14.
9. Criar PR com links para issue, marco e arquivo detalhado.
10. Adicionar PR ao Project 14.
11. Atualizar arquivos `.plan` com links reais de issue e PR quando disponíveis.

## Critérios de conclusão

- `.plan/README.md` existe e descreve regras operacionais.
- `.plan/marcos/marco-01-governanca-plan-project14.md` existe com escopo, ordem, aceite, riscos e evidências.
- `.plan/issues/issue-001-governanca-plan-project14.md` existe com especificação profunda.
- GitHub issue existe e referencia o arquivo detalhado.
- GitHub issue está no Project 14, salvo blocker técnico documentado.
- PR existe e referencia issue, marco, arquivo detalhado e Project 14.
- PR está no Project 14, salvo blocker técnico documentado.
- Validação documental passa com `git diff --check` e `pnpm format`.

## Dependências

- GitHub CLI autenticado localmente no macOS.
- Acesso ao repositório `Malnati/xadrez`.
- Acesso ProjectV2 ao Project 14.
- Hook local de segurança permitindo operações ProjectV2 apenas pelo wrapper aprovado.

## Riscos

| Risco                                           | Impacto                                              | Mitigação                                                    |
| ----------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| `gh project` direto bloqueado por hook local    | Project 14 não sincroniza se comando bruto for usado | Usar `/Users/mal/.codex/bin/mbra-projects-gh` para ProjectV2 |
| Issue/PR sem link para `.plan`                  | GitHub vira fonte incompleta                         | Validar corpo antes de criar ou editar issue/PR              |
| Markdown fica desatualizado após criar issue/PR | Rastreabilidade parcial                              | Atualizar `.plan` com links reais após criação               |
| UI issue futura sem screenshot                  | Evidência visual insuficiente                        | Exigir `docs/assets/issues/...` para UI/E2E                  |

## Evidências esperadas

- Diff versionado contendo `.plan/README.md`, este marco e a issue detalhada.
- Saída de `git diff --check` sem erros.
- Saída de `pnpm format` sem erros.
- URL da GitHub issue.
- Confirmação de item da issue no Project 14.
- URL do PR.
- Confirmação de item do PR no Project 14.

## Links

- Project 14: [Malnati / xadrez](https://github.com/users/Malnati/projects/14/)
- Issue GitHub: [Issue #1](https://github.com/Malnati/xadrez/issues/1).
- PR GitHub: [PR #2](https://github.com/Malnati/xadrez/pull/2).
