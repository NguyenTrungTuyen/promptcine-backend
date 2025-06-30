import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AiJob } from '../../database/schemas/ai-job.schema';
import { Model } from 'mongoose';
import { AiJobStatus, AiJobType } from '../../interfaces/ai-job.interface';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../../config/queue.config';
import { AiJobLog } from '../../database/schemas/ai-job-log.schema';

@Injectable()
export class AiJobService {
  constructor(
    @InjectModel(AiJob.name) private readonly jobModel: Model<AiJob>,
    @InjectModel(AiJobLog.name) private readonly aiJobLogModel: Model<AiJobLog>,

    @InjectQueue(QUEUE_NAMES.GENERATE_IMAGE)
    private readonly imageQueue: Queue,

    @InjectQueue(QUEUE_NAMES.GENERATE_VIDEO)
    private readonly videoQueue: Queue,
  ) {}

  async createJob(data: {
    type: AiJobType;
    sceneId?: string;
    characterId?: string;
    metadata?: any;
  }): Promise<AiJob> {
    const job = await this.jobModel.create({
      type: data.type,
      status: AiJobStatus.PENDING,
      sceneId: data.sceneId,
      characterId: data.characterId,
      metadata: data.metadata,
    });

    const queue = this.resolveQueueByType(data.type);
    await queue.add(data.type, { jobId: job?._id?.toString(), ...data.metadata });

    return job;
  }

  private resolveQueueByType(type: AiJobType): Queue {
    switch (type) {
      case AiJobType.GENERATE_IMAGE:
        return this.imageQueue;
      case AiJobType.GENERATE_VIDEO:
        return this.videoQueue;
      default:
        throw new Error(`Queue for job type "${type}" not implemented.`);
    }
  }

  async updateStatus(id: string, status: AiJobStatus, result?: any) {
    return this.jobModel.findByIdAndUpdate(id, {
      status,
      result,
      updatedAt: new Date(),
    });
  }
  async markProcessing(id: string) {
    return this.updateStatus(id, AiJobStatus.PROCESSING);
  }

  async markDone(id: string, data?: { result: string }) {
    return this.updateStatus(id, AiJobStatus.DONE, data?.result);
  }

  async markError(id: string, errorMessage: string) {
    return this.updateStatus(id, AiJobStatus.ERROR, {
      errorMessage,
    });
  }

  async logJobExecution(log: {
    aiJobId: string;
    prompt?: string;
    seed?: string;
    provider?: string;
    originalPrompt?: string;
    finalPrompt?: string;
    rawRequest?: any;
    rawResponse?: any;
    errorMessage?: string;
  }) {
    return this.aiJobLogModel.create({
      ...log,
      createdAt: new Date(),
    });
  }
}
