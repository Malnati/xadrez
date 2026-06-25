# Governança do projeto Xadrez Medieval

Este diretório é a fonte detalhada de planejamento do projeto Xadrez Medieval. O GitHub Project 14 é o quadro operacional externo para rastrear issues e PRs, mas a definição profunda de escopo, aceite e evidência vive em arquivos versionados aqui.

## Projeto externo

- ProjectV2: [Malnati / xadrez — Project 14](https://github.com/users/Malnati/projects/14/)
- Repositório: [Malnati/xadrez](https://github.com/Malnati/xadrez)
- Branch inicial desta governança: `codex/xadrez-medieval-mvp`

## Estrutura

- [`marcos/`](marcos/) — marcos e etapas do projeto.
- [`issues/`](issues/) — especificações profundas por issue.
- `docs/assets/issues/` — imagens de orientação/evidência para issues ou PRs de UI.

## Marco atual

| Marco                           | Arquivo                                                                                        | Status           | Issues                                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------ |
| Governança `.plan` + Project 14 | [`marcos/marco-01-governanca-plan-project14.md`](marcos/marco-01-governanca-plan-project14.md) | Em implementação | [`issues/issue-001-governanca-plan-project14.md`](issues/issue-001-governanca-plan-project14.md) |

## Issues planejadas

| Issue                           | Arquivo detalhado                                                                                | Marco                                                                                          | GitHub                            | Project 14                                                  | PR                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------- | ------------------------------ |
| Governança `.plan` + Project 14 | [`issues/issue-001-governanca-plan-project14.md`](issues/issue-001-governanca-plan-project14.md) | [`marcos/marco-01-governanca-plan-project14.md`](marcos/marco-01-governanca-plan-project14.md) | A preencher após criação da issue | [Project 14](https://github.com/users/Malnati/projects/14/) | A preencher após criação do PR |

## Regras operacionais para Codex

1. Antes de criar ou atualizar GitHub issues, confirmar que existe arquivo em `.plan/issues/` com objetivo, contexto, escopo, fora de escopo, marco, critérios de aceite, execução, validação, evidências e links cruzados.
2. Antes de criar PR, confirmar que o PR referencia:
   - issue GitHub;
   - arquivo `.plan/issues/...md`;
   - arquivo `.plan/marcos/...md`;
   - Project 14.
3. Antes de fechar issue ou PR, confirmar que critérios de aceite e evidências foram preenchidos no arquivo `.plan/issues/...md`.
4. Issues ou PRs de UI devem versionar screenshots em `docs/assets/issues/...` e referenciar as imagens no Markdown e no GitHub.
5. Operações de ProjectV2 devem usar `gh` local autenticado no macOS. Neste ambiente, o hook local exige o wrapper `/Users/mal/.codex/bin/mbra-projects-gh` para comandos `gh project`, pois ele injeta o PAT com escopo ProjectV2 sem imprimir segredos.
6. Se uma operação `gh project` ou equivalente for bloqueada, registrar blocker explícito e não afirmar sincronização com Project 14.
7. Usar `--admin` apenas quando o comando `gh` suportar e a operação realmente exigir privilégio administrativo.

## Checklist antes de abrir issue

- [ ] Arquivo `.plan/issues/...md` existe.
- [ ] Arquivo de marco em `.plan/marcos/...md` existe.
- [ ] Issue Markdown referencia o marco.
- [ ] Critérios de aceite estão objetivos e verificáveis.
- [ ] Evidências esperadas estão definidas.
- [ ] Se for UI/E2E, screenshot de orientação está versionado em `docs/assets/issues/...`.
- [ ] Corpo da GitHub issue contém link para o arquivo detalhado versionado.
- [ ] GitHub issue foi adicionada ao Project 14, ou blocker foi documentado.

## Checklist antes de abrir PR

- [ ] PR referencia a GitHub issue.
- [ ] PR referencia o arquivo `.plan/issues/...md`.
- [ ] PR referencia o arquivo `.plan/marcos/...md`.
- [ ] PR foi adicionado ao Project 14, ou blocker foi documentado.
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
pnpm format
```
