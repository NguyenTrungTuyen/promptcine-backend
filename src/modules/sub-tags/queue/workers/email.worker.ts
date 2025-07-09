import { OnModuleInit } from '@nestjs/common';
import { Worker, Job } from 'bullmq';

export class EmailWorker implements OnModuleInit {
  onModuleInit() {
    const worker = new Worker(
      'email',
      async (job: Job) => {
        const { email, subject, body } = job.data;
        console.log(` Gửi đến: ${email}`);
        console.log(` ${subject}`);
        console.log(` ${body}`);
      },
      {
        connection: { host: 'localhost', port: 6379 },
      },
    );
  }
}
