import { ApiProperty } from '@nestjs/swagger';
import { ILoginParams, ILoginResult, Role } from '../auth.types';
import { IsAlphanumeric, IsString, Length } from 'class-validator';
import { th } from '@faker-js/faker';

export class LoginResultDto implements ILoginResult {
  constructor(loginResult: ILoginResult) {
    this.token = loginResult.token;
    this.role = loginResult.role || Role.USER;
    this.username = loginResult.username;
    this.lastname = loginResult.lastname;
    this.firstname = loginResult.firstname;
    this.cat_type_id = loginResult.cat_type_id;
  }
  token: string;
  role: Role;
  username: string;

  @ApiProperty({ example: 'Dunham', description: 'last name of the user' })
  lastname: string;

  @ApiProperty({ example: 'Jeff', description: 'First name of the user' })
  firstname: string;

  // add cat_type
  @ApiProperty({ example: 'cat', description: 'type of the cat' })
  cat_type_id: string;
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
