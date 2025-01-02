import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RegisterResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  name: string;
}

export class JwtValidateResponseDto {
  userId: string;
  username: string;
}

export class JwtLoginResponseDto {
  access_token: string;
  tokenType: string;
}
