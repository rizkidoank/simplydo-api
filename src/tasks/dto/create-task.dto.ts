import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  summary: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  status!: string;
}
