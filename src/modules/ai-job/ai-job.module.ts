import { forwardRef, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AiJobService } from './ai-job.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AiJob, AiJobSchema } from '../../database/schemas/ai-job.schema';
import { EpisodeModule } from '../episode/episode.module';
import { SceneModule } from '../scene/scene.module';
import {
  AiJobLog,
  AiJobLogSchema,
} from '../../database/schemas/ai-job-log.schema';
import { QUEUE_NAMES } from '../../config/queue.config';
import { AiJobLogModule } from '../ai-job-log/ai-job-log.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AiJob.name, schema: AiJobSchema },
      { name: AiJobLog.name, schema: AiJobLogSchema },
    ]),
    BullModule.registerQueue(
      {
        name: QUEUE_NAMES.GENERATE_IMAGE,
      },
      {
        name: QUEUE_NAMES.GENERATE_VIDEO,
      },
    ),
    forwardRef(() => SceneModule),
    forwardRef(() => EpisodeModule),
    forwardRef(() => AiJobLogModule),
  ],
  providers: [AiJobService],
  controllers: [],
  exports: [AiJobService],
})
export class AiJobModule {}
