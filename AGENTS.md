# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds the Next.js app router (`page.tsx`, `layout.tsx`), server actions in `actions.ts`, and global styles in `globals.css`.
- `components/` contains React/Three.js UI pieces (e.g., `GalaxyScene`, `StarNode`, `CameraController`); keep client/server boundaries explicit with `'use client'` where needed.
- `store/useGalaxyStore.ts` centralizes Zustand state and calls server actions for star creation/search.
- Data layer: `lib/prisma.ts` wires Prisma to the SQLite file `prisma/dev.db`; schema lives in `prisma/schema.prisma`.
- `generated/client/` is the Prisma client output; regenerate it after schema edits.
- `public/` houses static assets; root config files (`next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`) define build and lint behavior. A dedicated tests folder is not present yet—co-locate new tests near code.

## Build, Test, and Development Commands
- `npm run dev` — start the dev server at http://localhost:3000.
- `npm run lint` — run ESLint/Next rules; use this as a pre-commit gate.
- `npm run build` — production build; fails on type or lint errors.
- `npm run start` — serve the built app locally.
- `npx prisma generate` — regenerate the Prisma client after any change to `prisma/schema.prisma`; commit the updated `generated/` output (and `prisma/dev.db` if seed data changes).
- Optional: `npx prisma studio` — inspect or tweak the SQLite data.

## Coding Style & Naming Conventions
- TypeScript-first; prefer explicit types for server actions and Zustand state.
- Components are PascalCase function components; hooks/selectors use camelCase. Keep imports ordered: external, alias `@/...`, then relative.
- Current files use 4-space indentation; stay consistent. Favor async/await and minimal logging with context; never expose secrets in client components.

## Testing Guidelines
- No automated suite yet. Add tests alongside new code (`__tests__` next to files or `tests/` at root).
- UI: React Testing Library + Jest; State/logic: unit-test server actions and cosine-similarity helper; Data: seed small fixtures for SQLite when relevant.
- Always run `npm run lint`; include screenshots or manual verification notes for UI changes.

## Commit & Pull Request Guidelines
- Existing history uses short descriptive messages (e.g., “added prisma / sqlite db for start persistence and search”). Keep messages under ~72 chars, imperative or concise descriptive.
- Include related artifacts: schema changes plus regenerated client, updated `dev.db` if the data matters.
- PRs should summarize intent, list test/lint results, and attach before/after visuals for UI work. Link issues or tasks when available.

## Security & Configuration Tips
- Create `.env.local` with your Google Generative AI key (e.g., `GOOGLE_API_KEY=...`) before running server actions; never commit it.
- SQLite lives at `prisma/dev.db`; avoid committing sensitive data and refresh the file if sharing externally.
- Strip API keys from logs and client-visible strings.
