# General public website

The service product website for shop owners evaluating the QR ordering system.
Shop-specific pages and ordering have moved to ../owner-public-website.

## Routes

- /: service overview, benefits, setup steps, live plans, optional add-ons, and enquiries.
- /pricing: public plan catalog managed through the super admin dashboard.
- Old shop URLs: redirect-only compatibility routes to the configured owner website. No shop menu, cart, order submission, tracking actions, or private guest Wi-Fi code remains here.

## Local setup

Use Node.js 22. Run npm ci, copy .env.example to .env.local, configure the shared Supabase project and server service-role key, then run npm run dev. The default port is 3000.

Set NEXT_PUBLIC_SITE_URL to this general website's origin and NEXT_PUBLIC_OWNER_SITE_URL to the owner website's origin (locally http://localhost:3003). Keep the two origins distinct. Rebuild when changing these values. No Telegram or R2 secret is required by the general website.

Pricing uses allowlisted server-side reads of active platform plans and public platform settings. No subscription, customer, payment, or shop-private records are exposed. See [plan setup](database/SUBSCRIPTION-SETUP.md).

## Brand colours

The brand colour is **saffron orange**. Keep it as the default for the product name and brand highlights. Do not replace it with the purple/pink accent.

| Token (app/globals.css) | Dark theme | Light theme | Use |
| --- | --- | --- | --- |
| `--primary` | `#f0a742` | `#c07818` | Main brand orange |
| `--primary-light` | `#f7c06a` | `#e09030` | Gradient start, soft highlights |
| `--primary-dark` | `#c8831a` | `#9a5c0e` | Gradient end, pressed states |

- The homepage product name ("Table ordering" in the hero) uses `linear-gradient(110deg, var(--primary-light), var(--primary), var(--primary-dark))`. The rule is `.ms3-hero-product .ms-split-inner` in `app/marketing.css`.
- Primary buttons (`.ms-button-primary`, hero "Find your shop's plan", contact and plan buttons), the demo phone's "Send order" button, progress bars (scroll progress, kitchen ticket, process rail, loader) and small highlight dots all use the orange gradient `--ms-brand-gradient`. It is defined on `.marketing-site` in `app/marketing.css`. Text on orange uses `--ms-on-brand` (`#1c1203`) for contrast.
- Always use the `var(--primary…)` tokens instead of hard-coded hex values, so light and dark themes both stay on brand.
- The indigo/pink tokens (`--ms-accent`, `--ms-highlight` in `app/marketing.css`) are secondary accents for UI details only, such as card tints, outlines and focus rings. Never use them for primary actions.

## Verification

Run node --test tests/*.test.cjs, npx tsc --noEmit, and npm run build.

See [website separation and deployment](../WEBSITES-SETUP.md) for all app URLs, QR compatibility, and configuration.
