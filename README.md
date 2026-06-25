# Xadrez Medieval

MVP de jogo de xadrez animado com React, Shadcn, NestJS, Postgres, salas por link, IA local e histórico PGN.

## Rodar localmente

```bash
pnpm install
pnpm --filter @xadrez/api prisma:generate
pnpm dev
```

Para persistência real, configure `DATABASE_URL` conforme `.env.example` e rode migrations com `pnpm --filter @xadrez/api prisma:migrate`.

## Scripts

- `pnpm build` — compila todos os pacotes.
- `pnpm test` — roda testes unitários.
- `pnpm typecheck` — valida tipos.
- `pnpm lint` — lint do frontend e backend.
