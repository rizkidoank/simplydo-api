import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [TasksController],
  exports: [TasksService],
  imports: [TypeOrmModule.forFeature([Task, User]), UsersModule],
  providers: [TasksService],
})
export class TasksModule {}
