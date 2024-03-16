// src/logging/logging.module.ts

import { Module, Global } from '@nestjs/common';
import { RootConfig } from '../config/env.validation';
import { DatadogLogger } from '@/utils/datadog/datadog';

@Global() // Make this module global
@Module({
  providers: [
    {
      provide: DatadogLogger,
      useFactory: (rootConfig: RootConfig) => new DatadogLogger(rootConfig),
      inject: [RootConfig],
    },
  ],
  exports: [DatadogLogger],
})
export class LoggingModule {}
