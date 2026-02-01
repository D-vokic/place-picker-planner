# Place Picker Planner

Place Picker Planner is a full-stack React application for selecting, saving, and organizing places that matter to you.

The project is built as a **production-oriented, incrementally developed application** with a strict focus on stability, clarity, and long-term maintainability.

## Current Version: v2.0 – Feature Expansion on Stable Baseline

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

No new features were added without versioning.

### v1.1 – Stabilization Phase (Completed)

v1.1 focused on **internal safety, predictability, and UX polish**, without changing user-facing behavior.

Key Improvements:

- Safer optimistic update rollback
- Backend sync reliability
- Clearer empty and loading states
- Accessibility improvements (ARIA roles, keyboard semantics)
- Better modal and dialog behavior
- Improved internal clarity and documentation

---

### v2.0 – Feature Expansion (Current)

v2.0 builds **on top of the stable v1.x baseline**.

Core guarantees:

- Backend API is stable and reliable
- Persistence layer is complete
- No regressions in core flow

v2.0 introduces **controlled feature expansion**, UI enhancements, and improved data handling.

---

## Current Feature Set (v2.0)

### Core Flow

- Available Places → My Places → Backend persistence
- Optimistic UI updates
- Duplicate-safe backend behavior
- No API contract assumptions (plain arrays only)

### My Places Features

- Favorites toggle (synced with backend)
- Status toggle (want to visit / visited)
- Notes editor (modal)
- Planned visit date
- Delete with confirmation dialog
- Email-based edit mode

### Search, Filtering & Sorting

- Text search
- Category filtering
- Title sorting (A–Z / Z–A)
- Multiple filters combined
- Single transformation pipeline (filter → sort)
- No mutation of original state
- Reset filters / sorting

### UX & Reliability

- Stable empty and “no results” states
- Optimistic UI with safe rollback
- Predictable modal behavior
- Accessible controls and toggles
- Responsive layout

---

## Backend Status (Stable)

Backend runs via:

````bash
node app.js

---

## Endpoints

- GET /places
- GET /user-places
- POST /user-places
- DELETE /user-places/:id
- PATCH /user-places/:id
- PATCH /user-places/:id/favorite
- PATCH /user-places/:id/status

## Storage

- places.json – plain array
- user-places.json – plain array
- SQLite database introduced for persistence layer upgrade

## Guarantees

- No wrapped data structures
- No backend crashes
- Duplicate adds handled as no-op 200 OK
- Static image serving via /images

---

## Local Development Setup

To run the application locally, follow the steps below.

### 1. Install frontend dependencies

From the project root directory, install the required dependencies:

```bash
npm install
````

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

---

## Tech Stack

### Frontend

- **React**
- **Vite**
- **JavaScript (ES6+)**
- **CSS (modular)**

### Backend

- **Node.**
- **Express**
- **SQLite (current persistence layer)**
- **JSON (legacy / transitional)**

---

## Project Structure

```PlacePicker/
├── backend/
│   ├── data/              # Persistence (SQLite + JSON)
│   ├── images/            # Place images
│   ├── app.js             # Backend entry point
│   └── package.json
├── public/
├── src/
│   ├── assets/            # Static assets
│   ├── components/        # UI components
│   ├── styles/            # Modular CSS
│   ├── views/             # Page-level views
│   ├── utils/             # API and helpers
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

---

### Development Principles

- One logical change per commit
- Strict version boundaries
- Stable baseline first, features second
- No speculative or demo-only code
- Production-readiness over tutorials

---

### Roadmap

### v2.0 (Current)

- Advanced filtering UX
- Visual indicators for active filters
- Optional persistence of UI preferences
- Activity history tracking
- UX refinement

### v3.0 (Planned)

- Authentication
- True per-user data separation
- Expanded testing infrastructure
- Deployment hardening

---

## Contributing / Support

- Contributions are welcome. Feel free to open an issue or submit a pull request.
- For problems or suggestions, please use GitHub issues.

---

### Status

Stable baseline maintained.
Feature work is ongoing and safe.

---

## Contributing / Support

- Contributions are welcome. Feel free to open an issue or submit a pull request.
- For problems or suggestions, please use GitHub issues.

---

## Author

This project is maintained by \*\*Dusko Vokic\*\*
You can reach out via:

- GitHub: https://github.com/D-vokic
- Website: https://duskovokic.com

---

## License

## This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
