import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();

export const initSwagger = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
