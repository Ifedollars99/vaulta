# Vaulta — Your money. Your control.

A **production-style digital banking platform prototype** for the Nigerian market, built with Vue 3, Pinia and Tailwind CSS.

Vaulta demonstrates consumer banking (dashboard, transfers, cards, analytics, security), an operations console (transactions, customers, fraud queue, audit logs), and the frontend architecture that connects them. All data is fictional; all banking, fraud-detection and payment functionality is simulated.

> **Disclaimer:** Vaulta is a portfolio project. It has no real banking integrations, no real payment processing, no real fraud engine, no KYC verification, no banking licence and no financial-institution partnerships.

---

## Overview

Two apps in one codebase, separated by role-based routing:

- **Customer app** — landing, auth (login / 4-step register / password reset), dashboard, transactions + printable receipts, 6-step send-money flow with transfer PIN, beneficiaries, virtual + physical cards, spending analytics, Security Center, notifications, profile, settings.
- **Operations console** (`/admin`) — KPI overview, platform transaction table with investigation drawer, customer search + profiles with suspend/review actions, risk-sorted fraud queue with approve/block/contact triage, and an audit log that records every admin action.

## Features

| Area | Highlights |
|---|---|
| Auth | Email-or-phone login, password visibility, remember-me, 4-step registration with NG phone validation and password-strength meter, demo accounts |
| Dashboard | Masked balance with copy, quick-action modals (receive / bills / add money), Chart.js income-vs-expenses with 3M/6M toggle, computed insights, security alert |
| Transactions | 7-dimension filtering, 4 sorts, pagination, detail view with risk panel, print-to-receipt |
| Transfer | Beneficiary → amount → review → PIN → success; flat ₦25 fee; high-risk transfers settle as Pending via simulated scoring |
| Beneficiaries | CRUD, favorites, search, 10-digit + bank validation, one-tap handoff into transfer |
| Cards | Time-boxed PAN/CVV reveal (auto re-masks), freeze, limits, replace |
| Analytics | Category doughnut, weekly bars, monthly comparison, KPIs, generated insights |
| Security | Computed 0–100 score, device trust/revoke, login trail, protection toggles |
| Admin | 8 KPIs, investigation drawer, customer lifecycle actions, fraud triage, audit trail |

## Tech Stack

Vue 3 (Composition API, `<script setup>`), JavaScript, Tailwind CSS, Vue Router (lazy routes + role guards), Pinia, Lucide icons, Chart.js via vue-chartjs. No UI kit, no TypeScript, no Bootstrap.

## Architecture

```text
pages/ ──route views, one concern each
  ↓
components/ ── ui/ · layout/ · charts/ · dashboard/ · transactions/
               transfer/ · beneficiaries/ · cards/ · security/ · admin/
  ↓
stores/ (Pinia) + composables/ ── auth, account, transactions,
               beneficiaries, cards, security, notifications, admin
  ↓
services/ ── async mock APIs with latency (auth, account, transactions,
             transfer, beneficiaries, cards, security, notifications, admin)
  ↓
data/ ── fictional Nigerian seeds (users, transactions, beneficiaries,
         cards, devices, notifications, customers, audit logs)
```

Components never import seed data directly. Replacing `services/*` internals with HTTP calls is the documented path to a real backend (Node/Express + PostgreSQL shape assumed, never coupled to).

## Security Considerations

- Sensitive values masked by default (balances, PANs, CVVs, account numbers); card reveal auto-expires after 30 seconds.
- Destructive/financial actions require explicit confirmation: transfer review + PIN, beneficiary delete confirm, card replace confirm, admin suspend.
- Route guards enforce `guestOnly` / `requiresAuth` / `requiresAdmin`; login honours `?redirect=` only for same-origin paths.
- No secrets in code; session is a simulated token in local storage, clearly labelled as such.

## Fraud Detection Simulation

Risk scores (0–100) come from deterministic, explainable rules (large amount, new beneficiary, new device, unusual location/time) — the same rule family runs at transfer time, on the detail page, and in the admin queue. It is a UI/UX simulation for demonstrating triage workflows, **not** a detection engine.

## UX Decisions

- Money is always signed, decimal-formatted Naira with tabular numerals; statuses are colour + text, never colour alone.
- Tables on desktop collapse to cards on mobile; bottom navigation on phones.
- Every data surface has loading (skeleton), empty and error states — no blank screens.
- Insights are computed from the dataset (latest *full* month vs previous), so they can't contradict the charts.

## Project Structure

```text
src/
  assets/        # tailwind.css (design tokens, print stylesheet)
  components/    # ui, layout, charts, feature folders
  composables/   # useAuth, useCurrency, useGreeting, usePagination
  data/          # mock seeds
  layouts/       # Public, Auth, App, Admin
  pages/         # auth, dashboard, transactions, transfer, beneficiaries,
                 # cards, analytics, security, notifications, profile,
                 # settings, admin
  router/        # routes + guards
  stores/        # 8 Pinia stores
  services/      # mock API boundary
  utils/         # formatCurrency, formatDate, validators, transfer,
                 # riskScoring, fraud
```

## Installation

```bash
npm install
```

## Environment Variables

None required. The app runs entirely on mock services; no `.env` file is needed. (A future backend integration would introduce `VITE_API_URL` here.)

## Running Locally

```bash
npm run serve   # dev server
npm run build   # production build
npm run lint    # eslint (clean: 0 errors, 0 warnings)
```

Demo accounts (password for both: `Vaulta123!`, transfer PIN: `1234`):

| Role | Email |
|---|---|
| Customer | `adewale.ogunleye@example.ng` |
| Admin | `admin@vaulta.ng` |

Accounts you register yourself are saved in that browser's local storage, so you can log out and back in with them (demo-only mechanism — see `services/auth.service.js`).

## Future Improvements

- Real backend (auth, ledger, idempotent transfers) behind the existing service boundary.
- Real-time statements (PDF export), virtual-account funding webhooks.
- 2FA via authenticator app, biometric WebAuthn, device fingerprinting.
- Full KYC flow, BVN verification via licensed provider.
- E2E tests (Cypress/Playwright) and visual regression on the receipt print path.

## Screenshots

Capture from a local run (`npm run serve`) and place in `public/images/`:

| Screen | Route |
|---|---|
| Landing | `/` |
| Dashboard | `/dashboard` (customer login) |
| Transfer review | `/transfer` |
| Analytics | `/analytics` |
| Security Center | `/security` |
| Fraud queue | `/admin/fraud` (admin login) |

## Author

Built as a portfolio project demonstrating Vue 3 frontend engineering for fintech. See [CASE_STUDY.md](./CASE_STUDY.md) for the full product and engineering write-up.
