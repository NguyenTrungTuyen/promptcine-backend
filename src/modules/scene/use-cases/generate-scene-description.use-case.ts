import { Injectable, Logger } from '@nestjs/common';
import { SceneService } from '../scene.service';
import { EpisodeService } from '../../episode/episode.service';
import { AiJobService } from '../../ai-job/ai-job.service';
import { AiJobType } from '../../../interfaces/ai-job.interface';

@Injectable()
export class GenerateSceneDescriptionUseCase {
  private readonly logger = new Logger(GenerateSceneDescriptionUseCase.name);

  constructor(
    private readonly sceneService: SceneService,
    private readonly episodeService: EpisodeService,
    private readonly aiJobService: AiJobService,
  ) {}

  async execute(episodeId: string): Promise<{ jobId: string }> {
    const episode = await this.episodeService.findById(episodeId);

    const prompt = `
Phân tích kịch bản phim dưới đây thành các cảnh quay ngắn (6–8s mỗi cảnh). 
Mỗi cảnh bao gồm: mô tả, lời thoại (nếu có), và danh sách nhân vật xuất hiện.
Kết quả dạng JSON array như sau:
[
  {
    "description": "Cảnh trời bình minh trên đảo hoang...",
    "dialogue": "Hôm nay trời đẹp đấy nhỉ.",
    "characters": ["Mai", "Đốm"]
  },
  ...
]

Kịch bản:
${episode.script}
    `.trim();

    const job = await this.aiJobService.createJob({
      type: AiJobType.GENERATE_SCENE_DESCRIPTION,
      metadata: { episodeId, prompt },
    });

    return { jobId: job?._id?.toString() || '' };
  }
}
