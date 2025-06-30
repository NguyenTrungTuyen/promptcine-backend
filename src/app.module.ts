import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueModule } from './queue/queue.module';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './modules/project/project.module';
import { EpisodeModule } from './modules/episode/episode.module';
import { SceneModule } from './modules/scene/scene.module';
import { CharacterModule } from './modules/character/character.module';
import { AiJobModule } from './modules/ai-job/ai-job.module';
import { AiJobLogModule } from './modules/ai-job-log/ai-job-log.module';
import { GatewayModule } from './gateway/job-status.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ResponseHandlerMiddleware } from './common/middleware/response-handler.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI', { infer: true }),
      }),
    }),
    DatabaseModule,
    QueueModule,
    ProjectModule,
    EpisodeModule,
    SceneModule,
    CharacterModule,
    AiJobModule,
    AiJobLogModule,
    GatewayModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, ResponseHandlerMiddleware).forRoutes('*');
  }
}
