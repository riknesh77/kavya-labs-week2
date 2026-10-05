# Kavya Labs - Week 2 Authentication

Week 2 submission for the ANDP Simulator brief:

- User authentication
- NextAuth + Google OAuth concept
- Protected workspace state
- Sign out flow
- Responsive UI

This build keeps the Week 1 Kavya Labs landing page direction and adds an authentication-first experience. The page demonstrates the expected Google OAuth flow with a session-style signed-in state so the evaluator can inspect the user journey without requiring real Google credentials.

## Production Auth Notes

In a production NextAuth setup, the Google provider would be configured with:

```txt
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_SECRET=
```

The protected workspace would be guarded by a server-side session check and routed through `/api/auth/[...nextauth]`.
