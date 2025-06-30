import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { AiJobService } from '../ai-job.service';
import { SceneService } from '../../scene/scene.service';
import { EpisodeService } from '../../episode/episode.service';
import { AiJobType } from '../../../interfaces/ai-job.interface';
import { callGenerateSceneDescriptions } from '../../../utils/ai-helper';
import { AiJob } from '../../../database/schemas/ai-job.schema';

@Processor(AiJobType.GENERATE_SCENE_DESCRIPTION)
export class GenerateSceneDescriptionProcessor {
  private readonly logger = new Logger(GenerateSceneDescriptionProcessor.name);

  constructor(
    private readonly aiJobService: AiJobService,
    private readonly sceneService: SceneService,
    private readonly episodeService: EpisodeService,
  ) {}

  async handle(job: Job<AiJob>) {
    const { _id, episodeId, script, duration } = job.data;

    if (!episodeId || !script) {
      return;
    }
    try {
      await this.aiJobService.markProcessing(_id as string);

      const scenes = callGenerateSceneDescriptions(script, duration as number);

      await this.sceneService.bulkInsertScenes(episodeId?.toString(), scenes);

      await this.episodeService.updateSceneCount(
        episodeId?.toString(),
        scenes.length,
      );

      await this.aiJobService.markDone(_id as string, {
        result: scenes.length?.toString(),
      });

      // await this.aiJobService.logJobExecution({
      //   aiJobId: _id,
      //   prompt: script,
      //   finalPrompt: script,
      //   rawResponse: scenes,
      // });
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          `❌ Scene description generation failed: ${err.message}`,
        );
        await this.aiJobService.markError(_id as string, err.message);
      } else {
        this.logger.error('❌ Scene description generation failed: Unknown error');
        await this.aiJobService.markError(_id as string, 'Common error');
      }
    }
  }
}
