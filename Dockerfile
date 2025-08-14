# Build stage
FROM oven/bun:1.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Generate database schema
RUN bun run db:generate

# Production stage
FROM oven/bun:1.0-alpine

WORKDIR /app

# Copy built application
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/migrate.ts ./
COPY --from=builder /app/tsconfig.json ./

# Create directory for SQLite database
RUN mkdir -p /app/data

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/db.sqlite

# Expose port (Render will override this)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run healthcheck || exit 1

# Run migrations and start the server
CMD ["sh", "-c", "bun run migrate.ts && bun run src/index.ts"]