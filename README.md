# Horizon 🌍

**Alternative à Indeed pour l'Afrique.** Plateforme d'emploi bilingue (FR/EN) avec un
espace **candidats** et un espace **recruteurs**.

Construit avec **Next.js 16** (App Router), **React 19**, **TypeScript**,
**Tailwind CSS v4**, **Prisma 6** + **SQLite**, authentification maison (JWT en
cookie httpOnly + bcrypt).

## Démarrage

```bash
npm install
npm run db:push     # crée la base SQLite (prisma/dev.db)
npm run db:seed     # remplit avec des données de démo (10 pays, 12 offres)
npm run dev         # http://localhost:3000
```

## Comptes de démonstration (mot de passe : `password123`)

| Rôle       | E-mail                                |
| ---------- | ------------------------------------- |
| Candidat   | `candidat@horizon.africa`             |
| Recruteur  | `recruteur1@horizon.africa` (1 → 10)  |

## Fonctionnalités

- 🏠 **Accueil** : hero, recherche, catégories, offres à la une
- 🔎 **Offres** : liste + filtres (mot-clé, catégorie, type de contrat, ville) + détail
- 👤 **Candidat** : inscription/connexion, candidature en 1 clic (+ lettre de motivation), suivi des candidatures et statuts
- 🏢 **Recruteur** : publication d'offres, tableau de bord, consultation des candidatures reçues, gestion des statuts (En attente / Vu / Accepté / Refusé)
- 🌍 **Bilingue FR/EN** avec sélecteur de langue (cookie)

## Structure

```
prisma/
  schema.prisma      # User, Category, Job, Application
  seed.ts            # données de démo (villes & entreprises africaines)
src/
  app/
    api/             # routes REST (auth, jobs, applications, categories)
    jobs/            # liste + détail des offres
    candidate/       # tableau de bord candidat
    recruiter/       # tableau de bord + publication + candidatures
    login/ register/ # authentification
  components/        # Header, JobCard, dashboards, formulaires...
  lib/               # prisma, auth (JWT), i18n (FR/EN), validation (zod)
```

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` / `npm start` — production
- `npm run db:push` — synchronise le schéma avec la base
- `npm run db:seed` — (ré)injecte les données de démo
- `npm run db:reset` — réinitialise complètement la base

## Passage en production

SQLite convient pour le développement. Pour la production, basculez le
`datasource` de `prisma/schema.prisma` vers **PostgreSQL** et changez la variable
`DATABASE_URL` (+ `JWT_SECRET`) dans `.env`.
