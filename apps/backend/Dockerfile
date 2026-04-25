# Use Node.js 20 base image
FROM node:20-slim AS base

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy root workspace configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
# Copy backend package configuration
COPY apps/backend/package.json ./apps/backend/
# Copy shared libs if any (assuming none for now based on current structure)

# Install dependencies for the whole workspace (needed for monorepo linking)
RUN pnpm install --frozen-lockfile

# Copy backend source and prisma
COPY apps/backend ./apps/backend

# Generate Prisma client
WORKDIR /app/apps/backend
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# --- Production Image ---
FROM node:20-slim AS runner
WORKDIR /app

# Copy built application and dependencies
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=base /app/apps/backend/dist ./apps/backend/dist
COPY --from=base /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=base /app/apps/backend/prisma ./apps/backend/prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /app/apps/backend
EXPOSE 4000

# Start the application
CMD ["node", "dist/main.js"]
