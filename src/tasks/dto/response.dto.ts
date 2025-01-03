import { Exclude, Expose, Type } from 'class-transformer';
import { BaseResponseDto } from '../../shared/dto/base.response';
import { UserResponseDto } from '../../users/dto/response.dto';

@Exclude()
export class TaskResponseDto extends BaseResponseDto {
  @Expose()
  summary: string;

  @Expose()
  description: string;

  @Expose()
  status: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
