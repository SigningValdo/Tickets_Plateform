# Todo List - Building the Backend with Prisma & NextAuth

This file tracks the development of the backend features for the E-Tickets platform.

## Phase 1: Project Setup & Authentication

- [x] **Task 1: Install Dependencies**
  - [ ] Install `react-query` for data fetching: `pnpm add @tanstack/react-query`
  - [ ] Install Prisma dependencies: `pnpm add prisma --save-dev` and `pnpm add @prisma/client`
  - [ ] Install NextAuth and its Prisma adapter: `pnpm add next-auth @next-auth/prisma-adapter`

- [x] **Task 2: Initialize Prisma with SQLite**
  - [ ] Run `pnpm prisma init` to create the Prisma setup.
  - [ ] In `prisma/schema.prisma`, set the `provider` to `"sqlite"`.
  - [ ] In `.env`, set the `DATABASE_URL` to `"file:./dev.db"`.

- [x] **Task 3: Define Prisma Schema**
  - [ ] Define `User`, `Account`, `Session`, `VerificationToken` models for NextAuth.
  - [ ] Add an `isAdmin` boolean field to the `User` model.
  - [ ] Define `Event`, `TicketType`, `Order`, and `Ticket` models.
  - [ ] Establish relationships between models (e.g., User-Event, Event-TicketType, Order-Ticket).

- [x] **Task 4: Create Initial Migration**
  - [ ] Run `pnpm prisma migrate dev --name init` to create the database and tables.
  - [ ] Verify that `prisma/dev.db` and a new migration file are created.

- [x] **Task 5: Configure NextAuth**
  - [ ] Create API route file: `app/api/auth/[...nextauth]/route.ts`.
  - [ ] Configure `authOptions` with the Prisma adapter and a `CredentialsProvider` for email/password login.
  - [ ] Implement the `authorize` function to validate user credentials against the database.
  - [ ] Add callbacks to include `id` and `isAdmin` in the session token.

- [x] **Task 6: Integrate Auth Provider**
  - [ ] Create a new component `components/auth-provider.tsx`.
  - [ ] In this component, wrap `children` with the `<SessionProvider>` from `next-auth/react`.
  - [ ] Update `app/layout.tsx` to use `AuthProvider` to wrap the main content.

- [x] **Task 7: Protect Admin Routes**
  - [ ] Create a `middleware.ts` file in the root of the project.
  - [ ] Configure the middleware to protect all routes under `/admin`.
  - [ ] The middleware should redirect unauthenticated users to a login page.
  - [ ] It should also redirect authenticated non-admin users to the homepage.

## Phase 2: Backend API for Event Management

- [x] **Task 8: Create API for Listing/Creating Events**
  - [ ] Create API route file: `app/api/admin/events/route.ts`.
  - [ ] Implement the `GET` handler to fetch all events from the database using Prisma.
  - [ ] Implement the `POST` handler to create a new event and its associated `TicketTypes` in a transaction.

- [x] **Task 9: Create API for Single Event (CRUD)**
  - [ ] Create API route file: `app/api/admin/events/[id]/route.ts`.
  - [ ] Implement the `GET` handler to fetch a single event by its ID.
  - [ ] Implement the `PUT` handler to update an event's details.
  - [ ] Implement the `DELETE` handler to delete an event.

- [ ] **Task 10: Connect Admin UI to Backend**
  - [ ] Create a `components/query-provider.tsx` to set up the `QueryClientProvider`.
  - [ ] Update `app/layout.tsx` to use the `QueryProvider`.
  - [ ] Refactor `app/admin/events/page.tsx` to use `useQuery` to fetch events.
  - [ ] Refactor `components/admin-event-list.tsx` to consume the data from the `useQuery` hook.
  - [ ] Refactor `app/admin/events/create/page.tsx` to use `useMutation` to submit the new event form.
  - [ ] Implement the Edit Event page and connect it to the `PUT` API endpoint.

## Phase 3: User-Facing Features (To Be Detailed Later)

- [ ] Public Event Listing & Details
- [ ] User Registration
- [ ] Checkout & Ticket Purchasing
- [ ] User Account & My Tickets Page

## Phase 4: Other Admin Features (To Be Detailed Later)

- [ ] User Management
- [ ] Ticket Management
- [ ] Reporting Dashboard
- [ ] Application Settings
