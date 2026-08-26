# Technická rozhodnutí

Stručné proč za klíčovými rozhodnutími v kódu.

## Serverless proxy místo přímého volání Raynet API

Frontend nikdy nevolá `app.raynet.cz` přímo, ale vlastní `/api/raynet/[...path]` (Vercel
function), která teprve doplní Basic auth a přepošle request dál. Frontend SPA volající cizí API
přímo z prohlížeče by API klíč vystavilo v Network tabu i v bundlu, tudíž je proxy jediný způsob, jak
appku bezpečně nasadit veřejně. Proxy zároveň přeposílá jen `GET`, protože appka je čistě
RO.

## Vrstvená architektura (presentation / domain / data / services)

I když appka řeší jen jednu entitu (klienti), kód je rozdělený tak, aby šla přidat další entita
nebo vyměnit zdroj dat bez přepisování existujícího kódu.

| Vrstva                    | Zodpovědnost                                                       |
| ------------------------- | ------------------------------------------------------------------ |
| `services/raynet`         | generický klient proxy (nezná žádnou featuru)                      |
| `features/*/data`         | mapování syrové API odpovědi na doménový model + repository        |
| `features/*/domain`       | čistý TypeScript (typy a pravidla bez závislosti na Reactu či API) |
| `features/*/presentation` | komponenty a hooky (jediná vrstva, co zná React)                   |

Pro jednu featuru je to bezpochyby overkill, ale je to
záměrná ukázka návyku pro škálovatelnost, ne přehnané inženýrství pro tenhle konkrétní rozsah.

## `/api` vs. `src/services`

Root level `/api` je vyhrazené jméno pro Vercel routing, proto frontendová API vrstva má jiné
jméno (`services/`). Jinak by kolize názvů byla matoucí už při pohledu folder system.

## `DOMPurify` na textové pole z API

Poznámka u klienta se před vykreslením přes `dangerouslySetInnerHTML` sanitizuje. I když jde
o data z vlastního účtu, může to být text zadaný kýmkoliv s přístupem do CRM. Sanitizace je
jednoduchá pojistka proti tomu, aby se z něj stal XSS vektor.

## `AbortSignal` až do `fetch`

Bez použití `signal` by appka při rychlém psaní do vyhledávání posílala requesty, které uživatel
zahodil dalším písmenem dřív, než doběhly. `AbortSignal` z TanStack Query se teď
propojuje až do `fetch()`, takže se zrušený request fyzicky zavře. Chyba `AbortError` se musí
přehodit beze změny jinak by ji TanStack Query nerozpoznalo jako
zrušení a ukázalo by uživateli falešný error stav.

## Známé mezery (vědomě otevřené)

- **Deep-linking přes URL** — výběr klienta a search query žijí jen v `useState`, ne v routeru.
  Refresh nebo sdílený odkaz teď stav neuchová.
- **Stránkování** — `ClientTablePagination` mění jen velikost stránky, ne posun na další stránku.
