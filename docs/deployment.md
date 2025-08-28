# Environment Configuration Guide

Este microservicio soporta múltiples entornos de despliegue.

## 🚀 Plataformas de Despliegue Recomendadas

### 1. Railway (Recomendado para desarrollo)
- ✅ Setup automático
- ✅ Base de datos incluida
- ✅ SSL automático
- ✅ Plan gratuito generoso

### 2. Render (Recomendado para producción)
- ✅ Infraestructura moderna
- ✅ Auto-deploy desde GitHub
- ✅ Base de datos PostgreSQL
- ✅ Dominios personalizados

### 3. Heroku (Clásico y confiable)
- ✅ Ecosistema maduro
- ✅ Muchos addons
- ✅ Fácil escalabilidad
- ⚠️ Plan gratuito limitado

### 4. Vercel (Para APIs simples)
- ✅ Deploy instantáneo
- ✅ Integración GitHub
- ⚠️ Serverless (requiere adaptación)

## 📋 Variables de Entorno Requeridas

### Desarrollo Local
```env
DATABASE_URL="mysql://appuser:apppassword@localhost:3307/user_microservice"
PORT=3001
NODE_ENV=development
```

### Producción (PostgreSQL)
```env
DATABASE_URL="postgresql://username:password@hostname:port/database"
PORT=443
NODE_ENV=production
```

### Producción (MySQL)
```env
DATABASE_URL="mysql://username:password@hostname:port/database"
PORT=443
NODE_ENV=production
```

## 🔧 Comandos de Despliegue

### Railway
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Render
```bash
# Conectar repositorio en render.com
# Configurar build command: npm install && npm run build
# Configurar start command: npm start
```

### Heroku
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login y crear app
heroku login
heroku create your-app-name

# Configurar variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL="postgresql://..."

# Deploy
git push heroku main
```

## 🗄️ Base de Datos

### PostgreSQL (Recomendado para producción)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### MySQL (Para desarrollo local)
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

## 🔍 Healthcheck

El microservicio expone un endpoint de health:
```
GET /health
```

Respuesta:
```json
{
  "status": "ok",
  "timestamp": "2025-08-28T20:00:00.000Z",
  "database": "connected"
}
```

## 📊 Monitoreo

### Logs
```bash
# Railway
railway logs

# Render
# Ver logs en dashboard

# Heroku
heroku logs --tail
```

### Métricas
- **Railway**: Dashboard integrado
- **Render**: Métricas básicas incluidas
- **Heroku**: Heroku Metrics (addon)

## 🔒 Consideraciones de Seguridad

1. **Variables de Entorno**: Nunca commitear secrets
2. **CORS**: Configurar dominios permitidos
3. **Rate Limiting**: Implementar en producción
4. **HTTPS**: Automático en todas las plataformas
5. **Database**: Usar conexiones SSL en producción

## 📈 Escalabilidad

### Horizontal Scaling
```bash
# Heroku
heroku ps:scale web=3

# Railway/Render
# Configurar desde dashboard
```

### Database Scaling
- **Railway**: Upgrade plan automático
- **Render**: PostgreSQL escalable
- **Heroku**: PostgreSQL addons
