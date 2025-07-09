import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailQueue {
  private queue = new Queue('email', {
    connection: { host: 'localhost', port: 6379 },
  });

  async sendWelcomeEmail(email: string) {
    await this.queue.add('sendEmail', {
      email,
      subject: 'Chào mừng!',
      body: 'Cảm ơn bạn đã đăng ký tài khoản.',
    });
  }
}
