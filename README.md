# Orbit Mobile — Telecom Customer Portal

> **An original, fictional telecom self-service portfolio project** illustrating React/TypeScript architecture and T-shaped Java Spring Boot development. Not affiliated with Vodafone, Three, or VodafoneThree.

An interactive customer dashboard for mobile usage, billing, plan management, support requests and account settings. Designed to demonstrate engineering judgment rather than just UI screenshots.

## Orbit Mobile (Expo / React Native)

A cross-platform Expo app (iOS and Android via Expo Go, plus web) lives in [`mobile/`](mobile/README.md). Run it with `cd mobile && npm install && npx expo start`.

## See it immediately — no installation

Open **`preview/index.html`** in a desktop browser. This standalone demo works offline and does not require Node.js, Java, or an account. It is a lightweight demonstration of the interface and interactions; the actual componentised React application is under `frontend/`.

## Features

- Responsive, mobile-friendly account dashboard and data-usage visualisations.
- Billing history with **fictional** downloadable invoice text files.
- Three sample plans, including an explicit plan-change confirmation.
- Support ticket creation, ticket status and account details editing.
- Demo-only sign-in and resettable fictional data.
- A typed React API layer with local mock and Spring Boot modes.
- Backend DTOs, validation, REST controller, JPA/H2/PostgreSQL profiles and CI examples.

## Quick start — frontend

Requirements: **Node.js 22+** and npm.

```sh
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Default `mock` mode requires no backend. Mock changes are stored in your browser's local storage, and can be reset under Account settings. The app initially opens straight to the fictional dashboard for convenient review; click **Sign out** to examine the demo sign-in flow.

Demo sign-in: username `demo`, password `Demo123!`. These are intentionally public and never suitable for a real account.

```sh
npm run check
npm test
npm run build
```

## Quick start — React + Java Spring Boot

Requirements: **Node.js 22+**, **Java 21**, **Maven 3.9+**.

In terminal A:

```sh
cd backend
mvn spring-boot:run
```

In terminal B:

```sh
cd frontend
cp .env.example .env
# Edit frontend/.env and set VITE_API_MODE=server
npm install
npm run dev
```

Open `http://localhost:5173` and sign in using the demo credentials. Vite proxies `/api` to Spring Boot on port 8080. The API uses an in-memory H2 database by default, reseeded each time the service starts.

To explore an optional PostgreSQL-backed version, run `docker compose up --build` at the repository root, then start the frontend using `VITE_API_MODE=server`. Docker and PostgreSQL are not needed for the default demo.

## Project layout

```text
telecom-customer-portal/
├── frontend/
│   ├── src/App.tsx              # Main React app and page components
│   ├── src/styles.css           # Design system and responsive UI
│   ├── src/lib/api.ts           # Typed mock/server API adapter
│   ├── src/lib/types.ts         # Shared frontend data contracts
│   ├── src/data/seed.ts         # Fictional demo account
│   └── tests/                   # Vitest tests
├── backend/
│   └── src/main/java/          # Java REST service, security, JPA
├── preview/index.html          # Zero-install standalone UI preview
├── docs/ARCHITECTURE.md
├── docs/PORTFOLIO_CASE_STUDY.md
├── docs/INTERVIEW_GUIDE.md
├── .github/workflows/ci.yml
└── docker-compose.yml
```

## API

| Method | Path | Meaning |
| --- | --- | --- |
| GET | `/api/v1/portal` | Get a complete customer snapshot |
| PATCH | `/api/v1/plan` | Change simulated plan |
| POST | `/api/v1/tickets` | Create ticket |
| PATCH | `/api/v1/profile` | Edit profile |
| POST | `/api/v1/demo/reset` | Restore seeded example |

See [architecture and decisions](docs/ARCHITECTURE.md) and the [case study](docs/PORTFOLIO_CASE_STUDY.md). To publish a reviewable link, follow [GitHub Pages instructions](docs/PUBLISH.md).

## Production-readiness disclosure

This is a **portfolio demo**, not production telecom software. All accounts, invoices, usage figures, support requests and plan changes are illustrative. It has no real subscriber data, customer authorization, SMS service, payment processor, charging engine or contract fulfilment. Basic auth and sample credentials are for local demonstration **only**. PostgreSQL schema auto-update is also demo-only; production requires migration scripts and stricter security architecture. No claim is made that the app has shipped commercially or meets production WCAG standards.

**Verification note:** The project files were constructed in an environment without access to npm or Maven registries. The standalone HTML preview can be opened and visually checked; the React/Java dependency builds and automated tests must be run on a machine/CI with dependency access before claiming a passing build.

## Recruiter presentation

Share the repository README, an accessible preview/demo link, and the [case study](docs/PORTFOLIO_CASE_STUDY.md). To publish a reviewable link, follow [GitHub Pages instructions](docs/PUBLISH.md). Discuss your architectural decisions honestly. Tailor it with features you actually implemented, screenshots and the resulting passing CI checks before adding it to your professional portfolio.

## Licence
MIT. Fictional brand, user names, accounts and data were created for this demonstration.
