# booking-web

A React web application for managing summer camp registrations and room bookings for **BBSO Kids Camp 2026**. Parents and guardians can register campers, select accommodations, and complete payment checkout — all in English or Romanian.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Routing | React Router 7 |
| Forms | React Hook Form + Zod |
| Server state | TanStack Query v5 |
| Styling | Tailwind CSS 4 |
| i18n | i18next (English & Romanian) |
| HTTP | Axios with JWT refresh interceptor |

## Prerequisites

- Node.js 20+
- npm

## Getting Started

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_ORG_SLUG=bbso-kids
```

Start the development server:

```bash
npm run dev
# http://localhost:5173
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── api/            # Axios API modules (auth, bookings, campers, rooms, buildings)
├── components/     # Shared UI components (Button, Input, Countdown, Toast, etc.)
├── pages/          # Route-level page components
│   ├── Login / Register / VerifyEmail / ForgotPassword / ResetPassword
│   ├── CodeOfConduct
│   ├── Campers
│   ├── BuildingSelection / RoomSelection
│   ├── Checkout / BookingSuccess / BookingFailed
│   └── Legal (Privacy, Terms, Contact)
├── hooks/          # useAuth, useCurrentUser
├── store/          # Auth token storage, booking flow state
├── router/         # Route definitions and ProtectedRoute
├── types/          # TypeScript interfaces
└── i18n/           # Translation files (en, ro)
```

## Booking Flow

1. **Register / Login** — family account with email verification
2. **Code of Conduct** — acceptance required before booking
3. **Campers** — add and manage campers (name, DOB, grade, gender, special requirements)
4. **Building Selection** — browse accommodations with pricing tiers and member discounts
5. **Room Selection** — filter by gender/age, place a timed hold on a room
6. **Checkout** — Stripe payment for one or more campers
7. **Confirmation** — booking success/failure page with status tracking

Room holds expire on a countdown timer visible throughout the checkout flow.

## Authentication

- JWT-based with access + refresh tokens stored in `localStorage`
- Axios interceptor queues requests and refreshes the token on `401`
- Auto-logout when refresh fails

## Camper Statuses

| Status | Meaning |
|---|---|
| `NEEDS_BED` | Camper registered, no room selected |
| `NEEDS_PAYMENT` | Room held, payment pending |
| `PAYMENT_SUCCESS` | Booking confirmed |
| `PAYMENT_FAILED` | Payment did not complete |

## Internationalization

Language is auto-detected from the browser and persisted in `localStorage`. A language switcher is available in the app header. All UI strings have English and Romanian translations.

## CI/CD

### Pull Request
Triggered on `pull_request` events: installs dependencies and runs a production build to validate the branch compiles cleanly.

### Merge to Master
Triggered on push to `master`:
1. Build with production environment variables
2. Sync `dist/assets/` to S3 with a 1-year immutable cache header
3. Sync remaining `dist/` files with `no-cache` headers
4. Invalidate the CloudFront distribution

**Required GitHub Secrets:**

| Secret | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_ORG_SLUG` | Organization identifier |
| `FRONTEND_BUCKET_NAME` | S3 bucket name |
| `FRONTEND_DISTRIBUTION_ID` | CloudFront distribution ID |

AWS credentials use OIDC with the `github-actions-lightsail-deploy` IAM role in `eu-central-1`.
