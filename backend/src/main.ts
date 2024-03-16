import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RootConfig } from './config/env.validation';
import { initSwagger } from './utils/swagger/config';
import { DatadogLogger } from './utils/datadog/datadog';
import AllExceptionsFilter from './common/filters/http-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rootConfig = app.get(RootConfig);
  const { PORT, FRONTEND_ORIGIN } = rootConfig;
  // const allowedOrigins = FRONTEND_ORIGIN.split(',');

  try {
    // Use DatadogLogger with the configuration
    const logger = new DatadogLogger(rootConfig);
    app.useLogger(logger);

    const filter = new AllExceptionsFilter(logger);
    app.useGlobalFilters(filter);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true, // Automatically transform payloads to match DTO classes
      }),
    );

    initSwagger(app);

    await app.listen(PORT);
    Logger.log(`Server started on port ${PORT}`);
  } catch (error) {
    Logger.error(`Failed to start the app: ${error}`);
  }
}
bootstrap();
