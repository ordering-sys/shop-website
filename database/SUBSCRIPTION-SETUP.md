# System builds, add-on services, and public pricing

This release uses the existing `platform_plans`, `platform_settings`, and
`platform_subscriptions` tables and the existing super-admin `platform_write`
workflow. Apply `admin-dashboard/database/PLAN-PRICING-SETUP.sql` in the Supabase
SQL editor before using the new offer fields. It adds `price`, `billing_interval`,
and `offering_type`, and a server-only save RPC that uses the existing atomic
plan write and audit workflow. No anonymous read policy is required.
If the platform dashboard reports missing database setup, complete the existing
platform database provisioning before using this feature.

## Configure the two apps

1. Point the admin dashboard and public website at the **same Supabase project**
   using `NEXT_PUBLIC_SUPABASE_URL` and the corresponding server-only
   `SUPABASE_SERVICE_ROLE_KEY` (or the supported mounted secret file).
   Keep the service key out of browser environment variables.
2. Set `NEXT_PUBLIC_SITE_URL` in the admin app to the general public website's origin,
   for example `http://localhost:3000` for local development. The Plans screen
   uses this to link to the public `/pricing` page.
3. Apply the pricing migration, then deploy both applications. Existing records
   retain their original monthly prices and become monthly system plans. Until
   migration, the public app can still display the legacy monthly catalog, while
   the admin form shows a migration notice instead of saving incomplete offers.

## Set up plans in the dashboard

Sign in as `super_admin`:

1. Open `/platform/settings`. Enter your platform name and the support email
   address you want published. This address receives subscription enquiries.
   Set **Client onboarding** to `open` when ready to receive enquiries.
   `paused` keeps pricing visible but hides the per-plan subscription buttons.
   Missing/invalid support email or unavailable settings also disables those buttons.
2. Open `/platform/plans`. Choose the offer type, payment frequency, price per
   payment in USD, system staff/table allowances, and one included feature per line.
   For the whole system build, select `system` and `one_time`. Describe the agreed
   scope: website, admin dashboard, QR ordering, kitchen display, deployment, etc.
   For maintenance or support, create a separate offer with type `addon`. Choose
   `one_time`, `monthly`, or `yearly`, enter the service price, and describe the
   included tasks or support coverage. Staff/table allowances are hidden for add-ons.
   Only describe
   features you can deliver with the current system. Plan names and features
   display exactly as entered, so bilingual text can be entered in these fields.
3. Save drafts as `archived`. Set a plan to `active` to publish it. Existing active
   plans are also published when this feature is deployed. Archiving hides a plan
   from pricing but does not cancel existing subscriptions.
4. Open the **View public plans** link. Check prices, allowances, features, and the
   selected plan in the email draft. Reload after changes: the website fetches
   current data for every pricing page request, with no shared cache required.

There are no seeded prices or automatically published sample plans.

## Record the sale and activate a shop manually

1. The visitor selects **Discuss this system** or **Ask about this service** on
   `/pricing`. Their email app opens a draft containing the offer name, plan
   reference, price, payment frequency, and offer type,
   and fields for the shop and contact details. They must send the email themselves.
2. Agree payment arrangements and confirm the current price with the shop.
3. Register or locate the restaurant under `/platform/clients` and create its
   client admin as needed. Restaurant workspace preparation remains a separate step.
4. Invoice a one-time build and optional services through your existing manual
   invoicing process. Confirm scope, delivery dates, payment milestones, and any
   agreed support separately. These offers are catalog entries, not an automated
   project invoicing or maintenance-contract ledger. A one-time build does not
   automatically promise lifetime hosting, maintenance, or support.
5. The existing `/platform/subscriptions` form is for recurring **system** plans:
   choose `trial` or `active`, set the billing period end, and record a reference.
   One-time builds and add-ons are excluded from this form so they cannot be
   misrepresented as expiring system subscriptions. Record their invoices separately.
6. Update recurring system status and period end manually for renewals, overdue
   payments, or cancellation. Create a new offer to change the payment frequency
   or type of a plan that already has subscription records.

This feature does not charge payments, create a subscription from a public click,
automatically expire access, enforce limits, or activate a restaurant workspace.
Default trial days in settings are not automatically applied by the manual form.
The legacy `monthly_price` column is maintained as a monthly equivalent for
recurring system plans (annual price divided by 12). One-time builds and add-ons
have a zero monthly system value, preventing them from inflating that dashboard
metric. Changing a recurring system price changes the estimated monthly value;
subscription records do not preserve a contracted price snapshot.

## Data exposure and verification

The pricing query runs only on the server. It selects active plan IDs, names,
prices, payment frequencies, offer types, staff/table limits, and features.
From platform settings it selects
only the name, support email, and onboarding state. It never reads client accounts,
subscription records, payment references, or restaurant private settings.
Keep the existing platform RLS restrictions; do not grant browser access to these tables.

The general service homepage `/` includes benefits and the live pricing catalog.
Service navigation and the footer link to `/pricing`. Shop UI and server actions
live separately in `owner-public-website`; configure `NEXT_PUBLIC_OWNER_SITE_URL`
in the admin dashboard for table QR generation. The general website retains only
compatibility redirects for old shop URLs. See `../../WEBSITES-SETUP.md` for all URLs.
The pricing page supports the site's English/Khmer switch, light/dark themes, empty
plans, missing contact setup, paused onboarding, and database failure states.

From `public-website`, run:

```sh
node --test tests/public-pricing.test.cjs
npx tsc --noEmit
npm run build
```

Verify with an archived draft, an active plan, a changed price, paused onboarding,
one-time system builds, recurring optional services, and email drafts before sharing
the public link. From `admin-dashboard`, run `node --test scripts/test-plan-pricing.cjs`.
