# Raynet — Master-Detail klientů

Master-detail zobrazení klientů z Raynet CRM (REST API) s fulltext vyhledáváním napříč více poli.
React + TypeScript, vzhled inspirovaný Raynet CRM. Vytvořeno jako zadání výběrového řízení na
pozici FE developer.

## Architektura a bezpečnost

Frontend nikdy nevolá Raynet API přímo a nikdy neuvidí `RAYNET_API_KEY`. Místo toho volá vlastní
serverless proxy:

```
Browser → /api/raynet/company?fulltext=... → (Vercel function, drží API klíč) → Raynet API
```

## Lokální spuštění

1. `cp .env.example .env.local` a doplnit vlastní hodnoty (Raynet → Nastavení → Pro vývojáře →
   API klíče):
   - `RAYNET_API_USER` — přihlašovací e-mail
   - `RAYNET_API_KEY` — API klíč
   - `RAYNET_INSTANCE_NAME` — název Raynet instance
2. `npm install`
3. `npx vercel dev` — spustí proxy lokálně na `/api/raynet/...`