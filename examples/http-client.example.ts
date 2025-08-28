// Ejemplos de uso HTTP con fetch/axios

/**
 * Ejemplos de llamadas HTTP al microservicio de usuarios
 * Ejecutar el microservicio primero: npm run start:dev
 */

const BASE_URL = 'http://localhost:3001';

// Ejemplo 1: Crear usuario
async function createUserExample() {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'johndoe@example.com',
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    })
  });

  if (response.ok) {
    const user = await response.json();
    console.log('Usuario creado:', user);
    return user;
  } else {
    const error = await response.json();
    console.error('Error creando usuario:', error);
    throw new Error(error.message);
  }
}

// Ejemplo 2: Obtener todos los usuarios
async function getUsersExample() {
  const response = await fetch(`${BASE_URL}/users`);
  
  if (response.ok) {
    const users = await response.json();
    console.log('Usuarios:', users);
    return users;
  } else {
    const error = await response.json();
    console.error('Error obteniendo usuarios:', error);
    throw new Error(error.message);
  }
}

// Ejemplo 3: Obtener usuario por ID
async function getUserByIdExample(id: number) {
  const response = await fetch(`${BASE_URL}/users/${id}`);
  
  if (response.ok) {
    const user = await response.json();
    console.log('Usuario:', user);
    return user;
  } else {
    const error = await response.json();
    console.error('Error obteniendo usuario:', error);
    throw new Error(error.message);
  }
}

// Ejemplo 4: Actualizar usuario
async function updateUserExample(id: number) {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: 'John Updated',
      lastName: 'Doe Updated'
    })
  });

  if (response.ok) {
    const user = await response.json();
    console.log('Usuario actualizado:', user);
    return user;
  } else {
    const error = await response.json();
    console.error('Error actualizando usuario:', error);
    throw new Error(error.message);
  }
}

// Ejemplo 5: Eliminar usuario (soft delete)
async function deleteUserExample(id: number) {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    console.log('Usuario eliminado correctamente');
  } else {
    const error = await response.json();
    console.error('Error eliminando usuario:', error);
    throw new Error(error.message);
  }
}

// Ejemplo 6: Eliminar usuario permanentemente
async function hardDeleteUserExample(id: number) {
  const response = await fetch(`${BASE_URL}/users/${id}/hard`, {
    method: 'DELETE'
  });

  if (response.ok) {
    console.log('Usuario eliminado permanentemente');
  } else {
    const error = await response.json();
    console.error('Error eliminando usuario:', error);
    throw new Error(error.message);
  }
}

// Función para ejecutar todos los ejemplos
async function runAllExamples() {
  try {
    console.log('🚀 Iniciando ejemplos HTTP...\n');

    // 1. Crear usuario
    console.log('1. Creando usuario...');
    const newUser = await createUserExample();
    
    // 2. Obtener todos los usuarios
    console.log('\n2. Obteniendo todos los usuarios...');
    await getUsersExample();
    
    // 3. Obtener usuario por ID
    console.log('\n3. Obteniendo usuario por ID...');
    await getUserByIdExample(newUser.id);
    
    // 4. Actualizar usuario
    console.log('\n4. Actualizando usuario...');
    await updateUserExample(newUser.id);
    
    // 5. Eliminar usuario
    console.log('\n5. Eliminando usuario...');
    await deleteUserExample(newUser.id);
    
    console.log('\n✅ Todos los ejemplos ejecutados correctamente');
    
  } catch (error) {
    console.error('❌ Error ejecutando ejemplos:', error);
  }
}

// Ejemplo con manejo de errores mejorado
async function createUserWithValidation() {
  try {
    // Intento crear usuario con datos inválidos
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid-email', // Email inválido
        username: 'ab', // Username muy corto
        password: '123' // Contraseña muy corta
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.log('Errores de validación esperados:', error);
      return;
    }

    const user = await response.json();
    console.log('Usuario creado:', user);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Exportar funciones para uso
export {
  createUserExample,
  getUsersExample,
  getUserByIdExample,
  updateUserExample,
  deleteUserExample,
  hardDeleteUserExample,
  runAllExamples,
  createUserWithValidation
};

// Si este archivo se ejecuta directamente
if (require.main === module) {
  runAllExamples();
}
