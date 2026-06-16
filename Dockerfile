# Rebelle Medusa Backend - Dockerfile for Railway
FROM node:20-alpine AS base

WORKDIR /app

# Install deps at root
FROM base AS deps
COPY package.json package-lock.json turbo.json ./
COPY apps/backend/package.json ./apps/backend/
RUN npm install --ignore-scripts --no-audit --no-fund

# Build
FROM deps AS build
COPY . .
RUN cd apps/backend && npx medusa build

# Production
FROM base AS production
ENV NODE_ENV=production
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/apps/backend/.medusa /app/apps/backend/.medusa
COPY --from=build /app/apps/backend/package.json /app/apps/backend/
COPY --from=build /app/apps/backend/src /app/apps/backend/src
COPY --from=build /app/apps/backend/medusa-config.ts /app/apps/backend/
COPY --from=build /app/apps/backend/tsconfig.json /app/apps/backend/

EXPOSE 9000
# Medusa CLI is installed at /app/node_modules (root), run from apps/backend
CMD ["sh", "-c", "cd /app/apps/backend && npx medusa db:migrate && node /app/node_modules/@medusajs/cli/cli.js start"]
