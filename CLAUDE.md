# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start:dev          # dev server, watch mode
npm run build               # nest build
npm run lint                 # oxlint src/ test/

npm run test                 # unit tests (vitest run, matches **/*.spec.ts)
npm run test:watch           # unit tests, watch mode
npm run test:e2e             # e2e tests (vitest run --config ./vitest.config.e2e.ts, matches **/*.e2e-spec.ts)
npx vitest run path/to/file.spec.ts        # single unit test file
npx vitest run -t "test name"              # single test by name

npx prisma generate          # regenerate Prisma Client after schema.prisma changes
npx prisma migrate dev --name <name>   # apply schema changes to the DB, create migration
```

Runtime is `node --experimental-strip-types` via `@nestjs/cli` (`"type": "module"`, all relative imports use explicit `.js` extensions even though source is `.ts` — this is required, not a typo).

## Architecture

This is a NestJS + Prisma tutorial project (following a YouTube course) backed by a Neon Postgres database. The Prisma CLI installed is pinned to **6.19.3** — do not let `npm install prisma@latest` upgrade it, the `latest` npm dist-tag currently points at an unrelated 8.0.0-rc "Prisma Next" prerelease with a completely different CLI/config surface (`prisma orm init`, `contract.prisma`, etc.) that is incompatible with this codebase's classic `prisma/schema.prisma` + `prisma migrate dev` workflow.

### Two parallel, unrelated "users" implementations

The codebase currently has two separate modules that both model a "user" but do not share code — this is intentional tutorial progression, not duplication to clean up:

- **`src/users/`** — the original in-memory version. `UsersService` holds a hardcoded array and does CRUD on it directly. Uses its own DTOs (`src/users/dto/`) and the hand-written `User` type in `src/types/usersTypes.ts` (role: `'admin' | 'user'`, lowercase).
- **`src/userapp/`** — the real, database-backed version added later. `UserappService` calls `DatabaseService` (the injected Prisma client) and uses Prisma's generated types directly (`Prisma.UserCreateInput`, `Prisma.UserUpdateInput`, `Role` from `@prisma/client`, uppercase `ADMIN`/`USER`) instead of hand-written DTOs.

When adding a feature, check which of the two the task actually belongs to before touching files — they are not layered on top of each other.

### Database access

- `src/database/database.service.ts` (`DatabaseService`) extends Prisma's `PrismaClient` and is the sole way the app talks to Postgres. It uses the driver-adapter pattern: a `pg.Pool` wrapped in `PrismaPg` (`@prisma/adapter-pg`), passed to `super({ adapter })`. `@prisma/adapter-pg` must stay version-matched to `prisma`/`@prisma/client` (currently 6.19.3) — a version mismatch produces a cryptic "`@prisma/client` did not initialize yet" error at boot with no other indication.
- `DatabaseService` is provided by `DatabaseModule` and exported for other modules (e.g. `UserappModule`) to import.
- `prisma/schema.prisma`'s `datasource db` block must keep `url = env("DATABASE_URL")` — it has been repeatedly and accidentally stripped during editing, which breaks `prisma generate`/`migrate` with a `P1012` validation error.
- DB connection info lives in `.env` (`DATABASE_URL`, pooled Neon connection) and `.neon` (linked Neon org/project/branch, used by the Neon CLI/MCP — project `tuto-nest` / `round-hall-28663241`).

### Auth guard

`src/common/guards/auth.guard.ts` (`AuthGuard`) does a simple Bearer-token comparison against `process.env.AUTH_TOKEN`. It is applied per-route via `@UseGuards(AuthGuard)` (see `UsersController.findAll`), not globally — the global registration in `main.ts` is commented out.
