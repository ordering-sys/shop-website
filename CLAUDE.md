@AGENTS.md

# Claude guide: general public website

Marketing and pricing site for shop owners evaluating the QR ordering product.
Next.js 16 (App Router) · React 19 · Tailwind v4 + daisyUI 5 · Supabase · Node 22 · port 3000.

> Path note: the owner/shop app lives in `../owner-website` (local origin `http://localhost:3003`).
> Older docs that say `../owner-public-website` mean the same app.

## Scope: what belongs here

| Belongs here | Does NOT belong here (lives in `../owner-website`) |
| --- | --- |
| Service overview, benefits, setup steps | Shop menus, carts, order submission |
| Public plan catalog (`/pricing`) | QR/GPS table validation, order tracking |
| Optional add-ons, enquiries | Shop profiles, guest Wi-Fi codes, seasonal templates |
| Redirect-only legacy shop URLs | Telegram alerts, R2 uploads |

If a request needs shop-specific data or actions, implement it in the owner website instead and say so.

## Map

- `app/(site)/page.tsx`: homepage. `app/(site)/pricing/page.tsx`: plans.
- `app/(site)/[...shopPath]/page.tsx`: legacy shop URLs, redirect-only, logic in `lib/public-routes.ts`.
- `app/(site)/order/order-content.tsx`: legacy compatibility only; do not grow it into an ordering UI.
- `components/marketing/*`: page sections and motion (`MarketingMotion`, `SplitText`, `PageReady`).
- `components/ui/*`: shared primitives (`LanguageDropdown`, `card`).
- `lib/i18n.ts`: every user-facing string as `{ en, km }`.
- `lib/theme-context.tsx`: client theme + language context.
- `lib/public-pricing.ts`, `lib/supabase/admin.ts`: `server-only` data access.
- `lib/server-secret.ts`: reads `NAME` or a mounted `NAME_FILE`.
- Styles: `app/globals.css` (tokens), `app/marketing.css` (`.marketing-site`, `--ms-*`).

## Security rules (non-negotiable)

- **Redirects:** only to `NEXT_PUBLIC_OWNER_SITE_URL`, via `ownerPageHref`. Never take a destination from query params. Forward only `table` and `token`. Reject non-http(s), credentials in the URL, and an owner origin equal to this site's origin.
- **Service-role key:** use only in files that `import 'server-only'`. Never import `lib/supabase/admin.ts` or `lib/public-pricing.ts` from a `'use client'` file, and never prefix a secret with `NEXT_PUBLIC_`.
- **Pricing reads:** select explicit allowlisted columns of active platform plans and public settings. Never `select('*')`. Never expose subscriptions, payments, customers, or shop-private records.
- This app needs no Telegram or R2 secrets; do not add them.

## UI conventions

- **Bilingual:** add each new string to `lib/i18n.ts` with both `en` and `km`. No hard-coded copy in components. Check that Khmer (longer, taller glyphs) wraps cleanly.
- **Themes:** test light and dark. Use `var(--primary…)` and `--ms-*` tokens, not hex values.
- **Brand:** saffron orange (`--primary`, `--ms-brand-gradient`, text on orange uses `--ms-on-brand`). Indigo/pink (`--ms-accent`, `--ms-highlight`) is for secondary details only, never primary actions. Full table in `README.md`.
- **Layout:** mobile first (check 360px, 768px, 1280px), touch targets ≥ 44px, visible focus rings.
- **Motion** (animejs, lenis): respect `prefers-reduced-motion`. Animate `transform`/`opacity` only, with no layout shift.
- **Components:** use Server Components by default. Add `'use client'` only for interactivity, and keep that boundary as low in the tree as possible.

## Commands

```bash
npm run dev                  # http://localhost:3000
node --test tests/*.test.cjs # route + pricing tests
npx tsc --noEmit
npm run lint
npm run build
```

Env: copy `.env.example` to `.env.local`. Required: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_OWNER_SITE_URL` (a different origin), `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (or `_FILE`). Rebuild after changing any `NEXT_PUBLIC_*` value. Never read or print `.env.local` contents.

## Definition of done

1. Tests, `tsc`, lint, and build all pass. Report real output, including failures.
2. Changes to redirects or pricing come with a test in `tests/`.
3. New UI works in en/km × light/dark × mobile/desktop.
4. No new `server-only` import reaches client code, and no new secret env var appears.
5. Keep `README.md` and `../WEBSITES-SETUP.md` in sync if routes, env vars, or ports change.
