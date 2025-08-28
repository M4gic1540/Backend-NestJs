# Contributing to User Microservice

¡Gracias por tu interés en contribuir a este proyecto! 🎉

## 📋 Código de Conducta

Este proyecto se adhiere al Contributor Covenant [code of conduct](CODE_OF_CONDUCT.md). Al participar, se espera que mantengas este código.

## 🚀 Cómo Contribuir

### 🐛 Reportar Bugs

Antes de crear un issue, por favor:

1. **Verifica** que el bug no haya sido reportado anteriormente
2. **Incluye** información detallada sobre tu entorno:
   - Versión de Node.js
   - Sistema operativo
   - Versión del proyecto
3. **Proporciona** pasos para reproducir el bug
4. **Agrega** logs o capturas de pantalla si es relevante

### ✨ Sugerir Nuevas Características

Para sugerir nuevas características:

1. **Verifica** que la característica no exista ya
2. **Explica** claramente el problema que resuelve
3. **Describe** la solución propuesta
4. **Considera** alternativas que hayas evaluado

### 🔧 Pull Requests

#### Antes de Enviar

1. **Fork** el repositorio
2. **Crea** una rama para tu feature: `git checkout -b feature/amazing-feature`
3. **Sigue** las convenciones de código del proyecto
4. **Escribe** pruebas para tu código
5. **Asegúrate** de que todas las pruebas pasen
6. **Actualiza** la documentación si es necesario

#### Convenciones de Código

- **TypeScript** estricto habilitado
- **ESLint** configurado (ejecutar `npm run lint`)
- **Prettier** para formateo (ejecutar `npm run format`)
- **Conventional Commits** para mensajes

#### Estructura de Commit

```
type(scope): descripción corta

Descripción más detallada si es necesaria.

- Detalle 1
- Detalle 2

Fixes #123
```

**Tipos permitidos:**
- `feat`: nueva característica
- `fix`: corrección de bug
- `docs`: cambios en documentación
- `style`: cambios de formato
- `refactor`: refactoring de código
- `test`: agregar o corregir pruebas
- `chore`: cambios en build, CI, etc.

### 🧪 Testing

Todas las contribuciones deben incluir pruebas:

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con cobertura
npm run test:coverage

# Ejecutar en modo watch
npm run test:watch
```

**Requisitos de Testing:**
- Cobertura mínima: 80%
- Todas las pruebas deben pasar
- Incluir pruebas unitarias y de integración
- Probar casos edge y manejo de errores

### 📁 Estructura de Branches

- `main` - Código de producción estable
- `develop` - Rama de desarrollo
- `feature/*` - Nuevas características
- `fix/*` - Corrección de bugs
- `hotfix/*` - Correcciones urgentes
- `release/*` - Preparación de releases

### 🔄 Proceso de Review

1. **Automated Checks** - CI/CD debe pasar
2. **Code Review** - Al menos un reviewer debe aprobar
3. **Testing** - Todas las pruebas deben pasar
4. **Documentation** - Documentación actualizada si es necesario

### 📝 Checklist para Pull Requests

- [ ] Las pruebas pasan localmente
- [ ] El código sigue las convenciones del proyecto
- [ ] La documentación está actualizada
- [ ] Los commits siguen el formato convencional
- [ ] No hay conflictos de merge
- [ ] El PR tiene una descripción clara
- [ ] Se agregaron pruebas para nueva funcionalidad

## 🏗️ Configuración de Desarrollo

### 1. Setup Inicial

```bash
# Clonar el repositorio
git clone https://github.com/[usuario]/user-microservice.git
cd user-microservice

# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env

# Levantar base de datos
docker-compose up -d

# Configurar base de datos
npm run db:push
npm run db:seed
```

### 2. Ejecutar en Desarrollo

```bash
# Modo desarrollo con watch
npm run start:dev

# Ejecutar pruebas en watch
npm run test:watch
```

### 3. Verificar Código

```bash
# Linting
npm run lint

# Formateo
npm run format

# Pruebas con cobertura
npm run test:coverage

# Build de producción
npm run build
```

## 🎯 Áreas de Contribución

### 🔥 Prioridad Alta
- Mejoras en la cobertura de pruebas
- Optimización de performance
- Documentación de API
- Seguridad y validaciones

### 🚀 Características Deseadas
- Autenticación JWT
- Rate limiting
- Logging avanzado
- Métricas y monitoreo
- Más tipos de usuarios
- API de roles y permisos

### 🐛 Bugs Conocidos
- Ver [Issues](https://github.com/[usuario]/user-microservice/issues) etiquetados como `bug`

## 📚 Recursos

### Documentación
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Herramientas Útiles
- [Postman Collection](./docs/postman_collection.json)
- [Database Schema](./docs/database.md)
- [API Documentation](./docs/api.md)

### Estilo de Código
- [TypeScript Style Guide](https://ts.dev/style/)
- [NestJS Style Guide](https://docs.nestjs.com/techniques/style-guide)

## 🤝 Comunidad

- **Discord**: [Enlace al Discord]
- **Slack**: [Enlace al Slack]
- **Email**: [email de contacto]

## 🏆 Reconocimientos

Los contribuidores serán reconocidos en:
- README principal
- Página de contribuidores
- Release notes

## ❓ ¿Preguntas?

Si tienes preguntas sobre cómo contribuir:

1. Revisa esta guía y la documentación
2. Busca en issues existentes
3. Crea un issue con la etiqueta `question`
4. Únete a nuestros canales de comunicación

---

¡Gracias por ayudar a hacer este proyecto mejor! 🚀
