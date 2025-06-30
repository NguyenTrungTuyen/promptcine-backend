import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { QUEUE_NAMES } from '../../config/queue.config';

@Processor(QUEUE_NAMES.GENERATE_IMAGE)
export class ImageProcessor extends WorkerHost {
  async process(job: Job): Promise<any> {
    // xử lý job tại đây
    return { success: true };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    console.log(`✅ Image job ${job.id} completed:`, result);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    console.error(`❌ Image job ${job.id} failed:`, error.message);
  }
}
