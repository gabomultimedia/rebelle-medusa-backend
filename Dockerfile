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
# Compile seed script separately (medusa build only compiles src/api and src/migration-scripts)
RUN cd apps/backend && npx tsc --outDir .medusa/server/dist src/scripts/seed.ts --skipLibCheck --esModuleInterop --moduleResolution node --target es2020 --module commonjs

# Production
FROM base AS production
ENV NODE_ENV=production
ENV PATH=/app/node_modules/.bin:$PATH
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/apps/backend/.medusa /app/apps/backend/.medusa
COPY --from=build /app/apps/backend/package.json /app/apps/backend/
COPY --from=build /app/apps/backend/src /app/apps/backend/src
COPY --from=build /app/apps/backend/medusa-config.ts /app/apps/backend/
COPY --from=build /app/apps/backend/tsconfig.json /app/apps/backend/

WORKDIR /app/apps/backend
EXPOSE 9000
CMD ["sh", "-c", "medusa db:migrate && node /app/node_modules/@medusajs/cli/cli.js exec .medusa/server/dist/seed.js && medusa start"]
