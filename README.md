# OFC360

**AI-powered HR & workforce management platform** by [EquinoxSphere](https://www.ofc360.com/).

OFC360 helps organizations run core HR operations in one place — employees, attendance, payroll, recruitment, performance, onboarding, internal communication, and AI-assisted workflows — with multi-tenant company support and role-based access.

| | |
|---|---|
| **Product** | [www.ofc360.com](https://www.ofc360.com/) |
| **API (default)** | `https://api.ofc360.com` |
| **Founders** | Vinit Sharma · Banoth Siddarth |
| **This repo** | Frontend (React + TypeScript + Vite) |

---

## Features

### Core HR
- Employee directory, profiles, activation & invitations
- Department & manager management
- Multi-step company / HR-admin / employee onboarding
- Documents, timelines, and employee experience tools

### Workforce operations
- Attendance, punches, shifts, rosters, leave & regularization
- Payroll runs, payslips, and analytics
- Performance cycles and reviews
- Exit / offboarding workflows

### Talent & recruitment
- Jobs, candidates, applications, interviews & offers
- ATS scoring and AI resume copilot
- Public careers portal
- Talent pool, referrals, vendors & automation rules

### Connect
- Internal chat and presence
- Meetings with WebRTC (audio/video, screen share)
- Notification & call sound system

### Intelligence & admin
- AI chat assistant, insights, document intelligence
- Predictive / analytics dashboards
- Super-admin: tenants, users, subscriptions, audit & security
- Role portals: Employee, Manager, Executive, IT Admin, HR Admin

### Platform
- Email OTP auth, session restore, token refresh
- Multi-company headers (`Authorization`, `X-Company-ID`)
- Permission & role guards on protected routes
- Marketing site: landing, pricing, features, blog, founders, FAQ

---

## Tech stack

| Layer | Choice |
|-------|--------|
| UI | React 18, TypeScript, Vite 5 |
| Styling | Tailwind CSS, shadcn/ui (Radix), Framer Motion |
| Routing | React Router v6 |
| Server state / API | Redux Toolkit + RTK Query |
| Client / UI state | Zustand (domain stores) |
| Forms & validation | React Hook Form, Zod |
| Charts | Recharts |
| Tests | Vitest, Testing Library, Playwright |
| CI | GitHub Actions (`typecheck` → `lint` → `test` → `build`) |
| Deploy | Vercel-ready SPA (`vercel.json` rewrites) |

Path alias: `@/` → `src/`.

---

## Repository structure

```text
src/
├── api/                 # RTK Query base client, interceptors, endpoint modules
├── app/                 # Redux provider, auth bootstrap, route trees
├── components/          # Shared UI, guards, dashboard widgets
├── features/            # Domain modules (auth, employees, connect, …)
├── hooks/               # Auth, media, WebRTC, payroll, etc.
├── layouts/             # App shell layouts
├── lib/                 # Shared helpers (e.g. permissions)
├── pages/               # Top-level & marketing pages
├── services/            # Auth storage, interceptors, websocket helpers
├── store/               # Redux store, root reducer, middleware
├── stores/              # Zustand stores (attendance, ATS, connect, …)
├── types/               # Shared TypeScript types
├── utils/               # Utilities
└── test/                # Unit & integration tests
public/                  # Static assets, sounds, sitemap, robots.txt
scripts/                 # Maintainability / modularize helpers
```

Backend is **not** included in this checkout. The Vite dev server proxies `/api` and `/uploads` to a local API on port `8000` when you run one separately.

---

## Prerequisites

- **Node.js** 20+ (CI uses Node 20)
- **npm** (lockfile: `package-lock.json`)
- Optional: OFC360 backend on `http://localhost:8000` for full API flows

---

## Getting started

### 1. Install

```bash
npm ci
# or
npm install
```

### 2. Environment

Copy or create a `.env` in the project root:

```env
# Backend API base URL (no trailing path required)
VITE_API_BASE_URL=http://localhost:8000

# Optional aliases / app URL used by some flows
VITE_API_URL=http://localhost:8000
VITE_PUBLIC_APP_URL=http://localhost:8080
```

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `VITE_API_BASE_URL` | REST + WS base for RTK Query & auth | `https://api.ofc360.com` |
| `VITE_API_URL` | Alternate API URL where referenced | — |
| `VITE_PUBLIC_APP_URL` | Public frontend origin | — |

> Only variables prefixed with `VITE_` are exposed to the browser.

### 3. Run the app

```bash
npm run dev
```

- App: **http://localhost:8080** (binds on all interfaces; see `vite.config.ts`)
- Dev proxy: `/api` and `/uploads` → `http://127.0.0.1:8000`

### 4. Production build

```bash
npm run build
npm run preview
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (port 8080) |
| `npm run build` | Production bundle → `dist/` |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Vitest (single run) |
| `npm run test:watch` | Vitest watch mode |
| `npm run check:size` | File-size / modularity check |
| `npm run dev:backend` | Local FastAPI backend *(requires `backend/` app)* |

---

## Architecture notes

### Auth & session
- Credentials and session live in Redux (`features/auth`)
- `AuthBootstrap` restores session on load
- `baseQueryWithReauth` attaches Bearer token + company ID and handles refresh
- Public endpoints skip auth headers via `isPublicRequest`

### API layer
- Single RTK Query `api` slice with tag-based invalidation
- Feature endpoints live under `src/api/endpoints/` and feature `*.api.ts` modules
- Normalized errors via `services/api` helpers

### Access control
- `ProtectedRoute` — must be authenticated
- `RoleGuard` / `PermissionGuard` — role & permission checks
- Portals split by persona (employee, manager, executive, IT admin, super-admin)

### State
- **Redux + RTK Query** — auth, cached server data, mutations
- **Zustand** — richer client domains (e.g. attendance UI, connect, ATS analysis)
- Prefer RTK Query for anything that hits the backend; keep Zustand for local/UI orchestration

---

## Roles (high level)

| Role | Typical access |
|------|----------------|
| Employee | Self-service, attendance, payslips, connect |
| Manager | Team approvals, directory, reviews |
| HR Admin | People ops, onboarding, recruitment, payroll config |
| Executive | Analytics & org-wide dashboards |
| IT Admin | Access, devices, ops tooling |
| Super Admin | Multi-tenant platform, billing, security audit |

Exact menus depend on backend permissions and company configuration.

---

## Testing & CI

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

GitHub Actions workflow: `.github/workflows/frontend-ci.yml`  
Runs on pushes/PRs to `main` with the same quality gates.

Tests live mainly under `src/test/` (auth flows, connect, attendance, payroll, Redux API, onboarding, etc.).

---

## Deployment

- Static SPA build output: `dist/`
- `vercel.json` rewrites all routes to `index.html` (client-side routing)
- Set `VITE_API_BASE_URL` in the host’s build env to your API origin
- `public/robots.txt` and `public/sitemap.xml` are tuned for the marketing site; app areas are disallowed from crawlers

Example:

```bash
VITE_API_BASE_URL=https://api.ofc360.com npm run build
```

---

## API surface (summary)

The frontend expects a versioned REST API (primarily `/api/v1/...`, plus `/api/v2/...` intelligence modules and `/api/public/careers`). Major groups include:

- Auth & session  
- Employees, managers, departments  
- Jobs, candidates, applications, interviews, offers  
- Attendance, leave, timesheets, payroll  
- Documents, calendar, announcements  
- Onboarding & activation  
- Assets, exits, exports  
- AI copilots & v2 intelligence services  
- Health: `GET /health`

A fuller endpoint inventory is maintained in `scratch_module_summary.txt` (internal reference).

---

## Contributing

1. Create a branch from `main`
2. Keep changes scoped to one feature/fix when possible
3. Run quality gates before opening a PR:

   ```bash
   npm run typecheck && npm run lint && npm test && npm run build
   ```

4. Prefer extending existing feature modules under `src/features/<domain>/` instead of adding one-off pages with duplicated API logic
5. Avoid `any` for new code; reuse types from `src/types` and feature type modules
6. Do not commit secrets — `.env` should stay local (use env examples / host secrets for deploys)

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| API calls fail in dev | Backend on `:8000`, or set `VITE_API_BASE_URL`; confirm CORS/credentials if not using the proxy |
| Stuck on “Restoring session” | Token/refresh endpoint, cookies (`credentials: "include"`), and auth bootstrap errors in the network tab |
| Blank page after deploy | SPA rewrites enabled; correct `base` / asset paths |
| Company-scoped 403s | Valid `X-Company-ID` (UUID) and user membership for that tenant |
| WebRTC / meetings | Browser permissions, HTTPS (or localhost), and WS URL derived from `VITE_API_BASE_URL` |

---

## License

Private / proprietary — EquinoxSphere · OFC360.  
All rights reserved unless a separate license file states otherwise.

---

## Links

- Website: [https://www.ofc360.com/](https://www.ofc360.com/)
- Product home canonical & marketing routes: `/`, `/features`, `/pricing`, `/about`, `/founders`, `/careers`, `/blog`, `/contact`, `/faq`
