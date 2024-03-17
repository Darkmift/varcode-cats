import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RootConfig } from './config/env.validation';
import { initSwagger } from './utils/swagger/config';
import { DatadogLogger } from './utils/datadog/datadog';
import AllExceptionsFilter from './common/filters/http-exception-filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rootConfig = app.get(RootConfig);
  const { PORT, FRONTEND_ORIGIN } = rootConfig;
  const allowedOrigins = FRONTEND_ORIGIN.split(',');

  try {
    // Use DatadogLogger with the configuration
    const logger = new DatadogLogger(rootConfig);
    app.useLogger(logger);

    // apply global exception filter
    const filter = new AllExceptionsFilter(logger);
    app.useGlobalFilters(filter);

    // apply with class-validator
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true, // Automatically transform payloads to match DTO classes
      }),
    );

    // swagger setup
    initSwagger(app);

    // for cookie token authentication
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept',
      credentials: true,
    });
    app.use(cookieParser());

    await app.listen(PORT);
    Logger.log(`Server started on port ${PORT}`);
  } catch (error) {
    Logger.error(`Failed to start the app: ${error}`);
  }
}
bootstrap();
