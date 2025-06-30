import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { createSwaggerDocument } from './swagger/swagger.module';
import { setupWebSocketAdapter } from './gateway/job-status.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: false,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  setupWebSocketAdapter(app); // Gateway for real-time status

  const document = createSwaggerDocument(app);
  SwaggerModule.setup('api/v1/docs', app, document);
  const SERVER_PORT = process.env.PORT || 3000;
  await app.listen(SERVER_PORT);
  Logger.log(`🚀 Application is running on: http://localhost:${SERVER_PORT}`);
  Logger.log(
    `Swagger is available at: http://localhost:${SERVER_PORT}/api/v1/docs`,
  );
}
bootstrap();
