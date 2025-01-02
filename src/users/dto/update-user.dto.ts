import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsStrongPassword } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsStrongPassword({ minLength: 12 })
  currentPassword?: string;

  @IsOptional()
  @IsStrongPassword({ minLength: 12 })
  newPassword?: string;
}
