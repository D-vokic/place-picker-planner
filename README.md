# Place Picker Planner

Place Picker Planner is a full-stack React application for selecting, saving, and organizing places that matter to you.
The project is designed as a real-world, production-oriented application and is developed incrementally through clearly defined commits.

This repository represents the initial baseline phase, focused on cleanup, structure, and branding.

---

## Demo

Live demo: https://place-picker-planner.netlify.app/

![Place Picker Planner screenshot](screenshot.png)

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

**Development (`.env.development`)**

- Uses local backend (`localhost`)
- Resets place status to **“Want to visit”** on each session
- Enables development-only debugging

**Production (`.env.production`)**

- Uses production backend
- Preserves backend state for place status, notes, and planned dates
- No development-only logic is applied

This setup ensures a clean development experience while keeping production behavior stable and predictable for end users.

## Implemented Features

At this stage, the project includes:

- Cleaned and refactored UI (course-specific code removed)
- Defined place data model (id, title, image, city, category, status)
- Centralized backend API (places / user-places)
- Centralized fetch utility with error handling
- Available Places and My Places views
- Adding places with optimistic UI updates
- Removing places with confirmation modal
- Persistent user-places stored on backend
- Favorites (star toggle)
- Place status tracking (want to visit / visited)
- Notes and planned visit date per place
- Category filtering and text search
- Optional map preview for places
- Responsive layout (mobile to desktop)
- Loading states and fallback UI
- Basic accessibility support
- Simple email-based edit mode
- Route structure with error handling

## Styling & Maintainability

- CSS refactored into smaller, responsibility-based files
- index.css acts as a clean entry point
- Styles separated into animations, modal, forms, components, layout, and responsive rules
- No visual regressions introduced during refactoring

## Project Goals

- Build a complete, real-world React application
- Avoid specific or demo-only patterns
- Focus on clean architecture, maintainability, and UX
- Incrementally evolve features with meaningful commits
- Deliver a fully functional v1.0 product

---

## Current State (Baseline Phase)

At this stage, the project includes:

- React frontend built with Vite
- Node.js + Express backend
- Modularized CSS architecture
- JSON-based backend persistence
- Environment-based configuration (dev / prod)

---

## Demo

The project is designed to run locally.  
A live demo will be added after deployment (Netlify).

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript (ES6+)
- CSS

### Backend

- Node.js
- Express
- JSON-based data storage (temporary)

---

## Project Structure

```text
PlacePicker/
├── backend/
│   ├── data/
│   ├── images/
│   ├── app.js
│   └── package.json
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── styles/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json

```

### Development Approach

- Each meaningful change is represented by a single, clear commit
- Features are added incrementally based on a predefined roadmap
- Refactoring is treated as a first-class task
- UI, state logic, and business logic are kept clearly separated

### Roadmap (High-Level)

- Improve accessibility
- Introduce multi-user backend support
- Add theming support
- Prepare production deployment
- Finalize v1.0 release

---

### Status

This project is under active development.

---

## Contributing / Support

- Contributions are welcome. Feel free to open an issue or submit a pull request.
- For problems or suggestions, please use GitHub issues.

---

## Author

This project is maintained by Duško Vokić.
You can reach out via:

- GitHub: https://github.com/D-vokic
- Website: https://duskovokic.com

---

## License

This project is licensed under the MIT License.

---
