import { IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  username: string;

  @IsNotEmpty()
  @IsStrongPassword({ minLength: 12 })
  password: string;
}
