# Use an official Node runtime as a parent image
# Use a version compatible with your Next.js version requirements
FROM node:20-slim as base

# Set working directory
WORKDIR /app

# Install dependencies stage
FROM base as deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat # Uncomment if using alpine base and encountering issues
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# Install dependencies based on the lock file (prefer pnpm, yarn, or npm ci)
# Using npm ci for this example, adjust if using yarn or pnpm
RUN npm ci --prefer-offline --no-audit

# Build stage
FROM base as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Add listing to check contents after copy
RUN ls -la /app
# Build the Next.js application
RUN npm run build
# Add listing to check contents after build
RUN ls -la /app

# Production stage
FROM base as runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# Set up a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Run the Next.js application
CMD ["node", "server.js"]