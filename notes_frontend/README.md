# Notes Frontend (Vue 3 + Vite)

A modern, responsive notes application with:
- User authentication (login/register)
- Create, edit, delete notes
- List and search notes
- Sidebar for navigation, main editor area
- Light theme with brand colors (primary: #3b82f6, secondary: #6b7280, accent: #22d3ee)

## Environment Variables
Create a `.env` file at the project root with:
```
VITE_API_BASE_URL=https://your-backend-host/api
VITE_APP_NAME=Notes
```
- Do not commit real secrets. The frontend reads these via `import.meta.env`.

## API Contract (expected)
- POST /auth/login { email, password } -> { token, user }
- POST /auth/register { name, email, password } -> { token, user }
- GET /auth/me -> user
- GET /notes?q=... -> Note[]
- GET /notes/:id -> Note
- POST /notes { title, content } -> Note
- PUT /notes/:id { title, content } -> Note
- DELETE /notes/:id -> 204

All protected routes require `Authorization: Bearer <token>`.

## Getting Started
```sh
npm install
npm run dev
```

Build for production:
```sh
npm run build
```

Lint:
```sh
npm run lint
```

## Project Structure
- src/services/api.ts: API client using VITE_API_BASE_URL and token.
- src/stores/auth.ts: Pinia store for auth.
- src/stores/notes.ts: Pinia store for notes data.
- src/views: Login, Notes list, Editor, NotFound.
- src/components/layout: Topbar and Sidebar.
- src/components/notes: NoteEditor.

## Styling
- Centralized light theme tokens in `src/assets/base.css`.
- Utility classes for buttons, inputs, cards.

## Notes
- The app guards routes: unauthenticated users are redirected to /login.
- On login, token is persisted in localStorage.
