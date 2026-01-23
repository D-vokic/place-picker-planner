# Place Picker Planner

Place Picker Planner is a full-stack React application for selecting, saving, and organizing places that matter to you.
The project is designed as a real-world, production-oriented application and is developed incrementally through clearly defined commits and versioned phases.

## Current Version: v1.1 – Stabilization Phase

## Demo

Live demo: https://place-picker-planner.netlify.app/

![Place Picker Planner screenshot](screenshot.png)

---

## Project Status & Versioning

### v1.0 – Baseline (Completed)

v1.0 established a complete, functional application with:

- Full CRUD flow for places
- Optimistic UI updates
- Backend persistence using JSON files
- Clear separation of concerns
- Production-oriented architecture

No new features are added on top of v1.0 without versioning.

### v1.1 – Stabilization Phase (Current)

v1.1 focuses on **internal safety, predictability, and UX polish**.

Scope of v1.1:

- No new product features
- No API changes
- No architectural rewrites

Improvements include:

- Safer optimistic update rollback
- Improved backend sync reliability
- Clearer empty and loading states
- Accessibility improvements (ARIA roles, keyboard semantics)
- Better modal and dialog behavior
- Improved internal clarity and documentation

From a user perspective, the application behaves the same as v1.0, but is more robust and polished.

---

## Local Development Setup

To run the application locally, follow the steps below.

### 1. Install frontend dependencies

From the project root directory, install the required dependencies:

```bash
npm install
```

### 2. Start the frontend development server

After the installation is complete, start the Vite development server:

```bash
npm run dev
```

### 3. Install backend dependencies

Open a new terminal window, navigate to the backend folder, and install backend dependencies:

```bash
cd backend
npm install
```

### 4. Start the backend server

From the backend folder, start the Node.js server:

```bash
node app.js
```

The frontend and backend servers must be running simultaneously for the application to work correctly.

---

## Environment Configuration (Development / Production)

The application uses **Vite environment variables** to separate development and production behavior without changing the codebase.

### Environment Files

The following files are defined in the project root:

- `.env.development`
- `.env.production`

### Supported Variables

| Variable                    | Description                                    |
| --------------------------- | ---------------------------------------------- |
| `VITE_API_BASE_URL`         | Backend API base URL                           |
| `VITE_RESET_STATUS_ON_LOAD` | Controls whether place status is reset on load |
| `VITE_DEBUG`                | Enables or disables development-only debugging |

---

### Behavior Differences

**Development**

- Uses local backend
- Resets place status on reload (optional)
- Enables debug behavior

##Production##

- Uses production backend
- Preserves backend state
- No development-only logic

## Implemented Features (v1.0)

At this stage, the project includes:

- Available Places and My Places views
- Adding places with optimistic UI updates
- Removing places with confirmation modal
- Favorites (star toggle)
- Place status tracking (want to visit / visited)
- Notes and planned visit date
- Category filtering and text search
- Optional map preview
- Responsive layout
- Global error handling
- Loading states and fallback UI
- Email-based edit mode

## UX & Accessibility (v1.1)

- Improved empty and loading states
- Proper dialog and modal semantics
- Accessible buttons and toggles
- Keyboard- and screen-reader-friendly interactions
- Disabled state consistency

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript (ES6+)
- CSS (modular)

### Backend

- Node.js
- Express
- JSON-based data storage (temporary)

---

## Development Principles

- One logical change per commit
- Strict version boundaries (v1.x vs v2.0)
- Refactoring without behavioral changes
- No speculative or demo-only code
- Production-readiness over tutorials

---

## Roadmap

### v1.1 (Current)

- Stabilization
- UX & accessibility polish
- Documentation clarity

### v2.0 (Planned)

- Real authentication
- Per-user data separation
- Database-backed persistence
- Feature expansion
- Testing infrastructure

---

## Project Structure

## Project Structure

```text
PlacePicker/
├── backend/
│   ├── data/              # JSON persistence (temporary storage)
│   ├── images/            # Place images served by backend
│   ├── app.js             # Express app entry point
│   └── package.json
├── public/
├── src/
│   ├── assets/            # Static frontend assets (logos, icons)
│   ├── components/        # Reusable UI components (lists, items, modals)
│   ├── styles/            # Modular CSS (layout, components, modals, etc.)
│   ├── views/             # Page-level views (MyPlaces, AvailablePlaces)
│   ├── utils/             # API and helper utilities
│   ├── App.jsx            # Root application component
│   ├── main.jsx           # React entry point
│   └── index.css          # CSS entry point
├── index.html
├── vite.config.js
└── package.json
```

This structure enforces:

- Clear separation between frontend and backend
- Isolation of business logic, UI components, and views
- Scalable organization for future v2.0 expansion

---

### Development Approach

- Each meaningful change is represented by a single, clear commit
- Features are added incrementally based on a predefined roadmap
- Refactoring is treated as a first-class task
- UI, state logic, and business logic are kept clearly separated

---

### Status

This project is under active development.

---

## Contributing / Support

- Contributions are welcome. Feel free to open an issue or submit a pull request.
- For problems or suggestions, please use GitHub issues.

---

## Author

This project is maintained by Dusko Vokic.
You can reach out via:

- GitHub: https://github.com/D-vokic
- Website: https://duskovokic.com

---

## License

This project is licensed under the MIT License.

---
