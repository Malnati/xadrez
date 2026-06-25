# Governança do projeto Xadrez Medieval

Este diretório é a fonte detalhada de planejamento do projeto Xadrez Medieval. O GitHub Project 14 é o quadro operacional externo para rastrear issues e PRs, mas a definição profunda de escopo, aceite e evidência vive em arquivos versionados aqui.

## Projeto externo

- ProjectV2: [Malnati / xadrez — Project 14](https://github.com/users/Malnati/projects/14/)
- Repositório: [Malnati/xadrez](https://github.com/Malnati/xadrez)
- Branch de governança ativa: `codex/i18n-multilingue`

## Estrutura

- [`marcos/`](marcos/) — marcos e etapas do projeto.
- [`issues/`](issues/) — especificações profundas por issue.
- [`../scripts/codex/`](../scripts/codex/) — automações locais do Codex para validar plano, sincronizar issues/PRs e preparar merge seguro.
- [`../.codex/project-governance.json`](../.codex/project-governance.json) — configuração repo-local de governança Codex.
- `docs/assets/issues/` — imagens de orientação/evidência para issues ou PRs de UI.

## Marcos atuais

| Marco                           | Arquivo                                                                                          | Status              | Issues                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------- | -------------------------------------------------------------------------------------------------- |
| Governança `.plan` + Project 14 | [`marcos/marco-01-governanca-plan-project14.md`](marcos/marco-01-governanca-plan-project14.md)   | Concluído via PR #2 | [`issues/issue-001-governanca-plan-project14.md`](issues/issue-001-governanca-plan-project14.md)   |
| Automação Codex de governança   | [`marcos/marco-02-automacao-codex-governanca.md`](marcos/marco-02-automacao-codex-governanca.md) | Concluído via PR #2 | [`issues/issue-002-automacao-codex-governanca.md`](issues/issue-002-automacao-codex-governanca.md) |
| i18n e E2E multilíngue          | [`marcos/marco-03-i18n-e2e-multilingue.md`](marcos/marco-03-i18n-e2e-multilingue.md)             | Em implementação    | [`issues/issue-003-i18n-e2e-multilingue.md`](issues/issue-003-i18n-e2e-multilingue.md)             |

## Issues planejadas

| Issue                           | Arquivo detalhado                                                                                  | Marco                                                                                            | GitHub                                                 | Project 14                                                  | PR                                                |
| ------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------- |
| Governança `.plan` + Project 14 | [`issues/issue-001-governanca-plan-project14.md`](issues/issue-001-governanca-plan-project14.md)   | [`marcos/marco-01-governanca-plan-project14.md`](marcos/marco-01-governanca-plan-project14.md)   | [Issue #1](https://github.com/Malnati/xadrez/issues/1) | [Project 14](https://github.com/users/Malnati/projects/14/) | [PR #2](https://github.com/Malnati/xadrez/pull/2) |
| Automação Codex de governança   | [`issues/issue-002-automacao-codex-governanca.md`](issues/issue-002-automacao-codex-governanca.md) | [`marcos/marco-02-automacao-codex-governanca.md`](marcos/marco-02-automacao-codex-governanca.md) | [Issue #3](https://github.com/Malnati/xadrez/issues/3) | [Project 14](https://github.com/users/Malnati/projects/14/) | [PR #2](https://github.com/Malnati/xadrez/pull/2) |
| i18n e E2E multilíngue          | [`issues/issue-003-i18n-e2e-multilingue.md`](issues/issue-003-i18n-e2e-multilingue.md)             | [`marcos/marco-03-i18n-e2e-multilingue.md`](marcos/marco-03-i18n-e2e-multilingue.md)             | [Issue #4](https://github.com/Malnati/xadrez/issues/4) | [Project 14](https://github.com/users/Malnati/projects/14/) | [PR #6](https://github.com/Malnati/xadrez/pull/6) |

## Rota obrigatória para GitHub ProjectV2

1. Todo comando `gh project ...` deve ser executado como:

   ```bash
   /Users/mal/.codex/bin/mbra-projects-gh project ...
   ```

2. Toda operação GraphQL/API que leia ou altere ProjectV2 deve ser executada como:

   ```bash
   /Users/mal/.codex/bin/mbra-projects-github-env -- gh api graphql ...
   ```

3. Não usar para ProjectV2:
   - `gh project` direto;
   - `gh api graphql` direto quando o alvo for ProjectV2;
   - `mbra-gh`;
   - `MBRA_FULL`;
   - `gh` admin/keyring sanitizado;
   - `--admin`.
4. Se o wrapper ProjectV2 falhar por escopo, permissão, campo ou status indisponível, registrar blocker explícito e não tentar fallback por rota bloqueada.
5. O PAT de ProjectV2 é carregado pelo wrapper a partir de `/Users/mal/GitHub/mbra/.env` e nunca deve ser impresso, copiado, commitado ou exposto.

## Regras operacionais para Codex

1. Antes de criar ou atualizar GitHub issues, confirmar que existe arquivo em `.plan/issues/` com objetivo, contexto, escopo, fora de escopo, marco, critérios de aceite, execução, validação, evidências e links cruzados.
2. Antes de criar PR, confirmar que o PR referencia:
   - issue GitHub;
   - arquivo `.plan/issues/...md`;
   - arquivo `.plan/marcos/...md`;
   - Project 14.
3. Antes de fechar issue ou PR, confirmar que critérios de aceite e evidências foram preenchidos no arquivo `.plan/issues/...md`.
4. Issues ou PRs de UI devem versionar screenshots em `docs/assets/issues/...` e referenciar as imagens no Markdown e no GitHub.
5. Operações de ProjectV2 devem usar exclusivamente os wrappers globais descritos acima.
6. Se uma operação ProjectV2 for bloqueada, registrar blocker explícito e não afirmar sincronização com Project 14.
7. `--admin` só pode ser usado em operações GitHub não-ProjectV2 quando a operação realmente exigir privilégio administrativo e o comando suportar a opção.

## Checklist antes de abrir issue

- [ ] Arquivo `.plan/issues/...md` existe.
- [ ] Arquivo de marco em `.plan/marcos/...md` existe.
- [ ] Issue Markdown referencia o marco.
- [ ] Critérios de aceite estão objetivos e verificáveis.
- [ ] Evidências esperadas estão definidas.
- [ ] Se for UI/E2E, screenshot de orientação está versionado em `docs/assets/issues/...`.
- [ ] Corpo da GitHub issue contém link para o arquivo detalhado versionado.
- [ ] GitHub issue foi adicionada ao Project 14 por `/Users/mal/.codex/bin/mbra-projects-gh`, ou blocker foi documentado.

## Checklist antes de abrir PR

- [ ] PR referencia a GitHub issue.
- [ ] PR referencia o arquivo `.plan/issues/...md`.
- [ ] PR referencia o arquivo `.plan/marcos/...md`.
- [ ] PR foi adicionada ao Project 14 por `/Users/mal/.codex/bin/mbra-projects-gh`, ou blocker foi documentado.
- [ ] Validações relevantes foram executadas.
- [ ] Se for UI/E2E, screenshot de evidência está versionado em `docs/assets/issues/...`.

## Validação padrão

Para mudanças de código, usar os scripts do projeto conforme escopo:

```bash
pnpm build
pnpm test
pnpm typecheck
pnpm lint
pnpm test:e2e
```

Para mudanças apenas documentais em `.plan`, usar no mínimo:

```bash
git diff --check
pnpm exec prettier --check .plan/README.md .plan/issues/*.md .plan/marcos/*.md
```

Para mudanças de governança Codex, usar:

```bash
node scripts/codex/validate-plan-links.mjs
node scripts/codex/validate-plan-links.mjs --self-test
python3 -B /Users/mal/.codex/hooks/github_projects_pat_gate.py --self-test
/Users/mal/.codex/bin/mbra-projects-gh project view 14 --owner Malnati --format json
```

## Evidência global ProjectV2

- `python3 -B /Users/mal/.codex/hooks/github_projects_pat_gate.py --self-test` passou com 8 testes.
- `/Users/mal/.codex/bin/mbra-projects-gh project view 14 --owner Malnati --format json` acessou Project 14 `xadrez`.
- Simulação de `gh project view 14 --owner Malnati` foi bloqueada pelo hook global com orientação para usar os wrappers ProjectV2.
