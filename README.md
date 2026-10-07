# Kavya Labs - Week 3 Admin Dashboard

Week 3 brief: **Admin dashboard - user management + analytics**.

Live app: https://kavya-labs-week3.vercel.app

This branch contains the complete Next.js application. The `main` branch retains the earlier Week 2 submission.

## Try the dashboard

| Account | Email | Password |
| --- | --- | --- |
| Administrator | admin@kavya.example | KavyaDemo2026! |
| Read-only viewer | viewer@kavya.example | KavyaDemo2026! |

These are intentionally public demo credentials for fictional data. Do not enter real personal information. Login uses NextAuth credentials, server-side password verification, and encrypted JWT session cookies. Google OAuth is supported when its environment variables are configured, but is not required for the demo.

## Features

- Protected dashboard and API; unauthenticated requests are rejected.
- Admin-only create, edit and delete actions, enforced by the API.
- User directory with search, role/status filters, pagination and CSV export.
- Roles, account statuses and department assignment on directory records.
- Server validation, duplicate-email detection, last-active-admin protection and delete confirmation.
- Analytics from stored user data: totals, active-user percentage, join-date growth and department distribution.
- Persistent activity history for successful changes.
- Responsive desktop and phone layouts, keyboard-accessible dialogs, error/loading/empty states.

## Storage and scope

The hosted application saves its small shared demo dataset as a **private Vercel Blob JSON document**. It is not browser localStorage or serverless process memory. Reads bypass the cache; conditional ETag writes and revision checks reject concurrent edits rather than silently overwriting them. Local development uses `.data/state.json` when no Blob token is configured. Production fails closed if storage is missing.

The directory is a sample team-management dataset. Changing a directory role does not provision a login account. The two demo login accounts have fixed permissions. No real invitation email is sent. Analytics describe the directory, not visitor traffic. This is a bounded assignment demo (250 users, last 100 activity events), not a production identity-management system.

## Run locally

```bash
npm ci
cp .env.example .env.local
# Set NEXTAUTH_SECRET to a random secret and NEXTAUTH_URL to your local URL.
npm run dev
```

Required deployment variables: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `BLOB_READ_WRITE_TOKEN`.

Optional Google variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAILS` (comma-separated verified admin email allowlist). Google callback: `/api/auth/callback/google`. Other Google accounts receive viewer access.

```bash
npm test
npm run build
```

The server is Node.js on Vercel. The source uses the Next.js App Router, React, NextAuth, Vercel Blob and Lucide icons.
