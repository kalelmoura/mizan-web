# Mizan Web

Front end for **Mizan** — a clinical trial patient-matching web app for coordinators. Shows which eligibility criteria passed, failed, or need more screening, with a full audit trail for every patient–trial recommendation.

Built for the Cursor mobile hackathon.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

By default the app uses **mock data** that conforms to [`API.md`](./API.md). To connect to a live backend:

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_USE_MOCK_API=false and NEXT_PUBLIC_API_URL
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with stats, recent matches, audit feed |
| `/patients` | Patient list |
| `/patients/[id]` | Patient profile and trial matches |
| `/trials` | Trial list |
| `/trials/[id]` | Trial detail and patient matches |
| `/matches` | All patient–trial recommendations |
| `/matches/[id]` | Criteria breakdown + audit trail |

## API contract

See [`API.md`](./API.md) for the full REST API specification the frontend expects from the Mizan backend.

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```
