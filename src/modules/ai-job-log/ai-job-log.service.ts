import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AiJobLog } from '../../database/schemas/ai-job-log.schema';
import { Model } from 'mongoose';

@Injectable()
export class AiJobLogService {
  constructor(
    @InjectModel(AiJobLog.name) private readonly model: Model<AiJobLog>,
  ) {}

  async log(data: Partial<AiJobLog>) {
    return this.model.create(data);
  }

  async findLogsForJob(jobId: string) {
    return this.model.find({ aiJobId: jobId }).sort({ createdAt: -1 }).lean();
  }
}
