<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# General public website

This app introduces the QR ordering service, benefits, public plans, and optional services. It runs on port 3000 locally. Restaurant-specific UI and server actions live in ../owner-public-website.

- Keep ordering, carts, QR/GPS validation, tracking, and shop profiles in the owner website.
- Legacy shop links may redirect only to configured NEXT_PUBLIC_OWNER_SITE_URL; never trust a redirect destination from query parameters.
- Public pricing reads only allowlisted catalog and public platform fields through server-only code.
- Keep payment and subscription records private.
- Support Khmer and English, light/dark themes, mobile layouts, and accessible touch targets.
- Read installed Next.js guides before framework changes. Use Server Components by default.
- Run node --test tests/*.test.cjs and npm run build for relevant changes.

