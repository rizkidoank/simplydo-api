import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EncryptionsService } from '../encryptions/encryptions.service';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './auth.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { RegisterResponseDto } from './dto/responses.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly encryptionsService: EncryptionsService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new BadRequestException("user doesn't exists");
    }
    const isValid: boolean = await this.encryptionsService.comparePassword(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async login(loginDto: LoginDto) {
    const validatedUser = await this.validateUser(loginDto.username, loginDto.password);
    if (!validatedUser) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayload = { username: validatedUser.username, sub: validatedUser.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
      token_type: 'Bearer',
    };
  }

  async register(registerDto: RegisterDto) {
    const newUser: User = await this.usersService.create(registerDto);
    return plainToInstance(RegisterResponseDto, newUser);
  }
}
