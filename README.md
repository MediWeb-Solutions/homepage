# MediWeb Solutions

The application is a SvelteKit app. Authentication is handled by Better Auth,
and PostgreSQL data is accessed through Drizzle ORM. The old FastAPI/MongoDB
backend is no longer part of the application runtime.

## Local development

Copy `.env.example` to `.env`, set a unique `BETTER_AUTH_SECRET` with at least
32 characters, and set `BETTER_AUTH_URL` to the URL where the app is running.
Then start PostgreSQL with Docker Compose (the local port defaults to `5433` to
avoid colliding with another PostgreSQL service):

```powershell
Copy-Item .env.example .env
docker compose up -d postgres
```

Set Stripe and contact-email variables if you want to test those features, then
run `pnpm install`, `pnpm db:migrate`, and `pnpm dev`.

The Compose service stores data in a named volume, so stopping the container
does not remove the database.

The first migration creates Better Auth tables and app tables for enrollments,
lesson progress, payments, and contact messages. Course catalog data remains
in source code, as it did in the previous backend. Existing MongoDB data is
not imported; this setup starts with an empty PostgreSQL database.

## Database commands

- `pnpm db:generate` generates a migration from the Drizzle schema.
- `pnpm db:migrate` applies pending migrations.
- `pnpm db:studio` opens Drizzle Studio.

Run migrations explicitly before starting a new deployment. The app does not
automatically alter the database schema on startup.

For production, build with `pnpm build` and run the adapter-node server with
`pnpm start`. Provide the database, Better Auth, Stripe, and email environment
variables to the server process, and set `BETTER_AUTH_URL` to the public HTTPS
origin.

## Payments and email

Configure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` for Stripe Checkout.
The webhook endpoint is `/api/stripe/webhook`. Checkout sessions create the
course product and price in Stripe if they do not already exist.

Contact submissions are stored in PostgreSQL. To send owner notifications,
configure `EMERGENT_EMAIL_KEY`, `EMAIL_FROM_NAME`, and `CONTACT_ALERT_EMAIL`;
email delivery failures are recorded on the contact message.
