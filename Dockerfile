# syntax=docker/dockerfile:1.7

# ---------- 1. deps: install only production-ready node_modules ----------
FROM node:20-alpine AS deps
WORKDIR /app

# Alpine + libc6-compat for occasional native binaries (e.g. lightningcss optional dep).
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --no-audit --no-fund

# ---------- 2. builder: produce the Next.js standalone bundle ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Sanity environment must be available at build time (it's read by next/sanity at compile)
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_SANITY_API_VERSION
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_SANITY_API_VERSION=$NEXT_PUBLIC_SANITY_API_VERSION

# Disable telemetry so the build doesn't try to phone home from a sealed-network builder.
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---------- 3. runner: tiny runtime image ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run as a non-root user for safety.
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 --ingroup nodejs nextjs

# `output: 'standalone'` produces these three things; together they're the entire runtime.
# The standalone folder includes a minimal `node_modules` containing only the packages
# actually required at runtime (typically ~60 MB vs ~870 MB of full deps).
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public

USER nextjs

# Cloud Run injects $PORT (defaults to 8080). Next's standalone server.js respects it.
ENV PORT=8080
ENV HOSTNAME=0.0.0.0
EXPOSE 8080

CMD ["node", "server.js"]
