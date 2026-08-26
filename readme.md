# Raynet — Master-Detail klientů

![CI](https://github.com/TheMikerik/raynet-demo/actions/workflows/ci.yml/badge.svg)

Master-detail zobrazení klientů z reálného Raynet CRM účtu (REST API) s fulltext vyhledáváním
napříč více poli. React + TypeScript, vzhled inspirovaný Raynet CRM.
Vytvořeno jako zadání výběrového řízení na pozici FE developer v Raynetu.

Zdůvodnění jednotlivých technických rozhodnutí (proč proxy, proč zrovna tahle vrstva, ...) viz [docs/decisions.md](docs/decisions.md).

## Lokální spuštění

```bash
cp .env.example .env.local   # doplnit RAYNET_API_USER, RAYNET_API_KEY, RAYNET_INSTANCE_NAME
                              # (Raynet → Nastavení → Pro vývojáře → API klíče)
npm install
npx vercel dev                # frontend + proxy na jedné doméně, http://localhost:3000
```

## Skripty

| Příkaz           | Co dělá                                                         |
| ---------------- | --------------------------------------------------------------- |
| `npm run dev`    | dev server bez proxy (jen frontend, `http://localhost:5173`)    |
| `npx vercel dev` | frontend + `/api` proxy dohromady — takhle appka reálně funguje |
| `npm run test`   | Vitest + React Testing Library                                  |
| `npm run build`  | produkční build do `dist/`                                      |

## Tech stack

Vite + React 19 + TypeScript (`strict`) · TanStack Query · TanStack Table · CSS Modules ·
Vitest + Testing Library · ESLint + Prettier + Husky.

## Co appka vědomě neumí

- Deep-linking přes URL (`/clients/:id`, `?q=`). Aplikace funguje jen jako stav v komponentě, ne přes
  routing.
- Skutečné stránkování (posun na další stránku), ne jen volba velikosti stránky.
