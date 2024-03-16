import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

export class RootConfig {
  @IsNumber()
  PORT: number;
  @IsString()
  FRONTEND_ORIGIN: string;
  @IsString()
  DATADOG_API_KEY: string;
  @IsString()
  DATADOG_APP_KEY: string;
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
