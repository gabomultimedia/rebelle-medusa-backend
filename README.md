# Rebelle Medusa Backend

Medusa v2 backend for [Rebelle](https://rebelle.mx) — boutique de lujo con e-commerce, servicios de Studio y Consultoría.

## Stack

- Medusa 2.15.5
- Node.js 20+
- PostgreSQL 16
- Redis 7
- TypeScript

## Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env (copiar de .env.template)
cp .env.template .env

# 3. Iniciar dev server
npm run dev
```

## Deploy

Deploy automático en Railway:
- Project: `satisfied-spirit`
- Branch: `main`
- Cada push a `main` triggerea redeploy

## Admin

Una vez deployed, el admin está disponible en `/app` (puerto 9000 por default).

## Documentación

- Medusa docs: https://docs.medusajs.com
- Rebelle architecture: `/Volumes/QRETARIAMAC/proyectos/rebelle/`
