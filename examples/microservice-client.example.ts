import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

/**
 * Ejemplo de cliente para comunicarse con el microservicio de usuarios
 * usando patrones de mensajes TCP
 */
export class UserMicroserviceClient {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4001, // Puerto del microservicio TCP
      },
    });
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  // Crear usuario
  async createUser(userData: {
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    password: string;
  }) {
    return this.client.send({ cmd: 'create_user' }, userData).toPromise();
  }

  // Obtener todos los usuarios
  async getUsers() {
    return this.client.send({ cmd: 'get_users' }, {}).toPromise();
  }

  // Obtener usuario por ID
  async getUserById(id: number) {
    return this.client.send({ cmd: 'get_user' }, id).toPromise();
  }

  // Obtener usuario por email
  async getUserByEmail(email: string) {
    return this.client.send({ cmd: 'get_user_by_email' }, email).toPromise();
  }

  // Obtener usuario por username
  async getUserByUsername(username: string) {
    return this.client.send({ cmd: 'get_user_by_username' }, username).toPromise();
  }

  // Actualizar usuario
  async updateUser(id: number, updateData: {
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    isActive?: boolean;
  }) {
    return this.client.send({ cmd: 'update_user' }, { id, updateUserDto: updateData }).toPromise();
  }

  // Eliminar usuario (soft delete)
  async deleteUser(id: number) {
    return this.client.send({ cmd: 'delete_user' }, id).toPromise();
  }

  // Eliminar usuario permanentemente
  async hardDeleteUser(id: number) {
    return this.client.send({ cmd: 'hard_delete_user' }, id).toPromise();
  }
}

// Ejemplo de uso
async function exampleUsage() {
  const userClient = new UserMicroserviceClient();
  await userClient.onModuleInit();

  try {
    // Crear un nuevo usuario
    const newUser = await userClient.createUser({
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      password: 'password123'
    });
    console.log('Usuario creado:', newUser);

    // Obtener todos los usuarios
    const users = await userClient.getUsers();
    console.log('Todos los usuarios:', users);

    // Obtener usuario por ID
    const user = await userClient.getUserById(newUser.id);
    console.log('Usuario por ID:', user);

    // Actualizar usuario
    const updatedUser = await userClient.updateUser(newUser.id, {
      firstName: 'Test Updated'
    });
    console.log('Usuario actualizado:', updatedUser);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await userClient.onModuleDestroy();
  }
}

// Exportar para uso en otros módulos
export { exampleUsage };
