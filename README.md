# Jackson Trails HOA Website

An open-source community website built for the Jackson Trails Homeowners Association. This project prioritizes privacy, self-hosting, and ease of maintenance.

## 🌟 Features

- **Public Announcements** - Community updates with RSS feed support
- **Document Library** - Searchable repository for bylaws, meeting minutes, and reports
- **Contact Form** - Stateless, privacy-focused contact system (no PII storage)
- **Dark/Light Mode** - Accessible theme switcher with system preference support
- **Mobile Responsive** - Works seamlessly on all devices
- **Self-Hosted** - Complete control over your data and infrastructure

## 🏗️ Architecture

### Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: PocketBase (embedded SQLite)
- **Infrastructure**: Docker, Nginx Proxy Manager, Watchtower
- **CI/CD**: GitHub Actions

### Design Principles

1. **Privacy First** - No PII storage, stateless contact form
2. **Open Source** - Public repository for community transparency
3. **Self-Hosted** - Full data ownership and control
4. **Test-Driven** - Comprehensive test coverage (70%+ threshold)
5. **Configuration-Driven** - All settings via environment variables

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Nginx Proxy Manager (optional, for production)

### Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` with your configuration:

```bash
# Required settings
PROD_FRONTEND_PORT=3000
PROD_BACKEND_PORT=8090
SMTP_USER=your-hoa-email@gmail.com
SMTP_PASS=your-app-specific-password
BOARD_EMAIL=board@jacksontrails.org
```

### Development Mode

Run with live-reload and production data cloning:

```bash
docker compose --profile dev up -d
```

- Frontend: http://localhost:3001
- Backend Admin: http://localhost:8091/_/

The dev environment automatically clones production data on startup (read-only).

### Production Mode

Deploy to production:

```bash
docker compose --profile prod up -d
```

- Frontend: http://localhost:3000
- Backend Admin: http://localhost:8090/_/

### First-Time Setup

1. Access PocketBase admin panel
2. Create your admin account
3. Start adding announcements and documents!

## 🧪 Testing

### Unit Tests

```bash
cd frontend
npm test
```

### E2E Tests

```bash
cd frontend
npm run test:e2e
```

### Coverage Report

```bash
cd frontend
npm run test:ci
```

## 📁 Project Structure

```
.
├── backend/                 # PocketBase backend
│   ├── Dockerfile
│   ├── pb_migrations/       # Database schema migrations
│   └── scripts/             # Helper scripts (dev data hydration)
│
├── frontend/                # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # React components
│   │   └── lib/             # Utilities (PocketBase, email)
│   ├── __tests__/           # Unit tests
│   ├── e2e/                 # Playwright E2E tests
│   └── Dockerfile
│
├── docker-compose.yml       # Docker orchestration
└── .github/workflows/       # CI/CD pipelines
```

## 🎨 Color Scheme

Inspired by the Jackson Trails neighborhood sign:

- **Primary Blue**: Deep blue (#1e3a8a)
- **Sunset Gradient**: Purple → Pink → Orange
- **Accessible**: WCAG AA compliant in both light and dark modes

## 🔐 Security & Privacy

- **No PII Storage**: Contact form messages are emailed directly, never stored
- **No Authentication**: Public-facing site with admin-only backend
- **Email Relay**: Uses secure SMTP with app-specific passwords
- **XSS Prevention**: All user input is sanitized and escaped

## 🚢 Deployment

### GitHub Actions

Pushes to `main` trigger automatic builds:

1. Run frontend tests
2. Build Docker images
3. Push to GitHub Container Registry (GHCR)
4. Watchtower auto-updates running containers

### Manual Deployment

```bash
# Pull latest images
docker compose --profile prod pull

# Restart services
docker compose --profile prod up -d
```

## 📝 Content Management

### Adding Announcements

1. Log in to PocketBase admin: http://your-domain:8090/_/
2. Navigate to `announcements` collection
3. Create new record:
   - **Title**: Your announcement title
   - **Slug**: URL-friendly slug (e.g., `summer-pool-opening`)
   - **Content**: Rich text editor
   - **Published Date**: When to show the announcement
   - **Featured**: Show on homepage

### Uploading Documents

1. Navigate to `documents` collection
2. Create new record:
   - **Title**: Document name
   - **Category**: Select from predefined categories
   - **Year**: Document year
   - **File**: Upload PDF (max 10MB)
   - **Description**: Optional description

## 🛠️ Development

### Running Tests

```bash
# Frontend unit tests
cd frontend && npm test

# E2E tests
cd frontend && npm run test:e2e

# Linting
cd frontend && npm run lint
```

### Adding New Features

1. Write tests first (TDD approach)
2. Implement feature
3. Ensure tests pass
4. Update documentation
5. Submit pull request

## 🤝 Contributing

This is an open-source community project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 📄 License

MIT License - feel free to use this for your own HOA or community!

## 🙏 Acknowledgments

Built with love for the Jackson Trails community.

## 📧 Contact

For questions about this codebase, please open an issue on GitHub.

For HOA-related inquiries, use the contact form on the website.
