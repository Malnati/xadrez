# Marco 03 — i18n e E2E multilíngue

## Objetivo

Entregar a experiência inicial multilíngue do Xadrez Medieval, com escolha obrigatória de idioma, persistência local, troca sem reiniciar a partida e cobertura E2E para convidado jogando contra o computador nos idiomas `pt-BR`, `en-US` e `es-419`.

## Contexto

O PR #2 consolidou o MVP jogável, o E2E inicial de convidado contra computador sem autenticação e a automação Codex de governança. A próxima etapa planejada é tornar a interface pronta para três públicos, mantendo a regra de não expor detalhes técnicos na UI final e preservando o fluxo sem login: escolher idioma, iniciar jogo contra computador, escolher cor, jogar `e2 -> e4`, aguardar a resposta do computador e manter o histórico visível.

## Escopo

- Criar infraestrutura de idioma no frontend para `pt-BR`, `en-US` e `es-419`.
- Exigir escolha inicial de idioma antes do tabuleiro e dos painéis do jogo.
- Persistir idioma escolhido em `localStorage` e aplicar `html[lang]`.
- Adicionar seletor de idioma no cabeçalho sem reiniciar partida, histórico, relógio ou posição atual.
- Traduzir textos visíveis e labels acessíveis do fluxo principal.
- Atualizar testes unitários para estrutura dos dicionários, fallback e render mínimo.
- Expandir Playwright para cobrir início de partida em português, inglês e espanhol latino-americano.
- Validar ausência de vazamento de português em telas EN/ES para os textos controlados pelo app.
- Corrigir qualquer regressão encontrada em testes, typecheck, build, lint, format ou E2E.

## Fora de escopo

- Implementar autenticação real, OAuth ou persistência remota do usuário.
- Alterar regras de xadrez, motor do computador, backend, banco ou APIs.
- Adicionar novos idiomas além de `pt-BR`, `en-US` e `es-419`.
- Localizar nomes próprios do produto, como `Xadrez Medieval`, quando usados como marca.
- Persistir partidas no servidor ou exigir serviço remoto para o fluxo convidado.
- Expor nomes de bibliotecas, provedores, runtimes, banco, engine ou ferramentas na UI final.

## Issues vinculadas

| Issue                  | Arquivo detalhado                                                                            | GitHub                                                 | Project 14                                                  | PR                                                |
| ---------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------- |
| i18n e E2E multilíngue | [`../issues/issue-003-i18n-e2e-multilingue.md`](../issues/issue-003-i18n-e2e-multilingue.md) | [Issue #4](https://github.com/Malnati/xadrez/issues/4) | [Project 14](https://github.com/users/Malnati/projects/14/) | [PR #6](https://github.com/Malnati/xadrez/pull/6) |

## Ordem de execução

1. Atualizar `.plan/README.md` com Marco 03 e Issue 003.
2. Criar Issue 003 detalhada e sincronizar com GitHub Issue + Project 14 pelo wrapper obrigatório.
3. Revisar automações Codex existentes e corrigir bloqueadores que impeçam PR/Project 14 seguro.
4. Implementar módulos de idioma e dicionários tipados no frontend.
5. Adicionar gate inicial de idioma e seletor persistente no cabeçalho.
6. Traduzir App, painéis, tabuleiro, histórico, relógio, modos e labels acessíveis.
7. Atualizar testes unitários e criar testes de i18n.
8. Expandir E2E para os três idiomas e persistência/troca sem reset.
9. Rodar validação completa local.
10. Criar PR vinculada à Issue 003 e ao Marco 03, adicionar PR ao Project 14 e aguardar checks.
11. Mesclar automaticamente somente se validações locais e checks remotos estiverem verdes.

## Critérios de conclusão

- Primeira visita sem idioma salvo mostra seleção de idioma antes do jogo.
- Escolher `pt-BR`, `en-US` ou `es-419` libera a tela principal no idioma escolhido.
- Idioma fica salvo localmente e sobrevive a reload.
- `document.documentElement.lang` acompanha o idioma ativo.
- Seletor no cabeçalho troca idioma sem limpar histórico, posição, lance `e4` ou partida em andamento.
- Fluxo convidado contra computador passa nos três idiomas sem login.
- Textos visíveis principais e labels acessíveis não ficam presos em português fora de `pt-BR`, salvo nome próprio do produto.
- E2E confirma que `Entrar` continua visível, mas não é clicado nem necessário.
- Nenhuma chamada obrigatória ao backend é adicionada ao fluxo convidado.
- `.plan`, GitHub issue, Project 14 e PR ficam sincronizados.
- Validações exigidas passam antes de merge.

## Dependências

- Branch base `main` contendo o merge do PR #2.
- `pnpm` e dependências já instaladas no monorepo.
- Playwright Chromium disponível localmente.
- Wrapper ProjectV2 `/Users/mal/.codex/bin/mbra-projects-gh` disponível.
- GitHub CLI autenticado para operações normais de issue/PR, sem uso de ProjectV2 direto.

## Riscos

| Risco                                      | Impacto                                    | Mitigação                                                             |
| ------------------------------------------ | ------------------------------------------ | --------------------------------------------------------------------- |
| Estado de idioma resetar partida           | Perda de fluxo E2E e frustração do usuário | Manter idioma como contexto independente do estado de jogo            |
| Textos hardcoded em componentes existentes | Vazamento de idioma errado                 | Centralizar dicionário e cobrir componentes com testes                |
| E2E ficar instável aguardando computador   | Falso negativo em CI/local                 | Reaproveitar fallback atual e aguardar contagem de lances com timeout |
| Automação PR ter bug                       | PR não sincroniza com Project 14           | Corrigir scripts repo-locais e validar `--dry-run` antes do uso real  |
| ProjectV2 bloquear item                    | Rastreio operacional incompleto            | Registrar blocker explícito; não tentar rota proibida                 |

## Evidências esperadas

- `.plan/issues/issue-003-i18n-e2e-multilingue.md` com links reais.
- GitHub Issue 003 adicionada ao Project 14 via wrapper.
- PR de i18n adicionada ao Project 14 via wrapper.
- Saída de `node scripts/codex/validate-plan-links.mjs`.
- Saída de `node scripts/codex/validate-plan-links.mjs --self-test`.
- Saída de `pnpm format`, `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build` e `pnpm test:e2e`.
- Evidência do E2E cobrindo `pt-BR`, `en-US`, `es-419`, persistência e troca sem reset.
- Screenshot/artefato visual somente se necessário para PR de UI, sem salvar screenshot de sucesso dentro do repo.

## Links

- Project 14: [Malnati / xadrez](https://github.com/users/Malnati/projects/14/)
- Issue GitHub: [Issue #4](https://github.com/Malnati/xadrez/issues/4).
- PR GitHub: [PR #6](https://github.com/Malnati/xadrez/pull/6).

## Evidência de execução

- Issue #4 criada e adicionada ao Project 14 via wrapper ProjectV2 em 2026-06-25.
- Evidência visual do fluxo renderizado: [`../../docs/assets/issues/004/i18n-multilingue-evidence.png`](../../docs/assets/issues/004/i18n-multilingue-evidence.png).
- Validação local completa passou em 2026-06-25: `git diff --check`, validações Codex, dry-runs, `pnpm format`, `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm build` e `pnpm test:e2e`.
