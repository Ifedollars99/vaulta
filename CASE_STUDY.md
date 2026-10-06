# Vaulta — Portfolio Case Study

## Problem

Nigerian digital-banking users juggle multiple apps for transfers, bill payments, card control and transaction history, while fraud and account-takeover anxiety keep rising. Most demo fintech projects show a static dashboard — they never demonstrate the harder product problems: explicit money-movement confirmation, explainable risk, device trust, or the operations tooling a real fintech team uses behind the scenes.

## Users

- **Everyday customers** (Lagos, Abuja, Kano, …) who send money, pay MTN/Airtel/IKEDC/DSTV bills, shop at Shoprite/Jumia and want to understand their spending.
- **Operations staff** who triage flagged transfers, review customers and need every action traceable.

## Solution

Vaulta is a production-style prototype covering both sides:

- A customer app with a full send-money flow (beneficiary → amount → review → PIN → receipt), masked-by-default sensitive data, computed spending insights, card controls and a Security Center with a live score.
- An admin console with platform KPIs, a searchable transaction ledger, customer lifecycle management (Active / Under review / Suspended), a risk-sorted fraud queue with approve/block/contact triage, and an audit log that records every admin action.

## Design Decisions

- **Original identity, restrained system:** deep-indigo brand, flat cards, 1px borders, whitespace-led hierarchy — inspired by the quality bar of Revolut/Mercury-class products without copying them.
- **Money-first typography:** signed, decimal-formatted Naira in tabular numerals; amounts right-aligned in tables; status always colour *plus* text.
- **Mobile as a first-class layout:** bottom nav, card lists instead of squeezed tables, thumb-friendly transfer steps — not a shrunk desktop.
- **Honest simulation:** every fake capability (risk scores, transfer settlement, 2FA) is labelled "simulated/demo" in the UI and docs.

## Engineering

- **Vue 3 Composition API throughout** (`<script setup>`, `ref/computed/watch/onMounted`), props/emits contracts, components split before they pass ~200 lines.
- **Backend-ready layering:** pages → components → Pinia stores/composables → `services/` (async mock APIs with latency) → `data/` seeds. Swapping services for HTTP is the documented migration path.
- **State discipline:** only cross-page state in Pinia (8 stores); form, modal, tab and step state stays local. Transaction filters live in the store deliberately, so detail → back preserves the list.
- **Computed-over-hardcoded:** spending insights, security score, fraud reasons, analytics and admin KPIs all derive from the dataset — verified by executing the logic against seeds during development (this caught a real partial-month comparison bug and a misleading insight).
- **Performance:** lazy-loaded routes, shared Chart.js wrappers, paginated lists, single-commit transfer settlement (balance + ledger + beneficiary metadata in one action).

## Security (Applied Principles)

- Mask-by-default with time-boxed reveal; clipboard with fallback.
- Explicit confirmation gates before money moves or destructive actions fire.
- Role-based route guards; PIN-gated transfers; device trust/revoke with audit trail.
- Defence-in-depth mindset documented in README, without claiming compliance or real protection the demo doesn't provide.

## Challenges

1. **Misleading insights from partial-month data** — comparing the in-progress month against a full month produced a +63% "increase". Fixed by comparing latest *full* month vs previous (verified: −30%).
2. **Keeping fraud rules consistent** across transfer-time scoring, detail display and the admin queue — solved with one shared rule family in `utils/` (`transfer.js`, `riskScoring.js`, `fraud.js`).
3. **Print receipts** — a print stylesheet isolates the receipt section so `window.print()` yields a clean slip, not the app chrome.
4. **Environment constraints** — builds time out in the sandbox, so verification leaned on full-repo ESLint (now 0 errors, 0 warnings), executed unit-level checks of every calculation, and icon-export audits.

## Future Improvements

With a real backend: idempotent transfer execution with server-side risk scoring, PDF statements, webhook-driven virtual-account funding, authenticator-based 2FA, licensed KYC/BVN, and E2E coverage of the money-movement paths. The service boundary is already shaped for this.
