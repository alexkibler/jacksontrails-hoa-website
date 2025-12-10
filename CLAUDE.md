# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jackson Trails HOA Website - A privacy-focused, self-hosted community website built with Next.js 14 and PocketBase. The project emphasizes test-driven development, no PII storage, and complete self-hosting control.

## Development Commands

### Docker Environment

**IMPORTANT**: This project's Docker services are now managed in the main NPM (nginx-proxy-manager) repository at `/Volumes/1TB/Repos/nginx-proxy-manager/docker-compose.yml`. The local `docker-compose.yml` in this repo is deprecated.

**Production mode**:
```bash
cd /Volumes/1TB/Repos/nginx-proxy-manager
docker compose up -d hoa-backend hoa-frontend
```
- Frontend: http://localhost:3000 (or via proxy at https://jacksontrails.org)
- Backend Admin: http://localhost:8092/_/ (or via proxy at https://hoa-admin.alexkibler.com)

**Stop services**:
```bash
cd /Volumes/1TB/Repos/nginx-proxy-manager
docker compose stop hoa-backend hoa-frontend
```

**View logs**:
```bash
cd /Volumes/1TB/Repos/nginx-proxy-manager
docker compose logs -f hoa-backend hoa-frontend
```

**Development mode** (local frontend development without Docker):
For local development with live-reload, run the frontend locally while using the production backend container.

### Frontend Development (cd frontend/)

**Local development** (without Docker):
```bash
npm run dev          # Start dev server on localhost:3000
```

**Testing**:
```bash
npm test             # Run Jest unit tests in watch mode
npm run test:ci      # Run tests with coverage (40% threshold)
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run E2E tests with Playwright UI
```

**Linting and building**:
```bash
npm run lint         # Run ESLint
npm run build        # Build production bundle
npm start            # Start production server
```

## Architecture

### Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: PocketBase (SQLite-based, Go binary)
- **Deployment**: Docker Compose with profile-based environments
- **CI/CD**: GitHub Actions → GHCR → Watchtower auto-updates

### Key Directories

```
frontend/src/
├── app/              # Next.js App Router pages and API routes
│   ├── page.tsx      # Homepage with featured announcements
│   ├── layout.tsx    # Root layout with fonts (Inter, Lora) and theme
│   ├── announcements/
│   ├── documents/
│   ├── contact/
│   └── feed.xml/     # RSS feed route handler
├── components/       # React components
│   ├── ContactForm.tsx        # Stateless form with email relay
│   ├── DocumentsFilter.tsx    # Client-side document filtering
│   ├── Navigation.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
└── lib/
    ├── pocketbase.ts # Server-side PocketBase client and types
    └── email.ts      # Nodemailer SMTP relay (no PII storage)

backend/
├── pb_migrations/    # PocketBase schema migrations
│   ├── 1733842800_initial_schema.js  # Collections: announcements, documents
│   └── 1733842801_seed_data.js
└── scripts/
    └── dev-entrypoint.sh  # Dev data hydration from production
```

### PocketBase Integration

- **Server-side client**: Uses internal Docker network URL (`http://hoa-backend:8090`)
- **Collections**: `announcements` (title, slug, content, published_date, featured) and `documents` (title, category, year, file, description)
- **No client-side auth**: Public site with backend admin panel only
- **File URLs**: Use `getFileUrl()` helper from [lib/pocketbase.ts](frontend/src/lib/pocketbase.ts)

### Contact Form Flow

The contact form is **stateless** (privacy-focused, no PII storage):
1. User submits form → frontend API route [app/contact/route.ts](frontend/src/app/contact/route.ts)
2. Email sent via SMTP relay (Gmail) using [lib/email.ts](frontend/src/lib/email.ts)
3. Message delivered to `BOARD_EMAIL` (configured in .env)
4. No database storage of messages

### Environment Configuration

All settings are environment-variable driven. Key variables are now in `/Volumes/1TB/Repos/nginx-proxy-manager/.env`:
- `HOA_SMTP_USER`, `HOA_SMTP_PASS` - Gmail SMTP credentials for contact form relay
- `HOA_FROM_EMAIL`, `HOA_BOARD_EMAIL` - Email addresses for contact form
- `PUBLIC_SITE_URL=https://jacksontrails.org` - Hardcoded in docker-compose
- `PUBLIC_SITE_NAME=Jackson Trails HOA` - Hardcoded in docker-compose

The docker-compose service definitions include:
- `POCKETBASE_URL=http://hoa-backend:8090` - Internal container network URL
- Port mappings: 3000 (frontend), 8092 (backend admin exposed on host)

**Production environment**:
- Data persisted in `/Volumes/1TB/Repos/jacksontrails-hoa-website/pb_data` (gitignored)
- Accessed via admin panel at `http://localhost:8092/_/` or `https://hoa-admin.alexkibler.com`
- Services managed by nginx-proxy-manager with automatic SSL via Let's Encrypt

## Testing Requirements

### Coverage Thresholds
Jest enforces **40% minimum coverage** on branches, functions, lines, and statements (see [jest.config.js](frontend/jest.config.js)).

### Test Structure
- **Unit tests**: `frontend/__tests__/*.test.tsx`
- **E2E tests**: `frontend/e2e/*.spec.ts` (Playwright)
- Tests run in CI before Docker image builds

### Running Single Tests
```bash
cd frontend
npm test -- ContactForm.test.tsx           # Run specific test file
npm run test:e2e -- contact.spec.ts        # Run specific E2E test
```

## CI/CD Pipeline

GitHub Actions workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)):

**On push to `main`**:
1. Run frontend lint + unit tests
2. Build Docker images (frontend + backend)
3. Push to GHCR with `:latest` tag
4. Watchtower auto-deploys to production

**On pull requests to `main`**:
1. Run tests (validation only)
2. Build images with `:pr-<number>` tag (no production impact)

## Design System

### Color Scheme
Custom "Forest" theme inspired by the neighborhood aesthetic:
- **Primary**: `jt-forest-900` (#14532d) - Deep forest green for headers
- **Accent**: `jt-emerald-600` (#059669) - Vibrant green for buttons
- **Text**: `jt-stone-700` (#44403c) - Warm stone for readability
- **Background**: `jt-stone-50` (#fafaf9) - Warm off-white

See full palette in [tailwind.config.ts](frontend/tailwind.config.ts).

### Typography
- **Sans-serif**: Inter (body text, UI)
- **Serif**: Lora (headings, featured content)

Both loaded via Next.js font optimization in [layout.tsx](frontend/src/app/layout.tsx).

### Dark Mode
- Implemented with Tailwind's `class` strategy
- Theme state managed by [ThemeProvider.tsx](frontend/src/components/ThemeProvider.tsx)
- Persisted to localStorage, respects system preference

## Adding New Features

1. **Write tests first** (TDD approach required)
2. Run tests to verify they fail
3. Implement feature
4. Ensure tests pass and coverage threshold is met
5. Run linter and fix any issues
6. Test in dev environment (`docker compose --profile dev up`)
7. Submit PR (CI will run tests and build images)

## Common Tasks

### Adding a New Page
1. Create route in `frontend/src/app/<route>/page.tsx`
2. Add navigation link in [Navigation.tsx](frontend/src/components/Navigation.tsx)
3. Add unit tests in `frontend/__tests__/`
4. Add E2E tests in `frontend/e2e/`

### Modifying PocketBase Schema
1. Create new migration file in `backend/pb_migrations/`
2. Follow PocketBase migration format (see existing files)
3. Restart backend container to apply migrations:
   ```bash
   cd /Volumes/1TB/Repos/nginx-proxy-manager
   docker compose restart hoa-backend
   ```

### Updating Email Templates
Email logic is in [lib/email.ts](frontend/src/lib/email.ts). Uses nodemailer with Gmail SMTP. Contact form route is [app/contact/route.ts](frontend/src/app/contact/route.ts).

## Deployment Notes

### Manual Deployment
```bash
cd /Volumes/1TB/Repos/nginx-proxy-manager
docker compose pull hoa-backend hoa-frontend  # Pull latest images from GHCR
docker compose up -d hoa-backend hoa-frontend # Restart with new images
```

Watchtower is configured to automatically pull and deploy new images tagged with `:latest` when pushed to GHCR.

### First-Time Setup
1. Configure SMTP settings in `/Volumes/1TB/Repos/nginx-proxy-manager/.env`:
   ```bash
   HOA_SMTP_USER=your-hoa-email@gmail.com
   HOA_SMTP_PASS=your-app-specific-password
   HOA_FROM_EMAIL=your-hoa-email@gmail.com
   HOA_BOARD_EMAIL=board@jacksontrails.org
   ```
2. Start production environment:
   ```bash
   cd /Volumes/1TB/Repos/nginx-proxy-manager
   docker compose up -d hoa-backend hoa-frontend
   ```
3. Access PocketBase admin: `http://localhost:8092/_/` or `https://hoa-admin.alexkibler.com`
4. Create admin account
5. Add initial announcements and documents via admin panel
6. Configure nginx-proxy-manager proxy hosts for `jacksontrails.org` and `hoa-admin.alexkibler.com`

## Project Principles

1. **Privacy First** - No PII storage, stateless contact form
2. **Test-Driven** - Write tests before implementation, maintain 40%+ coverage
3. **Self-Hosted** - Full data ownership, no external dependencies
4. **Configuration-Driven** - All settings via environment variables
5. **Security** - XSS prevention, input sanitization, no authentication on public routes
