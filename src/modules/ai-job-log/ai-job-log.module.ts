import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AiJobLog,
  AiJobLogSchema,
} from '../../database/schemas/ai-job-log.schema';
import { AiJobLogService } from './ai-job-log.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AiJobLog.name, schema: AiJobLogSchema },
    ]),
  ],
  providers: [AiJobLogService],
  exports: [AiJobLogService],
})
export class AiJobLogModule {}
