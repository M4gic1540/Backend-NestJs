# Test Documentation

## Descripción General

Este proyecto contiene un conjunto completo de pruebas para validar el microservicio de usuarios desarrollado con NestJS, TypeScript, Prisma y MySQL.

## Cobertura de Pruebas

### 📊 Estadísticas Actuales
- **Total de Pruebas**: 57 pruebas
- **Estado**: ✅ Todas las pruebas pasando
- **Cobertura de Código**: 58.88% de declaraciones, 44.26% de ramas
- **Archivos Principales Cubiertos**:
  - UsersService: 90.38% cobertura
  - DTOs: 100% cobertura
  - UsersController: 63.63% cobertura

### 📁 Estructura de Pruebas

```
test/
├── dto.spec.ts                 # Pruebas de validación de DTOs
├── users.service.spec.ts       # Pruebas unitarias del servicio
├── users.controller.spec.ts    # Pruebas de integración del controlador
├── prisma.service.spec.ts      # Pruebas de base de datos
└── setup.ts                    # Configuración global de pruebas
```

## Tipos de Pruebas Implementadas

### 🧪 1. Pruebas Unitarias - UsersService

**Archivo**: `test/users.service.spec.ts`

**Funcionalidades Probadas**:
- ✅ Creación de usuarios con hash de contraseña
- ✅ Validación de email y username únicos
- ✅ Búsqueda de usuarios (todos, por ID, por email, por username)
- ✅ Actualización de usuarios con validaciones
- ✅ Eliminación suave (soft delete)
- ✅ Eliminación permanente (hard delete)
- ✅ Manejo de errores y excepciones

**Características**:
- Uso de mocks para PrismaService
- Simulación de bcrypt para hash de contraseñas
- Pruebas de casos exitosos y de error
- Validación de parámetros y retornos

### 🌐 2. Pruebas de Integración - UsersController

**Archivo**: `test/users.controller.spec.ts`

**Endpoints Probados**:
- `POST /users` - Creación de usuarios
- `GET /users` - Listado de usuarios
- `GET /users/:id` - Obtener usuario por ID
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminación suave
- `DELETE /users/:id/hard` - Eliminación permanente

**Validaciones**:
- Códigos de estado HTTP correctos
- Validación de datos de entrada
- Manejo de errores de validación
- Formato de respuestas JSON

### 📋 3. Pruebas de Validación - DTOs

**Archivo**: `test/dto.spec.ts`

**DTOs Probados**:
- `CreateUserDto`: Validaciones de campos obligatorios y opcionales
- `UpdateUserDto`: Validaciones de campos parciales

**Casos de Prueba**:
- ✅ Validación de email formato correcto
- ✅ Validación de longitud mínima de password (6 caracteres)
- ✅ Validación de longitud mínima de username (3 caracteres)
- ✅ Validación de campos opcionales
- ✅ Manejo de tipos de datos incorrectos

### 🗃️ 4. Pruebas de Base de Datos - PrismaService

**Archivo**: `test/prisma.service.spec.ts`

**Operaciones Probadas**:
- ✅ Conexión a base de datos
- ✅ Operaciones CRUD completas
- ✅ Restricciones de unicidad (email, username)
- ✅ Índices y consultas optimizadas
- ✅ Soft delete y hard delete
- ✅ Búsquedas por múltiples criterios

## Scripts de Testing

### Comandos Disponibles

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch (desarrollo)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage

# Ejecutar pruebas en modo debug
npm run test:debug
```

### Configuración Jest

**Archivo**: `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.spec.ts',
    '!src/**/*.interface.ts',
    '!src/main.ts',
  ],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@users/(.*)$': '<rootDir>/src/users/$1',
  },
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};
```

## Casos de Prueba Específicos

### 🔐 Seguridad
- Verificación de hash de contraseñas con bcrypt
- Exclusión de contraseñas en respuestas API
- Validación de datos de entrada

### 🔄 Flujos de Negocio
- Creación de usuarios con validación de duplicados
- Actualización parcial de datos
- Eliminación suave manteniendo datos
- Eliminación permanente

### 🚨 Manejo de Errores
- `ConflictException` para emails/usernames duplicados
- `NotFoundException` para usuarios inexistentes
- `BadRequestException` para datos inválidos

## Variables de Entorno para Testing

```bash
# Base de datos de testing
DATABASE_URL="mysql://appuser:apppassword@localhost:3307/user_microservice_test"
```

## Mejores Prácticas Implementadas

### ✅ Aislamiento de Pruebas
- Cada prueba es independiente
- Uso de mocks para dependencias externas
- Limpieza de datos entre pruebas

### ✅ Cobertura Completa
- Pruebas unitarias para lógica de negocio
- Pruebas de integración para APIs
- Pruebas de validación para DTOs
- Pruebas de base de datos para persistencia

### ✅ Configuración Robusta
- Setup global para conexiones
- Timeouts apropiados para operaciones de DB
- Reportes de cobertura detallados

## Próximos Pasos

### 🎯 Mejoras Potenciales
1. Aumentar cobertura de ramas (actualmente 44.26%)
2. Agregar pruebas de performance
3. Implementar pruebas de carga
4. Agregar pruebas de seguridad adicionales

### 📈 Métricas de Calidad
- **Objetivo de Cobertura**: 80%+ en declaraciones
- **Tiempo de Ejecución**: <30 segundos para suite completa
- **Confiabilidad**: 100% de pruebas pasando

---

**Última actualización**: 28/08/2025
**Total de Pruebas**: 57 ✅
**Estado del Build**: ✅ PASSING
