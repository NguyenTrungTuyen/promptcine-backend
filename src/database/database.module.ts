import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfig } from '../config/mongo.config';

@Module({
  imports: [
    MongooseModule.forRoot(MongoConfig.uri),
  ],
})
export class DatabaseModule {}
