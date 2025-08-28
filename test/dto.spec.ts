import { validate } from 'class-validator';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UpdateUserDto } from '../src/users/dto/update-user.dto';

describe('User DTOs', () => {
  describe('CreateUserDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@example.com';
      dto.username = 'testuser';
      dto.password = 'Password123!';
      dto.firstName = 'Test';
      dto.lastName = 'User';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with minimal required data', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@example.com';
      dto.username = 'testuser';
      dto.password = 'Password123!';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      const dto = new CreateUserDto();
      dto.email = 'invalid-email';
      dto.username = 'testuser';
      dto.password = 'Password123!';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should fail validation with empty email', async () => {
      const dto = new CreateUserDto();
      dto.email = '';
      dto.username = 'testuser';
      dto.password = 'Password123!';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation with short username', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@example.com';
      dto.username = 'te'; // Less than 3 characters
      dto.password = 'Password123!';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('username');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail validation with empty username', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@example.com';
      dto.username = '';
      dto.password = 'Password123!';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('username');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation with short password', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@example.com';
      dto.username = 'testuser';
      dto.password = '12345'; // Less than 6 characters

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail validation with empty password', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@example.com';
      dto.username = 'testuser';
      dto.password = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation with non-string firstName', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@example.com';
      dto.username = 'testuser';
      dto.password = 'Password123!';
      (dto as any).firstName = 123; // Not a string

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('firstName');
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('UpdateUserDto', () => {
    it('should pass validation with valid partial data', async () => {
      const dto = new UpdateUserDto();
      dto.firstName = 'Updated';
      dto.lastName = 'Name';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty object', async () => {
      const dto = new UpdateUserDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with valid email update', async () => {
      const dto = new UpdateUserDto();
      dto.email = 'updated@example.com';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      const dto = new UpdateUserDto();
      dto.email = 'invalid-email';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should pass validation with valid password update', async () => {
      const dto = new UpdateUserDto();
      dto.password = 'NewPassword123!';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with short password', async () => {
      const dto = new UpdateUserDto();
      dto.password = '12345'; // Less than 6 characters

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should pass validation with isActive boolean', async () => {
      const dto = new UpdateUserDto();
      dto.isActive = false;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with non-boolean isActive', async () => {
      const dto = new UpdateUserDto();
      (dto as any).isActive = 'false'; // String instead of boolean

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('isActive');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });

    it('should pass validation with valid username update', async () => {
      const dto = new UpdateUserDto();
      dto.username = 'newusername';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with short username', async () => {
      const dto = new UpdateUserDto();
      dto.username = 'te'; // Less than 3 characters

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('username');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });
  });
});
