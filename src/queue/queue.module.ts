import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ImageProcessor } from './processors/image.processor';
import { SceneModule } from '../modules/scene/scene.module';
import { AiJobModule } from '../modules/ai-job/ai-job.module';
import { ImageService } from '../services/ai/image.service';
import { QUEUE_NAMES } from '../config/queue.config';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      },
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.GENERATE_IMAGE,
    }),
    SceneModule,
    AiJobModule,
  ],
  providers: [ImageProcessor, ImageService],
})
export class QueueModule {}
