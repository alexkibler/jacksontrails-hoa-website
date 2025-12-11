# Jackson Trails HOA - Backend (PocketBase)

This directory contains the PocketBase backend configuration for the Jackson Trails HOA website.

## Structure

```
backend/
├── Dockerfile              # PocketBase container image
├── pb_migrations/          # Database schema migrations
│   ├── 1733842800_initial_schema.js
│   └── 1733842801_seed_data.js
├── scripts/                # Helper scripts
│   └── dev-entrypoint.sh  # Dev environment initialization
└── tests/                  # Integration tests
```

## Collections

### Announcements
- **Public Read Access**
- Fields: title, slug, content (rich text), published_date, featured
- Unique slug constraint

### Documents
- **Public Read Access**
- Fields: title, category, year, file (PDF), description
- Categories: Meeting Minutes, Bylaws, Financial Reports, Architectural Guidelines
- Max file size: 10MB

## Running Locally

### Production Mode
```bash
docker compose --profile prod up -d
```

### Development Mode (Auto-Clone from Prod)
```bash
docker compose --profile dev up -d
```

The dev environment automatically:
1. Mounts production data as read-only
2. Copies it to a separate dev volume
3. Starts PocketBase with the snapshot

## Admin Access

Access the PocketBase admin UI at:
- Production: `http://localhost:${PROD_BACKEND_PORT}/_/`
- Development: `http://localhost:${DEV_BACKEND_PORT}/_/`

Default admin setup is required on first run.

## Troubleshooting Log - 2025-12-10: Backend Migrations Refactor

**Problem:**
When using standard PocketBase JavaScript migrations (v0.22+), the migration engine failed with persistent `TypeError` exceptions (e.g., `Cannot read property 'save' of undefined` or `Object has no member 'dao'`). This occurred because the embedded Goja JavaScript runtime in the pre-built binary appeared incompatible with the `app` object wrapper expected by the migration scripts, or the environment (Docker/Alpine) caused unexpected runtime behavior.

**Root Cause Analysis:**
- **JS Runtime Instability:** The embedded JS runtime in recent PocketBase versions (0.22.x) was inconsistent in exposing the `app.dao()` and `db` interfaces within the Docker container context.
- **Docker Image confusion:** Persistent logs from old containers masked the fact that new code wasn't running, leading to confusion about whether fixes were applied.
- **Configuration Conflicts:** `docker-compose.yml` was pulling a pre-built image (`image: ghcr.io/...`) while we were trying to build a local custom one (`build: ./backend`), causing changes to be ignored.

**Resolution:**
We abandoned JavaScript migrations in favor of **Go-based migrations**, which are compiled directly into a custom PocketBase binary. This approach provides compile-time safety and bypasses the JS runtime entirely.

**Changes Made:**
1.  **Go Migration System:** Created `backend/main.go` and `backend/migrations/` to register schema changes in Go.
2.  **Custom Binary:** Updated `backend/Dockerfile` to a multi-stage build that compiles the Go application.
3.  **Docker Build Context:** Updated `docker-compose.yml` to use `build: ...` instead of `image: ...`.
4.  **Schema & Seeds:** Re-implemented the initial schema and seed data in Go (`1733842800_initial_schema.go` and `1733842801_seed_data.go`).

**Key Takeaways for Future:**
- **Prefer Go Migrations:** For this project, always use Go migrations (`backend/migrations/*.go`) instead of JS. They are robust and type-safe.
- **Rebuild to Apply:** Any change to migrations requires running `docker compose build hoa-backend` to recompile the binary.
- **Helper Functions:** Use the `ptr()` helper in migration files to handle PocketBase's pointer-based schema options (e.g., `Min`, `Max`).
- **Use `build` context:** Ensure `docker-compose.yml` uses `build:` for the backend to pick up local code changes.