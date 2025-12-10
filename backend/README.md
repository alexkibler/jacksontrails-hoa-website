# Jackson Trails HOA - Backend (PocketBase)

This directory contains the PocketBase backend configuration for the Jackson Trails HOA website.

## Structure

```
backend/
├── Dockerfile              # PocketBase container image
├── pb_migrations/          # Database schema migrations
│   └── 1733842800_initial_schema.js
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
