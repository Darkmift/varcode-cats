import { ApiProperty } from '@nestjs/swagger';
import { ILoginParams, ILoginResult } from '../auth.types';
import { IsAlphanumeric, IsString, Length } from 'class-validator';

export class LoginResultDto implements ILoginResult {
  token: string;
  role: 'admin' | 'user';
  username: string;

  @ApiProperty({ example: 'Dunham', description: 'last name of the user' })
  lastname: string;

  @ApiProperty({ example: 'Jeff', description: 'First name of the user' })
  firstname: string;
}

export class LoginParamsDto implements ILoginParams {
  @ApiProperty({ example: 'jeffPhapha', description: 'username of the user' })
  @IsString()
  @IsAlphanumeric()
  @Length(4, 20)
  username: string;

  @ApiProperty({ example: 'password', description: 'password of the user' })
  @IsString()
  @Length(8, 32)
  password: string;
}
