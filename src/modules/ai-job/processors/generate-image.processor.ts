import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { AiJob } from '../../../database/schemas/ai-job.schema';
import { SceneService } from '../../scene/scene.service';
import { AiJobService } from '../ai-job.service';
import { callTextToImage } from '../../../utils/ai-helper';

@Processor('ai-job-queue')
export class GenerateImageProcessor {
  private readonly logger = new Logger(GenerateImageProcessor.name);

  constructor(
    private readonly sceneService: SceneService,
    private readonly aiJobService: AiJobService,
  ) {}

  async handle(job: Job<AiJob>) {
    const { _id, sceneId, metadata } = job.data;

    try {
      if (!_id || !sceneId) {
        return;
      }
      await this.aiJobService.markProcessing(_id as string);

      const prompt = metadata?.prompt;
      if (!prompt) throw new Error('Missing prompt');

      const { imageUrl, seed } = await callTextToImage(prompt);

      // Cập nhật scene
      await this.sceneService.updateImage(sceneId.toString(), imageUrl, prompt);

      await this.aiJobService.markDone(_id as string, {
        result: imageUrl,
      });

      // Lưu log nếu cần
      await this.aiJobService.logJobExecution({
        aiJobId: _id as string,
        prompt,
        seed,
        finalPrompt: prompt,
        rawResponse: { imageUrl },
      });
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`❌ Image generation failed: ${err?.message}`);
        await this.aiJobService.markError(_id as string, err.message);
      } else {
        this.logger.error('❌ Image generation failed: Unknown error');
        await this.aiJobService.markError(_id as string, 'Common error');
      }
    }
  }
}
