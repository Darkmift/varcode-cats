import { Injectable } from '@nestjs/common';
import { Transform, plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

@Injectable()
export class RootConfig {
  @IsNumber()
  PORT: number;
  @IsString()
  FRONTEND_ORIGIN: string;
  @IsString()
  DATADOG_API_KEY: string;
  @IsString()
  DATADOG_APP_KEY: string;
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(Environment)
  NODE_ENV: Environment;
  @IsString()
  POSTGRES_USER: string;
  @IsString()
  POSTGRES_PASSWORD: string;
  @IsString()
  POSTGRES_DB: string;
  @IsString()
  POSTGRES_HOST: string;
  @IsNumber()
  POSTGRES_PORT: number;
  @IsString()
  BCRYPT_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(RootConfig, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
