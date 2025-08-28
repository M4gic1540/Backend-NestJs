# Heroku Deployment

Heroku es una plataforma clásica y robusta para desplegar aplicaciones.

## Configuración

1. Crea una cuenta en [Heroku](https://heroku.com)
2. Instala Heroku CLI
3. Conecta tu repositorio o usa Git

## Deploy Manual

```bash
# Login a Heroku
heroku login

# Crear aplicación
heroku create your-app-name

# Configurar variables de entorno
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=postgresql://...

# Deploy
git push heroku main
```

## Procfile

Crea un archivo `Procfile` en la raíz:

```
web: npm start
release: npx prisma migrate deploy
```

## Addons

### PostgreSQL
```bash
heroku addons:create heroku-postgresql:essential-0
```

### Redis (para caching)
```bash
heroku addons:create heroku-redis:mini
```

## Variables de Entorno

```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=443
```

## Configuración package.json

Asegúrate de tener:

```json
{
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  },
  "scripts": {
    "heroku-postbuild": "npm run build",
    "start": "node dist/main.js"
  }
}
```

## Logs

```bash
heroku logs --tail
```

## Escalabilidad

```bash
# Escalar dynos
heroku ps:scale web=2

# Cambiar tipo de dyno
heroku ps:type web=standard-1x
```
