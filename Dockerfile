# Rebelle Medusa Backend - Dockerfile for Railway
FROM node:20-alpine AS base

WORKDIR /app

# Install deps
FROM base AS deps
COPY package.json package-lock.json turbo.json ./
COPY apps/backend/package.json ./apps/backend/
RUN npm install --ignore-scripts --no-audit --no-fund

# Build
FROM deps AS build
COPY . .
RUN cd apps/backend && npx medusa build

# Production - Medusa outputs to .medusa, not dist
FROM base AS production
ENV NODE_ENV=production
WORKDIR /app/apps/backend
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/apps/backend/.medusa /app/apps/backend/.medusa
COPY --from=build /app/apps/backend/package.json /app/apps/backend/
COPY --from=build /app/apps/backend/src /app/apps/backend/src
COPY --from=build /app/apps/backend/medusa-config.ts /app/apps/backend/
COPY --from=build /app/apps/backend/tsconfig.json /app/apps/backend/

EXPOSE 9000
CMD ["sh", "-c", "npx medusa db:migrate && node ./node_modules/@medusajs/cli/bin/medusa.js start"]
