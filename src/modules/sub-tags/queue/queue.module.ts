import { Module } from '@nestjs/common';
import { EmailQueue } from './queues/email.queue';
import { EmailWorker } from './workers/email.worker';

@Module({
  providers: [EmailQueue, EmailWorker],
  exports: [EmailQueue], // để dùng được ở AuthModule
})
export class QueueModule {}
