import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum TaskStatus {
  BACKLOG = 'backlog',
  TO_DO = 'to_do',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Entity()
export class Task extends BaseEntity {
  @Column()
  summary: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.BACKLOG })
  status: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
