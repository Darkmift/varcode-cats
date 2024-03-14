import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { RootConfig } from './config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { PORT, FRONTEND_ORIGIN } = app.get(RootConfig);

  const allowedOrigins = FRONTEND_ORIGIN.split(',');
  console.log('🚀 ~ bootstrap ~ allowedOrigins:', allowedOrigins);

  try {
    await app.listen(PORT);
    Logger.log(`Server started on port ${PORT}`);
  } catch (error) {
    Logger.error(`Failed to start the app: ${error}`);
  }
}
bootstrap();
