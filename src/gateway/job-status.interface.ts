export interface JobStatusPayload {
  jobId: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  result?: {
    imageUrl?: string;
    videoUrl?: string;
    errorMessage?: string;
  };
}
