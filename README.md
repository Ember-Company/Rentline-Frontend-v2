# Rentline Frontend

Aesthetic, production-ready scaffold for **Rentline** built with:

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** + **HeroUI** (NextUI successor) for polished UI
- **TanStack Router** for routing
- **TanStack Query** (+ Devtools) for data fetching
- **TanStack Table** for data grids
- **Axios** with **Bearer token interceptors**
- **i18n** (English, Spanish, Portuguese) + **Theme switching**
- Role-gated routes and a collapsible, beautiful sidebar

> This pairs with the Rentline .NET 8 backend. The scaffold already calls `/api/auth/register-org`, `/api/auth/login`, `/api/auth/accept-invite`, and `/api/org/me`.

---

## Quick Start

```bash
# 1) Install
npm i
# or: pnpm i / yarn

# 2) Configure API URL (backend)
cp .env.example .env
# edit VITE_API_URL (e.g., https://localhost:5001)

# 3) Run dev
npm run dev
# open http://localhost:5173
```

> **HTTPS tip:** if your backend runs HTTPS on port `5001`, trust the dev cert: `dotnet dev-certs https --trust`

---

## Stack & Libraries

- **UI**: Tailwind v4 + HeroUI (pre-configured; see `tailwind.config.ts`)
- **Routing**: TanStack Router v1 (`src/router.tsx`)
- **Data**: TanStack Query (`src/queries/*`, `QueryClientProvider`) + Devtools
- **Tables**: TanStack Table (`src/components/DataTable.tsx`)
- **HTTP**: Axios (`src/lib/api.ts`) with request/response interceptors
- **Auth storage**: LocalStorage (`src/lib/auth.ts`)
- **i18n**: i18next + react-i18next (`src/i18n`)
- **Icons**: Tabler Icons (for the improved sidebar)

Install icons (once):
```bash
npm i @tabler/icons-react
```

---

## Environment

Create a `.env` file:
```
VITE_API_URL=https://localhost:5001
```

Common values:
- `https://localhost:5001` (Kestrel HTTPS default)
- `http://localhost:5000` (Kestrel HTTP default)

> **CORS**: Backend must allow `http://localhost:5173` during development.

---

## App Features

### Authentication
- **Login** (`/login`) → stores JWT, role, orgId in LocalStorage via `auth.set(...)`
- **Register Org** (`/register`) → POST `/api/auth/register-org`
- **Accept Invite** (`/accept-invite`) → POST `/api/auth/accept-invite`
- Axios request interceptor injects `Authorization: Bearer <token>`
- 401 responses auto-clear storage and redirect to `/login`

### Authorization & Routing
- Role-gated routes with `beforeLoad` guards in TanStack Router
- Roles: `Landlord`, `AgencyAdmin`, `Manager`, `Maintenance`, `Tenant`, `Viewer`
- Example: Properties/Units visible only to Landlord/AgencyAdmin/Manager

### i18n
- Languages: **en**, **es**, **pt**
- Language switcher component in the Topbar using HeroUI `Select`
- Add strings in `src/i18n/locales/*.json`

### Theme Switching
- Light/Dark toggle in Topbar (adds/removes `dark` class on `<html>`)
- HeroUI respects Tailwind color tokens

### Sidebar (improved)
- Collapsible with persisted state (localStorage)
- Active item highlighting, gradient/blur background
- Role-aware visibility: links hide based on the user’s role
- File: `src/components/Sidebar.tsx`

### Dashboard
- Fetches `/api/org/me` and shows org info + **Properties** table
- DataTable uses TanStack Table (sortable headers)
- File: `src/pages/Dashboard.tsx`

### Placeholder Pages
Prepared routes/pages for the upcoming CRUDs (copy and build on them):
- `/properties`, `/units`, `/leases`, `/maintenance`, `/tenants`, `/invites`, `/settings`

---

## Project Structure

```
src/
  components/           # Sidebar, Topbar, DataTable, Language/Theme
  i18n/                 # i18n setup + locales (en/es/pt)
  layout/               # DashboardLayout (Topbar + Sidebar shell)
  lib/                  # api (Axios), auth (LocalStorage helpers)
  pages/                # Onboarding, Auth, Dashboard, Placeholder pages
  queries/              # TanStack Query client + /api/org/me hook
  styles/               # Tailwind v4 entry
  router.tsx            # TanStack Router tree + guards
  App.tsx               # Providers (HeroUI, Query, Router)
  main.tsx              # React entry
tailwind.config.ts      # Tailwind v4 + HeroUI plugin
vite.config.ts          # Vite + React SWC + Tailwind v4
.env.example            # API base URL
```

---

## Backend Integration Notes

- **API URL** must match your backend (`/swagger` should load on the same base URL you set).
- Common mistake: using **https://localhost:5000** (HTTP port) → causes **ERR_SSL_PROTOCOL_ERROR**.  
  Use `https://localhost:5001` for HTTPS or change to `http://localhost:5000`.
- Ensure backend CORS policy permits the dev origin (`http://localhost:5173`).

---

## Extending the App

- **Add a page**: Create a component in `src/pages`, add a route in `src/router.tsx`, guard with roles if needed.
- **Add a query**: Create a hook under `src/queries`, use `useQuery` with `api.get(...)`, render via HeroUI + Table.
- **Customize theme**: Extend Tailwind tokens or HeroUI theme settings in `tailwind.config.ts`.

---

## Scripts

```bash
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build
npm run preview   # preview the build (http://localhost:5173)
```

---

## Troubleshooting

- **401 Unauthorized** after login → Check JWT storage, API base URL, backend auth config.
- **CORS errors** → Add dev CORS policy in backend (allow origin `http://localhost:5173`).
- **SSL errors** → Match scheme/port; run `dotnet dev-certs https --trust` for HTTPS dev.
- **Blank table** on dashboard → Make sure `/api/org/me` returns `properties` array (Includes/ThenIncludes in backend).

---

## License

Private/internal project for Rentline. Adjust as needed.
