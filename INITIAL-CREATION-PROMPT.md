# Project Specification: Jackson Trails Open Source HOA Portal

**Goal:** Build a transparent, cost-saving community website to replace an expensive paid service.
**Repo Visibility:** PUBLIC (Open Source).
**Infrastructure:** Self-hosted (Docker) behind Nginx Proxy Manager & Watchtower.
**Stack:** Next.js (App Router), PocketBase (Backend), GitHub Actions.
**Strict Constraints:**
1.  **No PII Storage:** We are volunteers; we do not want liability for user data.
2.  **No Auth:** The site is public-facing only. Admin access is for the Board only via the PocketBase UI.
3.  **Stateless Messaging:** Contact forms must be pass-through only.

---

## 1. Repository Configuration
* **Structure:** Monorepo or standard Docker structure.
* **Configuration:** All ports, secrets, hostnames, and SMTP credentials must be loaded from a `.env` file. **Do not hardcode values.**
* **Safety:** `.gitignore` must strictly exclude:
    * `pb_data/`
    * `*_data/`
    * `*.db`
    * `.env`
    * `node_modules`

## 2. Docker Architecture (Prod & Dev)
Generate a `docker-compose.yml` that defines two environments (Prod and Dev).

**Global Constraints:**
* **Watchtower:** Do NOT add a watchtower service (it exists on the host). Add the label `com.centurylinklabs.watchtower.enable=true` to all services.
* **Ports:** Map ports using variables (e.g., `${PROD_APP_PORT}:3000`).

### Service Set A: Production
1.  **`hoa-backend`** (PocketBase):
    * Image: `ghcr.io/[USERNAME]/jackson-trails-backend:latest`
    * Volumes: `./pb_data:/pb/pb_data` (Persistent Data)
    * Restart: `unless-stopped`
2.  **`hoa-frontend`** (Next.js):
    * Image: `ghcr.io/[USERNAME]/jackson-trails-frontend:latest`
    * Env: `POCKETBASE_URL=http://hoa-backend:8090` (Internal Docker Network)

### Service Set B: Development (The "Auto-Clone" Environment)
*Goal: A dev environment that hydrates itself with real Production data on every boot, without risking corruption of Prod.*

1.  **`hoa-backend-dev`**:
    * **Volumes:**
        * `./pb_data:/mnt/prod_data:ro` (**Crucial:** Mount Prod data as Read-Only)
        * `./pb_data_dev:/pb/pb_data` (Read/Write volume for Dev)
    * **Entrypoint/Command:** Write a script/command that:
        1.  Wipes the existing `/pb/pb_data` in the dev container.
        2.  Copies the fresh snapshot from `/mnt/prod_data` to `/pb/pb_data`.
        3.  Starts PocketBase.
2.  **`hoa-frontend-dev`**:
    * Connects to `hoa-backend-dev`.
    * Runs in development mode (hot reload) if possible, or a separate dev image.

## 3. GitHub Actions (CI/CD)
Create `.github/workflows/deploy.yml`:
* **Trigger:** Push to `main`.
* **Action:** Build Docker images for Frontend and Backend -> Push to GHCR (GitHub Container Registry).
* **Tags:** `:latest` and `:${{ github.sha }}`.
* **Permissions:** Ensure `GITHUB_TOKEN` has package write permissions.

## 4. Application Features

### Backend (PocketBase)
* **Collections:**
    * `announcements` (Public Read): `title`, `slug`, `content` (Rich Text), `published_at` (Date).
    * `documents` (Public Read): `title`, `file` (PDF), `category` (Select), `year` (Number).
* **Initialization:** Ensure schema migration logic is included so a fresh deploy sets these up automatically.

### Frontend (Next.js)
* **Design:** Clean, "municipal/state park" aesthetic. Tailwind CSS.
* **RSS Feed:** A `/feed.xml` route handler that generates an XML feed from `announcements`.
* **Documents Page:** Searchable, filterable table (Client-side search is fine for MVP).
* **Contact Form (Privacy Focused):**
    * Use **Next.js Server Actions** + `nodemailer`.
    * **Workflow:**
        1.  User submits form (Name, Email, Message).
        2.  Server connects to SMTP Relay (creds in `.env`).
        3.  Server sends email **TO** the Board **FROM** the Relay (Reply-To: User).
        4.  **Server explicitly discards the data.** Do NOT save to PocketBase.

## 5. Deployment Notes
* I will handle Nginx Proxy Manager manually.
* The system must simply expose the ports defined in `.env` so I can map them in NPM.