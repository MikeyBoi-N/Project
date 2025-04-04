# Stage 1: Builder
FROM node:20-slim AS builder
WORKDIR /app

# Copy package manager files
# Use COPY --link for better layer caching if available, otherwise standard COPY
# Assuming npm, adjust if using yarn or pnpm
COPY package.json package-lock.json* ./

# Install dependencies using npm ci for reproducibility
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
# Ensure your build script is correctly defined in package.json
RUN npm run build

# Stage 2: Runner - Minimal image with only necessary artifacts
FROM node:20-slim AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
# Optionally, disable telemetry
# ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user and group for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary artifacts from the builder stage
# Ensure these paths match the output structure of your Next.js build (standalone output)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set the default port environment variable (Next.js uses this)
ENV PORT 3000

# Command to run the application (using the standalone server)
CMD ["node", "server.js"]