# Maskindeling.no (MVP)

Et enkelt, internt system for deling av maskiner mellom kommunale virksomheter.

## Teknologistack
- **Next.js 14 + TypeScript + Tailwind CSS**
- **Neon Postgres**
- **Drizzle ORM**
- Vercel-ready og GitHub-ready struktur

## Funksjoner i MVP
- Innlogging med rolle (bruker/admin)
- Beskyttede ruter via middleware + serverside auth
- Dashboard med nøkkeltall
- Maskinliste med søk og filter
- Maskindetaljside med forespørselsflyt
- Adminpanel for behandling av forespørsler
- Norsk språk i hele UI

## Datamodell
Tabeller:
- `users`
- `organizations`
- `departments`
- `machines`
- `machine_requests`

Statusverdier:
- Machine status: `tilgjengelig`, `opptatt`, `på_service`, `ute_av_drift`
- Request status: `sendt`, `godkjent`, `avslått`

## 1) Installer prosjektet lokalt
```bash
npm install
```

## 2) Sett opp Neon Postgres

> **Hva skal ligge i GitHub?**
> Behold `*.example`-filen i repoet (her: `.env.example`).
> `\.env.local` skal normalt **ikke** committes, og brukes kun lokalt/ i Vercel-miljøvariabler.

1. Opprett konto/prosjekt i Neon.
2. Opprett en database.
3. Kopier connection string.
4. Kopier eksempelvariabler til en lokal fil:

```bash
cp .env.example .env.local
```

5. Rediger deretter `.env.local` med dine verdier:

```env
DATABASE_URL=postgres://user:password@ep-xxxx.neon.tech/dbname?sslmode=require
AUTH_SECRET=sett-en-lang-og-unik-hemmelighet
```

## 3) Kjør migrasjoner
```bash
npm run db:migrate
```

Dette kjører SQL-migrasjonen i `drizzle/0000_init.sql`.

## 4) Seed databasen
```bash
npm run db:seed
```

Seed oppretter:
- Organisasjon: **Oslo kommune**
- Avdelinger:
  - Kirkelig fellesråd
  - Vann- og avløpsetaten
  - Bymiljøetaten
- Maskiner:
  - Minigraver Kubota U27
  - Minigraver Yanmar SV26
  - Vibroplate Wacker Neuson
  - Generator Honda
  - Hjullaster Volvo L30

Minst én maskin er tilgjengelig hos Kirkelig fellesråd.

Demo-brukere:
- `admin@oslo.kommune.no` / `Passord123!`
- `ola@oslo.kommune.no` / `Passord123!`

## 5) Kjør lokalt
```bash
npm run dev
```

Åpne: `http://localhost:3000`

## 6) Deploy til Vercel (steg-for-steg)
1. Push prosjektet til GitHub.
2. Logg inn på Vercel.
3. Velg **New Project** og importer repo.
4. Sett miljøvariabler i Vercel-prosjektet:
   - `DATABASE_URL`
   - `AUTH_SECRET`
5. Deploy.
6. Etter deploy: kjør migrasjon og seed mot produksjonsdatabase (lokalt eller CI mot samme `DATABASE_URL`).

## Miljøvariabler
- `DATABASE_URL` (påkrevd): Neon Postgres connection string
- `AUTH_SECRET` (påkrevd): hemmelig nøkkel for JWT-session

## Mappestruktur
```text
src/
  app/
    (protected)/
      admin/
      dashboard/
      machines/
    login/
  components/
    ui/
  lib/
    actions.ts
    auth.ts
    db.ts
    schema.ts
scripts/
  migrate.ts
  seed.ts
drizzle/
  0000_init.sql
```
