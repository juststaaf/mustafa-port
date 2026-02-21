# Mustafa Portfolio

Portfolio website for Mustafa Mazin with:

- One-page public experience + cinematic intro
- Dedicated pages for blog, certificates, and "Let's Work Together"
- Hidden dashboard at `/studio` with password auth
- Full content management (add, edit, delete)
- Local image uploads with automatic `jpg/png -> webp` conversion
- Prisma + MySQL data layer

## Stack

- `Next.js` App Router
- `Prisma` + `MySQL`
- `framer-motion` for motion system
- `bcryptjs` for dashboard password hash
- `sharp` for image optimization

## Setup

1. Install dependencies

```bash
npm install
```

2. Create env file

```bash
cp .env.example .env
```

3. Update `.env`

- `DATABASE_URL` to your MySQL connection string
- `STUDIO_INITIAL_PASSWORD` initial dashboard password
- `STUDIO_SESSION_SECRET` long random secret

4. Push schema and seed

```bash
npm run db:push
npm run db:seed
```

5. Run dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Dashboard

- URL: `/studio`
- Login is password-only
- Session is browser-session based (login required when browser is reopened)
- Basic in-memory rate limiting is enabled for login attempts

## Notes

- Intro audio path defaults to `/audio/intro-pulse.mp3`.
- Add your audio file to `public/audio/intro-pulse.mp3` or change it from dashboard settings.
- Portrait and logos can be uploaded from dashboard; files are stored in `public/uploads`.
