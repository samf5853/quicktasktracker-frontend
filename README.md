# QuickTaskTracker — Frontend

A task management web app built with Angular, backed by a Spring Boot REST API. This is the active frontend for QuickTaskTracker, replacing an earlier vanilla HTML/JS prototype.

## Features

- **Authentication** — signup, login, and JWT-based session handling
- **Protected routes** — route guards prevent unauthenticated access to the dashboard and redirect logged-in users away from auth pages
- **Task management** — create and delete tasks, synced with the backend in real time
- **Server-side rendering (SSR)** — built with Angular's SSR support for faster initial loads and better SEO
- **Responsive UI** — styled with Tailwind CSS

## Tech Stack

- [Angular](https://angular.dev/) 22
- Tailwind CSS
- Angular SSR (`@angular/ssr`) with an Express server
- RxJS / Angular `HttpClient` for API communication

## Backend

This frontend expects the QuickTaskTracker API to be running and reachable. The backend is a separate Spring Boot project handling authentication (JWT), user management, and task CRUD:

**Backend repo:** [https://github.com/samf5853/Task-Manager-API](https://github.com/samf5853/Task-Manager-API)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- Angular CLI (`npm install -g @angular/cli`)
- The backend API running locally or deployed (see above)

### Installation

```bash
git clone https://github.com/samf5853/quicktasktracker-frontend.git
cd quicktasktracker-frontend
npm install
```

### Running Locally

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will reload automatically when you change source files.

Make sure the backend API is running and that its URL is correctly set wherever this project reads its API base URL.

### Building

```bash
ng build
```

Build artifacts are output to `dist/quicktasktracker-frontend/`.

### Running the SSR Server

```bash
npm run serve:ssr:quicktasktracker-frontend
```

(Adjust the script name to match what's defined in `package.json` if it differs.)

## Project Structure

```
src/
├── app/
│   ├── login/          # Login component
│   ├── signup/          # Signup component
│   ├── dashboard/       # Main task dashboard
│   ├── guards/          # Route guards (auth, guest, root redirect)
│   └── app.routes.ts    # Route definitions
├── main.ts              # Client bootstrap
├── main.server.ts        # Server bootstrap (SSR)
└── server.ts             # Express server for SSR
```

## Deployment

This project is configured for deployment on Netlify. See `netlify.toml` for build and publish settings.

## Roadmap

Planned additions as the project grows:

- Task editing and completion toggling
- Collaborators and shared task visibility
- Comments on tasks
- Public/private task settings

## Status

Actively in development as a personal portfolio project to demonstrate full-stack development skills.
