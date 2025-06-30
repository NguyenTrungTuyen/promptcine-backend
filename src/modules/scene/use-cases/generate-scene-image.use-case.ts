import { Injectable } from '@nestjs/common';
import { SceneService } from '../scene.service';
import { AiJobService } from '../../ai-job/ai-job.service';
import { AiJobType } from '../../../interfaces/ai-job.interface';

@Injectable()
export class GenerateSceneImageUseCase {
  constructor(
    private readonly sceneService: SceneService,
    private readonly aiJobService: AiJobService,
  ) {}

  async execute(sceneId: string) {
    const scene = await this.sceneService.findById(sceneId);

    const prompt = scene.prompt || `Generate a cinematic frame of: ${scene.description}`;

    return this.aiJobService.createJob({
      type: AiJobType.GENERATE_IMAGE,
      sceneId,
      metadata: { prompt },
    });
  }
}
