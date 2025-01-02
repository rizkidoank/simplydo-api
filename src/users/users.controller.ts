import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../auth/auth.decorator';
import { RoleGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Role('admin')
  @Get()
  async findAll() {
    const users: User[] = await this.usersService.findAll();
    return plainToInstance(UserResponseDto, users);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Req() req: any): Promise<UserResponseDto> {
    const user = await this.usersService.findById(req.user.userId);
    return plainToInstance(UserResponseDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  async patchProfile(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const userUpdate = await this.usersService.update(req.user.userId, updateUserDto);
    return plainToInstance(UserResponseDto, userUpdate);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  async remove(@Req() req: any) {
    return await this.usersService.remove(req.user.userId);
  }
}
