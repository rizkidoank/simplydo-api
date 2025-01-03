import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const currentUser: User | null = await this.userRepository.findOne({ where: { id: userId } });
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }
    const task: Task | null = this.taskRepository.create(createTaskDto);
    task.user = currentUser;

    return this.taskRepository.save(task);
  }

  async findAll(userId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      withDeleted: false,
    });
  }

  async findDeleted(userId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { user: { id: userId }, deletedAt: Not(IsNull()) },
      relations: ['user'],
      withDeleted: true,
    });
  }

  async findOne(id: string, userId: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id, user: { id: userId } },
        relations: ['user'],
        withDeleted: false,
      });

      if (!task) {
        throw new NotFoundException(`task with id ${id} not found`);
      }

      return task;
    } catch {
      throw new BadRequestException(`An error occurred while fetching the task`);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    if (Object.keys(updateTaskDto).length === 0) {
      throw new BadRequestException('No data provided to update');
    }
    const task = await this.findOne(id, userId);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.softDelete({ id: task.id });
  }

  async removeTrash(userId: string): Promise<void> {
    const tasks: Task[] = await this.findDeleted(userId);
    await this.taskRepository.remove(tasks);
  }

  async restore(id: string, userId: string): Promise<void> {
    const task: Task | null = await this.taskRepository.findOne({
      where: { id, user: { id: userId }, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
    if (!task) {
      throw new NotFoundException(`task with id ${id} not found`);
    }
    await this.taskRepository.recover(task);
  }
}
