# Production Dockerfile for Next.js Frontend

FROM node:20-alpine AS base

# Stage 1: Install dependencies (on Build Platform - Fast)
FROM --platform=$BUILDPLATFORM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build the application (on Build Platform - Fast)
FROM --platform=$BUILDPLATFORM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
# This runs native speed on the runner (AMD64)
RUN npm run build

# Stage 3: Install Production Dependencies (on Target Platform - QEMU)
# We need to reinstall modules to ensure native bindings (like sharp) match the target arch (ARM64)
FROM base AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Install only production dependencies
RUN npm ci --only=production

# Stage 4: Run the application
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built app from builder
# We exclude node_modules from builder because they are the wrong architecture
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Overwrite node_modules with the correct architecture from prod-deps
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
