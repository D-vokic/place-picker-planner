# CHANGELOG

All notable changes to this project are documented in this file.

The project follows an **incremental, feature-driven development approach**, where each logical improvement is introduced through clear and focused commits.

---

## [Unreleased]

Ongoing work toward v1.0.

---

## [0.4.0] – Styling architecture & maintainability

### Added

- Modular CSS architecture
- Dedicated style files for:
  - animations
  - modal
  - forms
  - components
  - layout
  - responsive rules

### Changed

- `index.css` reduced to a clean entry point
- Styles grouped by responsibility instead of file size

### Improved

- Long-term maintainability of styles
- Safer refactoring without visual regressions
- Clear separation between layout, components, and behavior

---

## [0.3.0] – Environment configuration (dev / prod)

### Added

- Environment-based configuration using Vite
- `.env.development` and `.env.production` support
- Configurable API base URL via environment variables

### Changed

- Application behavior now adapts based on environment
- Development-only logic isolated from production

### Improved

- Predictable production behavior
- Cleaner development workflow without code changes
- Infrastructure readiness for deployment

---

## [0.2.0] – Place management, state & persistence

### Added

- My Places view (saved / selected places)
- Place status tracking: **Want to visit / Visited**
- Favorites (star toggle)
- Notes and planned visit date per place
- Category filtering
- Text search by place title
- Optional map preview for places
- Simple email-based edit mode
- Delete confirmation modal

### Changed

- State management refactored to `useReducer`
- Business logic isolated from UI components
- Backend persistence replaces localStorage

### Improved

- Optimistic UI updates (add / remove / toggle)
- Loading states and fallback UI
- Global error handling with ErrorPage
- Responsive layout (mobile → desktop)
- UX polish (disabled states, empty states)
- Basic accessibility (keyboard navigation, ARIA attributes)

---

## [0.1.0] – Initial baseline & cleanup

### Added

- React frontend built with Vite
- Node.js + Express backend
- JSON-based data storage
- Custom SVG logo
- Initial project and folder structure

### Changed

- Removed course-specific and demo-only code
- Defined stable place data model:
  - id
  - title
  - image
  - city
  - category
  - status

### Improved

- Consolidated backend API:
  - GET places
  - GET user-places
  - POST user-place
  - DELETE user-place
- Centralized fetch utility with error handling

---

## Notes

- Each version represents a **clear development milestone**
- Refactoring and cleanup are treated as first-class changes
- The project is evolving toward a stable, production-ready v1.0

---
