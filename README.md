# Hostelia Hostel Management System

Full-stack hostel administration platform composed of a NestJS REST API and a React (Vite) dashboard. The backend centralizes hostel, room, student, fee, and reporting logic, while the frontend provides staff-friendly workflows for day-to-day operations.

## Repository layout
- `hostelia-backend` – NestJS + TypeORM + MySQL service that exposes authentication, student/room management, fee tracking, reports, and email reminders.
- `hostelia-frontend` – React 18 + Vite + Tailwind admin UI that consumes the API through `src/api/client.ts`.

## Prerequisites
- Node.js 20+ and npm 10+ (required by Vite 5 and Nest CLI)
- MySQL 8 (or compatible) reachable from the backend
- SMTP credentials if you plan to enable scheduled email reminders

## Initial setup
```bash
git clone <repo-url>
cd hostelia-backend
npm install
cd ../hostelia-frontend
npm install
```

## Environment variables

### Backend (`hostelia-backend/.env`)
```
PORT=4000
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=secret
DB_NAME=hostelia
JWT_SECRET=change-me
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=apikey-secret
SMTP_FROM=no-reply@hostelia.com
```
All variables have safe defaults in code, but providing your own values is recommended for non-local environments.

### Frontend (`hostelia-frontend/.env`)
```
VITE_API_URL=http://localhost:4000
```
The value must point to the backend URL exposed above.

## Running the backend (NestJS)
```bash
cd hostelia-backend
npm run start:dev
```
The API listens on `PORT` (default `4000`) and enables CORS for the `FRONTEND_URL` list.

## Running the frontend (Vite)
```bash
cd hostelia-frontend
npm run dev
```
Vite serves the dashboard at `http://localhost:5173` by default and proxies requests to `VITE_API_URL`.

## Useful scripts
- `hostelia-backend`: `npm run lint`, `npm run build`, `npm run start:prod`
- `hostelia-frontend`: `npm run build`, `npm run preview`

Run backend and frontend in parallel (two terminals or a process manager) during development. Update this README whenever setup steps change to keep onboarding simple.
