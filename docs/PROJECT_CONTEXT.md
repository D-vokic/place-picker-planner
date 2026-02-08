# Place Picker Planner – Project Context

This document describes the **current state of the Place Picker Planner application after v2.0**, while keeping continuity with the original v1.0 intentions.  
It is intended to help a developer (human or AI) quickly understand **what has been built, how it evolved, and where the project currently stands**.

The project is a full-stack React application with a Node.js + Express backend.  
It was intentionally developed as a **real-world, production-oriented application**, not a course demo.

Between v1.0 and v2.0, the focus shifted from a feature-complete baseline to **correctness, determinism, persistence, testing, and deployment readiness**.

---

## General Concept

The application allows a user to browse a list of available places, select places they want to save, and manage those saved places.

Management includes:

- marking places as visited or planned
- adding notes and planned visit dates
- favoriting places
- filtering and searching
- deleting places with confirmation

All user-related data is persisted on the backend.

There is still **no real authentication system**.  
Instead, a simple email-based edit mode is used to enable or disable editing functionality.

This remains a deliberate design choice to avoid premature complexity.

---

## Backend Overview

The backend is a lightweight Express server.

**Important change since v1.0:**

- JSON-based storage has been replaced with **SQLite persistence**

Current backend characteristics:

- SQLite database (`backend/data/app.db`)
- Deterministic, duplicate-safe data handling
- No UI logic
- No real user identity system beyond edit-mode user ID
- Relative, portable filesystem paths (deployment-safe)

### Main datasets

- places (stored as JSON payloads in SQLite)
- user_places (per-user, per-collection records)

### Exposed API

- GET /places
- GET /user-places
- POST /user-places
- DELETE /user-places/:id
- PATCH endpoints for:
  - status toggle
  - favorite toggle
  - metadata (notes, planned date)

Backend behavior is verified through **integration tests** and **E2E tests**.

The backend is **production-ready** and designed to be managed via **PM2**.

---

## Frontend Overview

The frontend is built with React and Vite.

### State management

- `useReducer` for user places and related UI state
- business logic isolated from presentational components
- deterministic rendering (no duplicate keys or inconsistent state)

### Main views

- **Available Places**
  - browsing
  - category filtering
  - text search
- **My Places**
  - full place management

### Implemented features (verified in v2.0)

- optimistic updates for add / remove / toggle actions
- favorites toggle
- status toggle (Want to Visit / Visited)
- notes editor modal with backend persistence
- category filtering combined with text search
- delete confirmation modal
- loading states and fallback UI
- global error handling via ErrorPage
- deterministic UI behavior across reloads

All frontend behavior is covered by **unit, integration, and E2E tests**.

---

## Data Model

A place is treated consistently across frontend and backend.

### Core fields

- id
- title
- image (src, alt)
- city (optional)
- category
- status
- isFavorite
- meta (notes, plannedDate)
- lat / lon (optional)

Categories are defined in backend data and automatically populate frontend filters.  
No hardcoded category list exists in the frontend.

---

## Styling

CSS architecture was refactored and stabilized:

- animations
- modal
- forms
- components
- layout
- responsive rules

`index.css` acts only as an entry point.

Styling is considered **stable and verified**.

---

## Environment Configuration

The project uses Vite environment variables.

### Environment files

- `.env.development`
- `.env.production`

### Frontend

- API base URL controlled via env variables
- Debug / reset behavior disabled in production

### Backend

- Uses SQLite
- No external services required
- Production run via `npm run start`
- PM2-compatible

Local production mode has been fully validated.

---

## Testing Status

v2.0 introduced full automated testing:

- Unit tests (Vitest)
- Integration tests (Vitest)
- End-to-end tests (Playwright)

Test runners are fully isolated.  
All tests are passing.

Testing is now a **first-class part of the project**.

---

## Deployment Status

Current deployment state:

- Frontend production build verified (`npm run build`, `npm run preview`)
- Backend production run verified locally
- PM2 workflow defined and documented
- GitHub release tagged (`v2.0.0`)
- Documentation finalized (README, CHANGELOG, Unified AI Context)

**Pending:**

- External hosting (VPS or Linux server)

Once a server is available, backend deployment is **mechanical and documented**.

---

## Project Philosophy (Updated)

### v1.0 priorities

- clean structure
- predictable behavior
- minimal but complete feature set

### v2.0 priorities

- correctness and determinism
- backend persistence
- test coverage
- deployment readiness
- documentation as a source of truth

The project deliberately avoided:

- premature authentication
- overengineering
- feature bloat

---

## How to Continue

Anyone continuing the project should:

- treat v2.0 as a **stable, production-ready baseline**
- avoid unnecessary refactors
- follow established patterns:
  - `useReducer`
  - optimistic updates
  - env-based configuration
  - deterministic rendering
- keep backend simple and portable
- extend functionality incrementally with clear commits

Future versions (v2.1 / v3.0) can safely build on this foundation without rewriting existing code.

---

**End of document.**
