import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // HTTP Endpoints (para comunicación directa)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  async hardDelete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.hardDelete(id);
  }

  // Microservice Message Patterns (para comunicación entre microservicios)
  @MessagePattern({ cmd: 'create_user' })
  async createUserMessage(@Payload() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'get_users' })
  async getUsersMessage(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'get_user' })
  async getUserMessage(@Payload() id: number): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @MessagePattern({ cmd: 'get_user_by_email' })
  async getUserByEmailMessage(@Payload() email: string): Promise<UserResponseDto | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const { password, ...userResponse } = user;
    return userResponse;
  }

  @MessagePattern({ cmd: 'get_user_by_username' })
  async getUserByUsernameMessage(@Payload() username: string): Promise<UserResponseDto | null> {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;
    const { password, ...userResponse } = user;
    return userResponse;
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUserMessage(@Payload() data: { id: number; updateUserDto: UpdateUserDto }): Promise<UserResponseDto> {
    return this.usersService.update(data.id, data.updateUserDto);
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUserMessage(@Payload() id: number): Promise<void> {
    return this.usersService.remove(id);
  }

  @MessagePattern({ cmd: 'hard_delete_user' })
  async hardDeleteUserMessage(@Payload() id: number): Promise<void> {
    return this.usersService.hardDelete(id);
  }
}
