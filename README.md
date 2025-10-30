# Bank Management — Deploy Guide

This repository contains a simple bank management app with a Node/Express backend and a Vite + React frontend.

This short guide shows an easy, fast deployment path using Vercel (frontend) and Render (backend + managed MySQL). No Docker required.

---

## Contents
- `backend/` — Express API
- `frontend/` — Vite React app

## Quick summary (recommended)
1. Deploy `frontend/` to Vercel (static build)
2. Deploy `backend/` to Render as a Web Service
3. Provision a managed MySQL in Render and set backend env vars
4. Run `npm run migrate` and `npm run seed` on the backend to create schema and seed data

## Environment variables
Set these for the backend service (on Render or your host):

- `PORT` (default 5000)
- `NODE_ENV=production`
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET` (strong random string)
- `BCRYPT_ROUNDS` (e.g. 10)
- `FRONTEND_URL` (your frontend URL, used for CORS)
- `SERVE_FRONTEND` (optional) — set to `true` if you want the backend to serve the built frontend from `frontend/dist`.

## Deploy frontend to Vercel
1. Go to https://vercel.com/import
2. Select your GitHub repository and pick the `frontend` folder as the project root.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Set environment variable (on Vercel) `VITE_API_BASE` to your backend URL (e.g. `https://your-backend-url.com/api`)
6. Deploy. Vercel will provide a HTTPS URL for the frontend.

## Deploy backend to Render
1. Go to https://dashboard.render.com and create a new Web Service.
2. Connect your GitHub repository and select the `backend` folder as the root.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Provision a Managed Database → MySQL on Render and note the connection details.
6. Set the Managed DB credentials and other env vars (see list above) in the Render service settings.
7. After deployment, open the Render shell (or use the web console) and run:
   ```bash
   npm run migrate
   npm run seed
   ```

Notes:
- You can also choose to serve the frontend from the backend. To do that, build the frontend (`npm run build` inside `frontend`) and copy the `dist/` into `backend/frontend/dist` in your CI, or set `SERVE_FRONTEND=true` and ensure the `dist` exists at `backend/../frontend/dist`.
- The backend already includes `express.static` support for serving `../frontend/dist` when `SERVE_FRONTEND=true` or `NODE_ENV=production`.

## One-click / Automation (optional)
- Render supports a `render.yaml` manifest for full infra as code and one-click deploys; see Render docs if you want to add it.
- Vercel supports importing a project from GitHub directly.

## Local dev & testing
- Backend: `cd backend && npm install && npm run dev`
- Frontend: `cd frontend && npm install && npm run dev`

## Migrations & Seeds
- Use `npm run migrate` and `npm run seed` in the `backend` folder to create schema and seed sample data.

## Next steps / improvements
- Add a migration tracker table (or use a migration tool like Knex/Umzug) for robust migration tracking.
- Add CI (GitHub Actions) to run lint/tests and deploy to Render/Vercel.

If you want, I can add a `render.yaml` manifest and a GitHub Actions workflow to automate the deploy.
