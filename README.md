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

## Verification

Run node --test tests/*.test.cjs, npx tsc --noEmit, and npm run build.

See [website separation and deployment](../WEBSITES-SETUP.md) for all app URLs, QR compatibility, and configuration.
