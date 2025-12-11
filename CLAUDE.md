# Jackson Trails HOA - Backend (PocketBase)

This directory contains the PocketBase backend configuration for the Jackson Trails HOA website.

## Structure

```
backend/
├── Dockerfile              # Multi-stage build for custom PocketBase binary
├── main.go                 # PocketBase application entry point
├── migrations/             # Go-based database migrations
│   ├── 1733842800_initial_schema.go
│   └── 1733842801_seed_data.go
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

## Troubleshooting Log - 2025-12-10: Frontend-Backend Communication (Standalone Build)

**Problem:**
PDF files and other assets served by PocketBase returned 404 errors when accessed through the Next.js frontend in production (standalone build mode). The frontend was attempting to proxy requests to `/pb/api/files/*` to the PocketBase backend, but Next.js rewrites configured in `next.config.js` were not being included in the standalone build output.

**Root Cause Analysis:**
- **Standalone Build Limitations:** Next.js standalone mode (used for Docker deployments) does not include `rewrites` in the production bundle. Inspection of `.next/standalone/routes-manifest.json` showed `rewrites: []`.
- **Static Configuration Issue:** The `rewrites()` function in `next.config.js` is evaluated at build time and cannot access runtime environment variables like `POCKETBASE_URL`.
- **Docker Networking:** While rewrites could theoretically work with hardcoded URLs, they fundamentally don't work in standalone mode regardless of configuration.

**Resolution:**
We implemented a **Next.js API Route** at `/pb/[[...path]]/route.ts` to dynamically proxy all `/pb/*` requests to the PocketBase backend at runtime. This approach:
1. Works in both development and standalone production builds
2. Can access runtime environment variables (`POCKETBASE_URL`)
3. Properly forwards all necessary headers for file downloads
4. Supports both GET (file downloads) and POST (API calls)

**Changes Made:**
1. **API Route Proxy:** Created `frontend/src/app/pb/[[...path]]/route.ts` with GET and POST handlers
2. **Header Forwarding:** Implemented proper forwarding of `Content-Type`, `Content-Disposition`, `Range`, and other critical headers
3. **Error Handling:** Added graceful error handling with 502 responses for backend failures
4. **PocketBase Version:** Updated from 0.21.0 to 0.21.5 for better compatibility

**Code Reference:**
See `frontend/src/app/pb/[[...path]]/route.ts` for the complete proxy implementation.

**Key Takeaways for Future:**
- **API Routes for Proxying:** Always use Next.js API routes (not rewrites) when proxying to backend services in standalone/Docker deployments
- **Runtime vs Build Time:** Environment variables needed for routing must be accessed at runtime via API routes, not build-time configuration
- **Header Preservation:** File downloads require careful preservation of headers like `Content-Disposition`, `Content-Type`, and `Range` for proper browser handling
- **Testing Standalone Builds:** Always test the standalone build output locally before deploying to catch issues like missing rewrites