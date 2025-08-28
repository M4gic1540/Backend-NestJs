# Railway Deployment

Railway es una plataforma excelente para desplegar aplicaciones NestJS.

## Configuración

1. Crea una cuenta en [Railway](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Railway detectará automáticamente que es una aplicación Node.js

## Variables de Entorno

Configura estas variables en Railway:

```env
DATABASE_URL=postgresql://username:password@hostname:port/database
PORT=3001
NODE_ENV=production
```

## Comandos de Build

Railway ejecutará automáticamente:
- `npm install`
- `npm run build` 
- `npm start`

## Base de Datos

Railway ofrece PostgreSQL como servicio:
1. Agrega PostgreSQL desde el dashboard
2. Actualiza DATABASE_URL en variables de entorno
3. Actualiza schema.prisma para usar PostgreSQL

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Healthcheck

Railway verificará automáticamente que tu app responda en el PORT configurado.
