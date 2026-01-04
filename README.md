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

## Project Goals

- Build a complete, real-world React application
- Avoid course-specific or demo-only patterns
- Focus on clean architecture, maintainability, and UX
- Incrementally evolve features with meaningful commits
- Deliver a fully functional v1.0 product

---

## Current State (Baseline Phase)

At this stage, the project includes:

- React frontend built with Vite
- Node.js + Express backend
- Initial UI layout and branding
- Custom SVG logo
- Basic project and folder structure
- Static data sources (JSON)
- No authentication or advanced state management yet

This phase intentionally focuses on cleanup and foundation, not features.

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

- Clean up course-specific code
- Define a stable data model for places
- Implement backend API endpoints
- Add user-specific place management
- Introduce filtering, search, and status tracking
- Improve UX, accessibility, and responsiveness
- Finalize v1.0 release

---

### Status

This project is under active development.
Current phase: Initial cleanup and project baseline setup

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
