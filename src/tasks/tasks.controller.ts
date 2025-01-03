import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
import { Task } from './entities/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TaskResponseDto } from './dto/response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() request: Request,
  ): Promise<TaskResponseDto> {
    const user: User = request.user as User;
    const task: Promise<Task> = this.tasksService.create(createTaskDto, user.id);
    return plainToInstance(TaskResponseDto, task);
  }

  @Get()
  async findAll(@Req() request: Request): Promise<TaskResponseDto[]> {
    const user: User = request.user as User;
    const tasks: Task[] = await this.tasksService.findAll(user.id);
    return plainToInstance(TaskResponseDto, tasks);
  }

  @Get('trash')
  async findDeleted(@Req() request: Request): Promise<TaskResponseDto[]> {
    const user: User = request.user as User;
    const tasks: Task[] = await this.tasksService.findDeleted(user.id);
    return plainToInstance(TaskResponseDto, tasks);
  }

  @Delete('trash')
  async emptyTrash(@Req() request: Request): Promise<void> {
    const user: User = request.user as User;
    await this.tasksService.removeTrash(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: Request): Promise<TaskResponseDto> {
    const user: User = request.user as User;
    const task: Promise<Task> = this.tasksService.findOne(id, user.id);
    return plainToInstance(TaskResponseDto, await task);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() request: Request,
  ): Promise<TaskResponseDto> {
    const user: User = request.user as User;
    const task: Promise<Task> = this.tasksService.update(id, updateTaskDto, user.id);
    return plainToInstance(TaskResponseDto, task);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const user: User = request.user as User;
    return this.tasksService.remove(id, user.id);
  }

  @Post(':id/recover')
  async recover(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const user: User = request.user as User;
    return this.tasksService.restore(id, user.id);
  }
}
