import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createSwaggerDocument } from './swagger/swagger.module';
import { setupWebSocketAdapter } from './gateway/job-status.gateway';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();

const configService = app.get(ConfigService);
const port = configService.get<number>('PORT') || 3030;

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
  
  const config = new DocumentBuilder()
  .setTitle('API Sub-Tag Brand')            // Tiêu đề
  .setDescription('Tài liệu API cho dự án NestJS') // Mô tả
  .setVersion('1.0')                   // Version
  // .addBearerAuth()   
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);

  // setupWebSocketAdapter(app); // Gateway for real-time status
  
  await app.listen(port);
  console.log(`Server is running at http://localhost:${port}`);
  console.log ("PORT:", configService.get<number>('PORT'));
  console.log ("DB:",configService.get<string>('MONGODB_URI'));
}
bootstrap();
