import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfig } from '../config/mongo.config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // MongooseModule.forRoot(MongoConfig.uri),
      MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/MovieDB'),
          }),
        }),
  ],
})
export class DatabaseModule {}
