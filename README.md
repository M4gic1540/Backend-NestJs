# User Microservice - NestJS

Un microservicio de usuarios desarrollado con NestJS, TypeScript, Prisma y MySQL siguiendo las mejores prácticas de arquitectura de microservicios.

## 🚀 Características

- **Framework**: NestJS con TypeScript
- **Base de Datos**: MySQL con Prisma ORM
- **Arquitectura**: Microservicios (HTTP + TCP)
- **Validación**: DTOs con class-validator
- **Seguridad**: Contraseñas hasheadas con bcrypt
- **Logging**: Interceptor personalizado para logs
- **Manejo de Errores**: Filtro global de excepciones
- **Configuración**: Variables de entorno

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- MySQL Server
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio e instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
Copia el archivo `.env.example` a `.env` y configura las variables:
```env
DATABASE_URL="mysql://username:password@localhost:3306/user_microservice"
PORT=3001
SERVICE_NAME="user-service"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"
```

3. **Configurar la base de datos:**
```bash
# Generar el cliente de Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# (Opcional) Abrir Prisma Studio
npm run db:studio
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

## 📡 Endpoints HTTP

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/users` | Crear nuevo usuario |
| GET | `/users` | Obtener todos los usuarios |
| GET | `/users/:id` | Obtener usuario por ID |
| PATCH | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Eliminar usuario (soft delete) |
| DELETE | `/users/:id/hard` | Eliminar usuario (hard delete) |

### Ejemplos de uso

#### Crear Usuario
```bash
curl -X POST http://localhost:3001/users \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123"
  }'
```

#### Obtener Usuarios
```bash
curl -X GET http://localhost:3001/users
```

#### Obtener Usuario por ID
```bash
curl -X GET http://localhost:3001/users/1
```

#### Actualizar Usuario
```bash
curl -X PATCH http://localhost:3001/users/1 \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "John Updated",
    "isActive": true
  }'
```

## 🔄 Comunicación entre Microservicios

El servicio también expone patrones de mensajes TCP para comunicación entre microservicios:

### Patrones disponibles:

- `{ cmd: 'create_user' }` - Crear usuario
- `{ cmd: 'get_users' }` - Obtener todos los usuarios
- `{ cmd: 'get_user' }` - Obtener usuario por ID
- `{ cmd: 'get_user_by_email' }` - Obtener usuario por email
- `{ cmd: 'get_user_by_username' }` - Obtener usuario por username
- `{ cmd: 'update_user' }` - Actualizar usuario
- `{ cmd: 'delete_user' }` - Eliminar usuario
- `{ cmd: 'hard_delete_user' }` - Eliminar usuario permanentemente

### Ejemplo de cliente para microservicio:

```typescript
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

const client: ClientProxy = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: { host: 'localhost', port: 4001 }
});

// Crear usuario
const user = await client.send({ cmd: 'create_user' }, {
  email: 'user@example.com',
  username: 'johndoe',
  password: 'password123'
}).toPromise();
```

## 🗂️ Estructura del Proyecto

```
src/
├── common/                 # Código compartido
│   ├── filters/           # Filtros de excepción
│   ├── interceptors/      # Interceptors
│   └── prisma.service.ts  # Servicio de Prisma
├── config/                # Configuración
│   └── index.ts          # Variables de configuración
├── users/                 # Módulo de usuarios
│   ├── dto/              # Data Transfer Objects
│   ├── entities/         # Entidades
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── app.module.ts         # Módulo raíz
└── main.ts              # Punto de entrada
```

## 🧪 DTOs y Validaciones

### CreateUserDto
```typescript
{
  email: string;        // Email válido, requerido
  username: string;     // Mínimo 3 caracteres, requerido
  firstName?: string;   // Opcional
  lastName?: string;    // Opcional
  password: string;     // Mínimo 6 caracteres, requerido
}
```

### UpdateUserDto
```typescript
{
  email?: string;       // Email válido, opcional
  username?: string;    // Mínimo 3 caracteres, opcional
  firstName?: string;   // Opcional
  lastName?: string;    // Opcional
  password?: string;    // Mínimo 6 caracteres, opcional
  isActive?: boolean;   // Opcional
}
```

### UserResponseDto
```typescript
{
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // password excluido por seguridad
}
```

## 🔒 Seguridad

- **Contraseñas**: Hasheadas con bcrypt (salt rounds: 10)
- **Validación**: DTOs con class-validator
- **Sanitización**: Exclusión de contraseñas en respuestas
- **CORS**: Configurado para desarrollo
- **Logs**: No se loguean contraseñas

## 🗄️ Base de Datos

### Modelo User
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(191) UNIQUE NOT NULL,
  username VARCHAR(191) UNIQUE NOT NULL,
  firstName VARCHAR(191),
  lastName VARCHAR(191),
  password VARCHAR(191) NOT NULL,
  isActive BOOLEAN DEFAULT true,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev        # Modo desarrollo con hot reload

# Construcción
npm run build           # Compilar TypeScript

# Producción
npm run start:prod      # Ejecutar en producción

# Base de datos
npm run db:generate     # Generar cliente Prisma
npm run db:push         # Sincronizar schema con DB
npm run db:migrate      # Ejecutar migraciones
npm run db:studio       # Abrir Prisma Studio
```

## 🐳 Docker (Próximamente)

Se incluirá configuración Docker para facilitar el despliegue.

## 🚀 Próximas Características

- [ ] Autenticación JWT
- [ ] Autorización basada en roles
- [ ] Tests unitarios y de integración
- [ ] Documentación Swagger/OpenAPI
- [ ] Configuración Docker
- [ ] Healthcheck endpoints
- [ ] Métricas y monitoreo
- [ ] Rate limiting

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit los cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
