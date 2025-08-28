# Render Deployment

Render es una plataforma moderna para desplegar aplicaciones web.

## Configuración

1. Crea una cuenta en [Render](https://render.com)
2. Conecta tu repositorio de GitHub
3. Crea un nuevo "Web Service"

## Configuración del Servicio

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: Node.js
- **Instance Type**: Free (para desarrollo) o Starter+ (para producción)

## Variables de Entorno

```env
DATABASE_URL=postgresql://username:password@hostname:port/database
PORT=10000
NODE_ENV=production
```

## Base de Datos

1. Crea un PostgreSQL database en Render
2. Copia la "Internal Database URL" 
3. Úsala como DATABASE_URL

## Configuración Avanzada

### render.yaml (opcional)

```yaml
services:
  - type: web
    name: backend-nestjs
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: backend-db
          property: connectionString

databases:
  - name: backend-db
    databaseName: user_microservice
    user: appuser
```

## Dominios

Render proporciona un dominio gratuito:
- `https://your-app-name.onrender.com`

Puedes configurar un dominio personalizado en el plan paid.
