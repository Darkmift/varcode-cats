import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  try {
    await app.listen(configService.get('PORT'));
    Logger.log(`Server started on port ${configService.get('PORT')}`);
  } catch (error) {
    Logger.error(`Failed to start the app: ${error}`);
  }
}
bootstrap();
