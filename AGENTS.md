# Xadrez Medieval — regras repo-locais para Codex

## Fonte de verdade de planejamento

1. Todo trabalho de Codex deve ter um arquivo detalhado em `.plan/issues/` antes de criar ou atualizar uma GitHub issue.
2. Todo arquivo `.plan/issues/` deve apontar para um marco em `.plan/marcos/`.
3. `.plan/README.md` deve refletir issues, marcos, PRs, status e links reais.
4. GitHub issues e PRs são rastreio operacional; `.plan` é a especificação profunda versionada.

## GitHub issues, Project 14 e PRs

1. Toda GitHub issue deve linkar o arquivo `.plan/issues/...md` correspondente.
2. Toda PR deve linkar:
   - GitHub issue;
   - arquivo `.plan/issues/...md`;
   - arquivo `.plan/marcos/...md`;
   - Project 14.
3. PRs devem usar Conventional Commits no título quando aplicável.
4. PRs devem usar `Closes #N` quando a PR resolve a issue; usar `Refs #N` quando apenas prepara parte do escopo.
5. Antes de fechar issue/PR, atualizar o arquivo `.plan/issues/...md` com evidência e status final.

## Rota obrigatória ProjectV2

1. ProjectV2 do projeto é [Malnati / xadrez — Project 14](https://github.com/users/Malnati/projects/14/).
2. Para `gh project ...`, usar sempre:

   ```bash
   /Users/mal/.codex/bin/mbra-projects-gh project ...
   ```

3. Para GraphQL/API ProjectV2, usar sempre:

   ```bash
   /Users/mal/.codex/bin/mbra-projects-github-env -- gh api graphql ...
   ```

4. Nunca usar para ProjectV2:
   - `gh project` direto;
   - `gh api graphql` direto quando a operação tocar ProjectV2;
   - admin/keyring `gh`;
   - `--admin`;
   - tokens impressos ou copiados no terminal.
5. Se o wrapper falhar, registrar blocker explícito em `.plan` e no GitHub; não tentar fallback por rota bloqueada.

## Automação Codex

1. Use `node scripts/codex/validate-plan-links.mjs` antes de criar ou atualizar PR.
2. Use `node scripts/codex/github-sync-issue.mjs --dry-run <arquivo>` antes da sincronização real.
3. Use `node scripts/codex/github-open-pr.mjs --dry-run --issue <numero>` antes de abrir/atualizar PR.
4. Use `node scripts/codex/auto-merge-pr.mjs --dry-run --pr <numero>` antes de qualquer tentativa de merge.
5. Auto-merge só é permitido com validações verdes e sem conflito semântico.
6. Conflito resolvido automaticamente deve ser revalidado antes de push/merge.

## Validação padrão

Para mudanças de governança:

```bash
git diff --check
node scripts/codex/validate-plan-links.mjs
node scripts/codex/validate-plan-links.mjs --self-test
python3 -B /Users/mal/.codex/hooks/github_projects_pat_gate.py --self-test
```

Para mudanças de código/produto:

```bash
pnpm test
pnpm typecheck
pnpm build
```

Adicionar `pnpm test:e2e` quando UI, fluxo Playwright ou evidência visual forem alterados.
