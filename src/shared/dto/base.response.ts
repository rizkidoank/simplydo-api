import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BaseResponseDto {
  @Expose()
  id: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  @Expose()
  deletedAt!: Date;
}
