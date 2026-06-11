# Backend Service

This backend service is an Express application that connects to MySQL.

## Setup

1. Copy `backend/.env.example` to `backend/.env`.
2. Set your MySQL connection values.
3. Install dependencies:

```bash
cd backend
npm install
```

4. Start the backend:

```bash
npm run dev
```

## API Endpoints

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PUT /auth/profile`
- `GET /users` (admin), `GET /users/:id`, `PUT /users/:id/role`, `DELETE /users/:id`
- `GET /tutors` (with filters), `GET /tutors/:id`, `PUT /tutors/profile`
- `GET/POST/PUT/DELETE /posts`, `/applications`, `/reviews`, `/comments`
- `GET/POST/DELETE /saved-students`, `/saved-tutors`
- `GET/POST /messages` (authenticated)
- `GET/POST/PUT /reports` (admin for list/update)
