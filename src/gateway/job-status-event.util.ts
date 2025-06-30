import { JobStatusGateway } from './job-status.gateway';

export function notifyJobUpdate(jobId: string, status: string, result?: any) {
  JobStatusGateway.emitJobStatusUpdate(jobId, {
    status,
    ...(result && { result }),
  });
}
