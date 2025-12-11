# Jackson Trails HOA - Backend (PocketBase)

This directory contains the PocketBase backend configuration for the Jackson Trails HOA website. It has been customized to use **Go-based migrations** compiled into a custom binary, rather than standard JavaScript migrations.

## Structure

```
backend/
├── Dockerfile              # Multi-stage Dockerfile (builds Go binary + minimal runner)
├── go.mod                  # Go module definition
├── main.go                 # Application entrypoint (registers migrations)
├── migrations/             # Go migration files (Schema & Seed data)
│   ├── 1733842800_initial_schema.go
│   └── 1733842801_seed_data.go
├── pb_migrations/          # (Deprecated/Empty) Folder for JS migrations
└── scripts/                # Helper scripts
```

## Migration System

### Why Go Migrations?
We switched from JavaScript (`pb_migrations/*.js`) to Go migrations (`migrations/*.go`) due to persistent runtime compatibility issues with the JS engine in PocketBase v0.22+. The JS engine struggled with `app` vs `db` object contexts, leading to `TypeError` failures during startup.

Go migrations are compiled directly into the application binary, offering:
- **Type Safety:** Compilation fails if schema definitions are invalid (e.g., wrong types for options).
- **Stability:** Removes dependency on the embedded Goja JavaScript runtime for critical schema changes.
- **Integration:** Migrations are registered in `main.go` and run automatically on startup.

### How to Manage Migrations

#### 1. Creating a New Migration
To make changes to the database schema (e.g., adding a field or collection):

1.  Create a new file in `backend/migrations/` (e.g., `1740000000_add_field.go`).
2.  Use the existing files as a template. A basic structure is:
    ```go
    package migrations

    import (
        "github.com/pocketbase/dbx"
        "github.com/pocketbase/pocketbase/daos"
        m "github.com/pocketbase/pocketbase/migrations"
    )

    func init() {
        m.Register(func(db dbx.Builder) error {
            // UP: Apply changes
            dao := daos.New(db)
            // ... your logic here (e.g. dao.SaveCollection)
            return nil
        }, func(db dbx.Builder) error {
            // DOWN: Revert changes
            return nil
        })
    }
    ```

#### 2. Applying Migrations
Since migrations are compiled into the binary, you **must rebuild the Docker image** to apply changes.

```bash
# 1. Rebuild the backend image
cd /Volumes/1TB/Repos/nginx-proxy-manager
docker compose build hoa-backend

# 2. Restart the container (recreates it with the new binary)
docker compose up -d hoa-backend
```

The migrations will run automatically when the container starts (`Automigrate: true` is set in `main.go`). You can check the logs to confirm:
```bash
docker logs hoa-backend
# Look for "Applied 1740000000_add_field.go"
```

#### 3. Manual Migration (Troubleshooting)
If migrations don't seem to apply automatically, you can trigger them manually inside the running container:

```bash
docker exec hoa-backend /usr/local/bin/pocketbase migrate up
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

## Admin Access

Access the PocketBase admin UI at:
- URL: `http://localhost:8092/_/` (Port depends on your proxy manager config)