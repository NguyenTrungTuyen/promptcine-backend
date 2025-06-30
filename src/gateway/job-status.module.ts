import { Module } from '@nestjs/common';
import { JobStatusGateway } from './job-status.gateway';

@Module({
  providers: [JobStatusGateway],
  exports: [JobStatusGateway],
})
export class GatewayModule {}
