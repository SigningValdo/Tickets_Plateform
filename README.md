# EvenTicket
# Tickets_Plateform
# Tickets_Plateform

## Aperçu

Plateforme de billetterie d'événements (Next.js App Router) avec authentification (NextAuth Credentials), base de données Prisma/SQLite, administration (événements, catégories, tickets), et scanning de tickets.

## Stack Technique

- Next.js `15.2.4` (App Router) – `app/`
- React `^19`
- TypeScript `^5`
- Tailwind CSS `^3.4` + Radix UI + shadcn/ui
- Authentification: NextAuth (Credentials, JWT sessions)
- ORM: Prisma `^6.13.0` (SQLite)
- State/Data: TanStack Query `^5.83.0`
- Charts: Recharts, Date: date-fns/moment

## Prérequis

- Node.js 18+ (recommandé 20)
- pnpm, npm ou yarn

## Démarrage rapide

1) Installer les dépendances

```bash
npm install
# ou
pnpm install
```

2) Variables d’environnement – créer `.env` à la racine

```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="votre_secret_long_aleatoire"
NEXTAUTH_URL="http://localhost:3000"
```

3) Base de données

```bash
npx prisma migrate dev
npx prisma generate
npm run seed   # exécute prisma/seed.ts
```

4) Lancer le serveur de dev

```bash
npm run dev
```

## Scripts NPM clés (package.json)

- `dev`: démarre Next.js en mode développement
- `build`: construit l’application
- `start`: démarre en production
- `lint`: exécute Next lint
- `seed`: `ts-node prisma/seed.ts` (CommonJS)

## Modèles de données (Prisma)

Voir `prisma/schema.prisma`.

- `User` (roles: USER, ADMIN) + NextAuth tables (`Account`, `Session`, `VerificationToken`)
- `Event` (titre, description, date, localisation, statut, catégorie, ticketTypes)
- `EventCategory` (name unique, description?)
- `TicketType` (name, price, quantity, eventId)
- `Order` (totalAmount, status)
- `Ticket` (qrCode unique, status: VALID/USED/INVALID/CANCELLED)
- `Setting`, `Report` (configuration, rapports)

Base par défaut: SQLite (`DATABASE_URL` file:./dev.db). Peut être migrée vers Postgres/MySQL en changeant `datasource` Prisma.

## Authentification

Fournisseur Credentials dans `app/api/auth/[...nextauth]/route.ts`:

- Email + mot de passe (hash bcrypt)
- Sessions JWT avec `role` ajouté au token et à `session.user`
- Pages: `signIn: /auth/login`, `error: /auth/error`

Variables requises: `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (prod).

## Endpoints API (principaux)

Préfixe: tous sous `app/api/`.

- Catégories d’événements `app/api/admin/event-categories`
  - `GET /api/admin/event-categories` – liste toutes les catégories
  - `POST /api/admin/event-categories` – créer (ADMIN)
  - `GET /api/admin/event-categories/:id` – lire (ADMIN)
  - `PUT /api/admin/event-categories/:id` – mettre à jour (ADMIN)
  - `DELETE /api/admin/event-categories/:id` – supprimer (ADMIN)

- Événements `app/api/admin/events`
  - `GET /api/admin/events?search=&category=&dateFilter=&location=` – liste/filtre
  - `POST /api/admin/events` – créer (ADMIN) avec `ticketTypes[]`
  - `GET /api/admin/events/:id` – détail (ADMIN)
  - `PUT /api/admin/events/:id` – mise à jour (ADMIN)
  - `DELETE /api/admin/events/:id` – suppression (ADMIN)

- Tickets `app/api/admin/tickets`
  - `GET /api/admin/tickets?page=1&limit=20&status=&eventId=&ticketTypeId=&userId=&q=` – pagination + filtres (ADMIN)
  - `POST /api/admin/tickets` – créer (ADMIN)
  - `POST /api/admin/tickets/scan` – scanner un ticket via `{ qrCode }` (ADMIN) => passe à `USED`

- Auth (NextAuth)
  - Routes standards NextAuth exposées sous `/api/auth/*` (session, csrf, callback credentials, etc.)

Autres espaces présents: `settings/`, `users/`, `reports/`, `tickets/order/` (voir code pour détails si utilisés).

## Exemples de requêtes

Créer une catégorie (ADMIN):

```bash
curl -X POST http://localhost:3000/api/admin/event-categories \
  -H 'Content-Type: application/json' \
  -H 'Cookie: <vos_cookies_session_admin>' \
  -d '{"name":"Conférences","description":"Talks techniques"}'
```

Lister les événements filtrés:

```bash
curl 'http://localhost:3000/api/admin/events?search=meetup&category=Tech&location=Paris'
```

Scanner un ticket (ADMIN):

```bash
curl -X POST http://localhost:3000/api/admin/tickets/scan \
  -H 'Content-Type: application/json' \
  -H 'Cookie: <vos_cookies_session_admin>' \
  -d '{"qrCode":"<code>"}'
```

## Structure du projet (extrait)

```
app/
  admin/ ... (UI admin, CRUD)
  api/
    admin/
      event-categories/
      events/
      tickets/
    auth/[...nextauth]/
  auth/ (pages login, etc.)
components/ (UI)
lib/ (db, validations, utils)
prisma/ (schema, migrations, seed)
```

## Sécurité & Rôles

- La plupart des routes admin vérifient `session.user.role === 'ADMIN'`.
- Les pages et appels côté client doivent gérer les erreurs 403/401.

## Déploiement

- Renseigner `NEXTAUTH_URL` (URL publique) et `NEXTAUTH_SECRET`.
- Exécuter migrations Prisma sur l’environnement cible.
- Construire et démarrer:

```bash
npm run build && npm start
```

## Licence

Projet interne/démo. Adapter une licence au besoin.
